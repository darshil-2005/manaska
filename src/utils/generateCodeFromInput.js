//Written by: Jay Rathod (202301006)

import 'dotenv/config';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Takes user's thoughts in string format and outputs mindmap in code format.
export async function generateCodeFromInput(userText) {
  const promptTemplate = `
    You are an AI assistant that converts unstructured text into a structured mind map format.
    Follow these instructions strictly:

    1. Identify all main ideas, sub-ideas, and their relationships in the text.
    2. For each idea, create a Node in this exact format:

    Node <node-name> {{
        height: <number>,          // floating-point, e.g., 120.0
        width: <number>,           // floating-point, e.g., 200.0
        content: "<string>",       // text of the idea
        x: <number>,               // X position for layout
        y: <number>,               // Y position for layout
        backgroundColor: "<string>" // color name or code
    }};

    - Node names must be unique, meaningful, and concise (no spaces, use PascalCase or underscores_if_needed).
    - Heights and widths can be chosen reasonably (e.g., 80–150).
    - X and Y positions should reflect hierarchy or flow (main ideas at top, sub-ideas below).

    3. For each connection between nodes, create a Connection in this exact format:

    Connection <connection-name> {{
        start: <node-name>,    // name of starting node
        end: <node-name>,      // name of ending node
    }};

    - Connection names must be unique and meaningful, e.g., <Parent>_<Child>.

    4. Output rules:
    - Output only Node and Connection blocks.
    - Do not add any extra text, explanation, or commentary.
    - Maintain the exact syntax so it is ready to feed directly into code.

    5. Example input and output:

    Input: "Plan a birthday party: choose venue, send invitations, arrange cake and decorations."

    Output:
    Node Party {{
        height: 120.0,
        width: 200.0,
        content: "Plan a birthday party",
        x: 300,
        y: 50,
        backgroundColor: "lightblue"
    }};

    Node Venue {{
        height: 80.0,
        width: 150.0,
        content: "Choose venue",
        x: 100,
        y: 200,
        backgroundColor: "lightgreen"
    }};

    Node Invitations {{
        height: 80.0,
        width: 150.0,
        content: "Send invitations",
        x: 300,
        y: 200,
        backgroundColor: "lightgreen"
    }};

    Node Cake {{
        height: 80.0,
        width: 150.0,
        content: "Arrange cake and decorations",
        x: 500,
        y: 200,
        backgroundColor: "lightgreen"
    }};

    Connection Party_Venue {{
        start: Party,
        end: Venue
    }};

    Connection Party_Invitations {{
        start: Party,
        end: Invitations
    }};

    Connection Party_Cake {{
        start: Party,
        end: Cake
    }};

    Now, convert the following user input text into Node and Connection blocks in this exact format:

    "{user_input}"
    `;

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro-latest",
    temperature: 0.1,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke({ user_input: userText });
  return result;
}