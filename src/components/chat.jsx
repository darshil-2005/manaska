import {Textarea} from "../components/ui/textarea.tsx"
import {Button} from "../components/ui/button.tsx"
import {Input} from "../components/ui/input.tsx"
import {Label} from "../components/ui/label.tsx"
import { ArrowBigRight, File } from "lucide-react"
import { useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify";
import { useTheme } from "next-themes"
import axios from 'axios'


const MAX_FILE_SIZE = 5_242_880;

export default function Chat({messages}) {

  const [input, setInput] = useState("");
  const [parsedFiles, setParsedFiles] = useState([]);
  const [processingFile, setProcessingFile] = useState(false);


  const {theme, setTheme} = useTheme(); 


  function handleInputChange(d) {
    setInput(d.target.value);
  }

  async function handleFileInput(d) {

    setProcessingFile(true);
    
    const file = d.target.files[0];

    if (file == undefined) {
      toast.error("No file input received!");    
      return -1;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Files only upto 5MB are allowed.");
      return -1;
    }
  
    if (!file.type.startsWith("image") && !(file.type == "application/pdf")) {
      toast.error("Not a valid file type!");
      return -1;
    }



    if (file.type.startsWith("image")) {

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_FILE_CHAT_SERVER}/extract-image`, formData);

      console.log("Response: ", response);
    }
    
    


    console.log("Files: ", process.env.NEXT_PUBLIC_FILE_CHAT_SERVER)
    setProcessingFile(false);
  }

  return (
    <div className="flex h-full px-2 flex-col justify-between">

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


    <div className="h-[90%] mt-2 text-xl tracking-wider">
      
      {(messages.length <= 0) && (
        <div className="flex flex-col h-full items-center justify-center text-muted-foreground text-center">
        <div className="text-2xl font-semibold mb-3">
        Manaska
        </div>
          Start Understaning Here...
        </div>
      )}

    </div>
    
    <div className="px-1 py-2 flex items-center gap-x-2 bg-gray-800">
      <Textarea value={input} onChange={handleInputChange} placeholder="Ask away..."/>
    <div className="flex flex-col gap-y-2 items-center justify-center">
      <Label className="border p-2 rounded-full bg-accent/90 hover:bg-accent">
        { !processingFile && <File className="size-4"/>}
        { processingFile && <span className="animate-spin">C</span>}
        <Input type="file" className="hidden" onChange={handleFileInput} accept="image/*, application/pdf, .pdf, .jpg, .jpeg, .png"/>
      </Label>
      <Button className="rounded-full"><ArrowBigRight/></Button>
    </div>
    </div>


    </div>
  )
}
