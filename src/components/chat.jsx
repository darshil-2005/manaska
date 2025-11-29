import {Textarea} from "../components/ui/textarea.tsx"
import {Button} from "../components/ui/button.tsx"
import {Input} from "../components/ui/input.tsx"
import {Label} from "../components/ui/label.tsx"
import { ArrowBigRight, File } from "lucide-react"
import { useState, useEffect } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify";
import { useTheme } from "next-themes"
import axios from 'axios'
import { parseMindmapToDSL } from "../utils/parseMindmapToDSL.js"


const MAX_FILE_SIZE = 5_242_880;

export default function Chat({messages, setMessages, scriptCode, setScriptCode}) {

  const [input, setInput] = useState("");
  const [parsedFiles, setParsedFiles] = useState([]);
  const [processingFile, setProcessingFile] = useState(false);
  const [jsonMap, setJsonMap] = useState(undefined);

  useEffect(() => {
    if (messages.length > 1) {
      setJsonMap(messages[1]);
    }
  }, [messages])

  const {theme, setTheme} = useTheme(); 

  function handleInputChange(d) {
    setInput(d.target.value);
  }

  async function handleFileInput(d) {

    setProcessingFile(true);

    if (messages.length > 0) {
      toast.error("File input only available for generation!!");
    }

    if (parsedFiles.length > 3) {
      toast.error("Can only input upto 3 files.")
      setProcessingFile(false);
      return -1;
    }

    const file = d.target.files[0];

    if (file == undefined) {
      toast.error("No file input received!");    
      setProcessingFile(false);
      return -1;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Files only upto 5MB are allowed.");
      setProcessingFile(false);
      return -1;
    }

    if (!file.type.startsWith("image") && !(file.type == "application/pdf")) {
      toast.error("Not a valid file type!");
      setProcessingFile(false);
      return -1;
    }

    let response;

    try {
      if (file.type.startsWith("image")) {

        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post(`${process.env.NEXT_PUBLIC_FILE_CHAT_SERVER}/extract-image`, formData);
      }
      else if (file.type == "application/pdf") {

        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post(`${process.env.NEXT_PUBLIC_FILE_CHAT_SERVER}/extract-pdf`, formData);
      }

      if (response?.status != 200) {
        toast.error("Error parsing file!")
        setProcessingFile(false);
        return -1;
      }

      const output = response.data.text;
      setParsedFiles([...parsedFiles, output]);

    } catch (error) {

      console.error("File processing failed:", error);
      toast.error("File parsing failed!");
      return -1;
    } finally {

      setProcessingFile(false);
    }
  }

  async function handlePrompt() {

    const prompt = input;

    if (!prompt) {
      toast.error("No input prompt.");
      return -1;
    }

    if (messages.length <= 0) {

      if (!parsedFiles || parsedFiles.length > 3) {
        toast.error("Only upto 3 files allowed!")
        return -1;
      }

      const fileInput = parsedFiles.join("\n");
      const fullPrompt = fileInput + "\n" + input;

      let response;

      try {

        const data = {
          model: "gemini-2.5-flash",
          api_key: process.env.NEXT_PUBLIC_TEMP_API_KEY || "No-key",
          topic: fullPrompt,
          max_tokens: 800,
          temperature: 0.2,
        };

        response = await axios.post(`${process.env.NEXT_PUBLIC_FILE_CHAT_SERVER}/mindmap/generate`, data);

        if (response?.status != 200) {
          toast.error("Corrupted response received!");
        }

        let jsonMap = response?.data?.mindmap;
        setJsonMap(jsonMap);
        let script = parseMindmapToDSL(jsonMap, "radial");

        setScriptCode(scriptCode + "\n\n" + script);
        setInput("");
        setMessages([...messages, fullPrompt, JSON.stringify(jsonMap)]);

      } catch (error) {
        toast.error("Error generating mindmap. Please try again!");
        return -1;
      }
    }
    else if (messages.length > 0) {

      if (messages.length > 10) {
        toast.error("Chat limit reached!!");
        return -1;
      }

      if (jsonMap == undefined) {
        toast.error("Json Map not found")
      }

      if (input == "") {
        toast.error("No prompt entered!!");
        return -1;
      }

      let response;

      try {

        const data = {
          model: "gemini-2.5-flash",
          api_key: process.env.NEXT_PUBLIC_TEMP_API_KEY || "No-key",
          mindmap: jsonMap,
          question: input,
          max_tokens: 800,
          temperature: 0.2,
        }
        response = await axios.post(`${process.env.NEXT_PUBLIC_FILE_CHAT_SERVER}/mindmap/explain`, data);
        const explanation = response.data.explanation;
        setMessages([...messages, input, explanation])
        setInput("");

      } catch (error) {
        toast.error("Error processing prompt!!");
        console.log("Error: ", error)
        return -1;
      }
    }
  }

const MessageBubble = ({ content, index }) => {
  const isUser = index % 2 === 0;
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-2 sm:px-0`}>
      <div 
        className={`max-w-[90%] sm:max-w-[85%] p-2.5 sm:p-3 rounded-xl shadow-sm text-sm sm:text-base break-words ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-muted-foreground rounded-tl-none'
        }`}
        style={{ borderRadius: `var(--radius)` }}
      >
        {content}
      </div>
    </div>
  );
};

return (
    <div className="flex h-full px-1 sm:px-2 flex-col justify-between bg-sidebar text-sidebar-foreground rounded-lg" style={{ borderRadius: `var(--radius)` }}> 
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Zoom}
      />
      
      {/* Message Area: Takes remaining space, scrollable */}
      <div className="flex-grow overflow-y-auto pt-2 pb-4"> 
        {messages.length === 0 ? (
          // Welcome message when no messages are present
          <div className="flex flex-col h-full items-center justify-center text-muted-foreground text-center px-4">
            <div className="text-xl sm:text-2xl font-semibold mb-3">
              Manaska
            </div>
            <p className="text-sm sm:text-base">Enter your thoughts to generate mindmap...</p>
          </div>
        ) : (
          // Messages loop: Render all string messages
          <div className="h-full space-y-4">
            {messages.map((messageContent, index) => (
              <MessageBubble 
                key={index} 
                content={messageContent} 
                index={index} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Input Area: Fixed at the bottom */}
      <div className="px-1 py-2 flex items-end gap-x-2 border-t border-sidebar-border"> 
        <Textarea 
          value={input} 
          onChange={handleInputChange} 
          className="max-h-32 sm:max-h-40 flex-grow text-sm sm:text-base" 
          placeholder="Ask away..."
          rows={2}
        />
        <div className="flex flex-col gap-y-2 items-center justify-center">
          {/* File Input */}
          <Label className="border border-sidebar-border p-1.5 sm:p-2 rounded-full cursor-pointer bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
            {!processingFile && <File className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>}
            {processingFile && <span className="animate-spin text-base sm:text-lg">⚙️</span>}
            <Input type="file" className="hidden" onChange={handleFileInput} accept="image/*, application/pdf, .pdf, .jpg, .jpeg, .png"/>
          </Label>
          {/* Send Button */}
          <Button 
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 p-0" 
            onClick={handlePrompt}
          >
            <ArrowBigRight className="w-4 h-4 sm:w-5 sm:h-5"/>
          </Button>
        </div>
      </div>
    </div>
  );
}
