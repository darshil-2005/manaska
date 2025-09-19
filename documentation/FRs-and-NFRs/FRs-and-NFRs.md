# ManaskaAI
###  An AI powered mind map generator 

##### Author : Jay Rathod ID : 202301006

##### Author : Tirth Kheni  ID : 202301007

##### Author : Vrund Kansara  ID : 202301015

## **1\. Functional Requirements (FRs)**

This section defines the explicit behaviors the system must perform. The requirements are derived from an analysis of user stories, stakeholder expectations, and direct user feedback.

### **1.1 Input & Data Handling**

These requirements specify how users will provide information to the system for processing.

**FR1:** The system shall provide a multi-line text area for users to type or paste unstructured text as input for mind map generation.

**FR2:** The system shall allow users to upload files containing notes or documents to be processed into a mind map.

**FR3:** The system shall support the uploading of files in the following formats: plain text (.txt), Markdown (.md), Microsoft Word (.docx), and PDF (.pdf).

**FR4:** The system shall provide an input field for users to submit a web page link (URL), from which the system will extract content to generate a mind map.

**FR5:** The system shall allow users to upload an image file containing text and shall utilize Optical Character Recognition (OCR) technology to extract the text for mind map generation.

**FR6:** The system shall provide a voice input feature that captures user speech, transcribes it into text, and uses the resulting text as input for mind map creation.

**FR7:** The system shall validate all user inputs and provide clear, user-friendly error messages whenever invalid data is submitted (e.g., empty text fields or unsupported file formats).

**FR8**: The system shall provide a mechanism for authenticated users to permanently delete their entire account and all associated personal data.

### **1.2 AI Features**

These requirements define the core intelligent capabilities of the system. The functionality specified reflects a central user demand for a system where AI performs the initial, complex task of structuring information, which the user can then refine. This "hybrid intelligence" model balances automation with user control, a synthesis derived from the high value users place on both "Automatic conversion of unstructured notes" and "Easy manual editing".

**FR9:** The system shall process user-provided input through an AI model to automatically generate a structured mind map, organizing the content into a logical hierarchy of a central topic, main nodes, and related sub-nodes.

**FR10:** The system shall provide an AI-powered summarization feature that can condense long passages of text within the input into concise phrases suitable for mind map nodes.

**FR11:** The system shall automatically identify and visually highlight the most important nodes or key concepts within a generated mind map to draw the user's attention to central ideas.

**FR12:** The system shall analyze the input text to automatically group related concepts and ideas, representing them as distinct thematic clusters or branches in the mind map.

**FR13:** The system shall provide AI-driven suggestions for additional, related nodes or sub-topics to help users expand upon the ideas present in their mind map.

**FR14:** The system shall allow the user to select a desired level of detail—such as "high-level overview," "balanced summary," or "very detailed breakdown"—prior to the generation of the mind map, thereby controlling the output's granularity.

**FR15:** The system shall display a non-technical error message and present a "Retry" button to the user in the event that the AI model fails to process an input and generate a mind map.

## **2\. Non-Functional Requirements (NFRs)**

This section defines the quality attributes, operational standards, and constraints of the system. Each requirement is defined to be measurable and verifiable.

### **2.1 Performance**

Performance requirements are critical, as user expectations vary based on the complexity of their task. Some users prioritize rapid generation for quick summaries, while others are willing to wait longer for a more detailed, higher-quality analysis of dense documents.1 The following requirements are tied to address this trade-off directly, linking performance targets to the user-selected level of detail (FR13).

**NFR1:** **Generation Latency (Quick Summary):** For text inputs equivalent to a 20-page document (approximately 10,000 words), the system shall generate a "high-level overview" or "balanced summary" mind map in under 30 seconds for 95% of user requests.

**NFR2:** **Generation Latency (Detailed Analysis):** For text inputs equivalent to a 20-page document, the system shall generate a "very detailed breakdown" mind map in under 180 seconds (3 minutes).1

**NFR3:** **UI Responsiveness:** All client-side UI interactions, such as dragging nodes, applying styles, opening menus, and panning the canvas, shall register and complete within 200 milliseconds to ensure a fluid user experience.

**NFR4:** **Concurrent Users:** The production system shall be architected to support a minimum of 500 concurrent users performing typical actions (e.g., generating maps, editing, saving) with server-side response times remaining below 2 seconds.

### **2.2 Reliability & Availability**

**NFR5:** **System Availability:** The application shall achieve a minimum of 99.5% uptime, measured monthly. This calculation excludes pre-announced, scheduled maintenance windows, which shall not exceed 4 hours per month.

**NFR6:** **Data Integrity:** All save, load, and auto-save operations must complete without data loss or corruption. The system must achieve a success rate of 99.99% for these critical data persistence operations.

**NFR7**: The system must handle all foreseeable errors gracefully, preventing application crashes or data loss. In the event of an unrecoverable error, the system shall provide the user with clear information and a support link.

## **Traceability Matrix**

| Requirement ID | Requirement Description | Elicitation Technique(s) | Reason | Stakeholder(s) |
| :---- | :---- | :---- | :---- | :---- |
| FR1 | Multi-line text area input | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | UI/UX Designers, Developers, Testers, End Users (Students, Professionals, Writers) |
| FR2 | Upload files for mind map generation | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | Developers, Testers, End Users (Students, Professionals, Content Creators) |
| FR3 | Support .txt, .md, .docx, .pdf | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | Developers, Testers, End Users |
| FR4 | URL input for webpage extraction | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | Developers, Testers, LLM, End Users |
| FR5 | Image upload \+ OCR | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | Developers, Testers, LLM, End Users |
| FR6 | Voice input \+ transcription | Brainstorming, Interview | To explore diverse input modes and validate feasibility with users and instructors. | Developers, Testers, LLM, End Users |
| FR7 | Input validation \+ error messages | Survey, Questionnaire | To gather common error cases from users and preferences on message clarity. | Developers, Testers, UI/UX Designers, End Users |
| FR8 | Permanent account deletion & data removal | Interview | Sensitive requirement, best clarified with professors on privacy & compliance expectations. | Developers, Testers, End Users, Payment Processor, GDPR (Security/Privacy) |
| FR9 | AI-generated structured mind map | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | Developers, Testers, LLM, End Users |
| FR10 | AI summarization for nodes | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | Developers, Testers, LLM, End Users |
| FR11 | Highlight key concepts | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | UI/UX Designers, Developers, LLM, End Users |
| FR12 | AI clustering/grouping concepts | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | Developers, LLM, End Users |
| FR13 | AI suggestions for extra nodes | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | Developers, LLM, End Users |
| FR14 | Control detail level of mind map | Brainstorming, Interview | Complex functionality needing discussion of academic needs and iterative refinement. | Developers, UI/UX Designers, LLM, End Users |
| FR15 | Retry \+ error messages on AI failure | Survey | Quick way to ask users how they expect error recovery. | Developers, Testers, UI/UX Designers, LLM, End Users |
| NFR1 | Generation latency (quick summary) | Survey | To capture acceptable waiting times from a large group. | Developers, Testers, LLM, End Users |
| NFR2 | Generation latency (detailed) | Survey | To capture acceptable waiting times from a large group. | Developers, Testers, LLM, End Users |
| NFR3 | UI responsiveness | Brainstorming, Interview | Technical aspect; requires brainstorming with devs \+ user validation. | Developers, Testers, UI/UX Designers, End Users |
| NFR4 | 500 concurrent users | Brainstorming | Best discussed with developers/instructors about scalability goals. | Developers, Testers, DevOps Engineers, Vercel |
| NFR5 | 99.5% uptime | Interview | Needs clarification of uptime expectations from professors/institute. | DevOps Engineers, Vercel, End Users |
| NFR6 | Data integrity | Interview | Critical requirement; discussed in detail with stakeholders. | Developers, Testers, DevOps Engineers, End Users |
| NFR7 | Graceful error handling | Survey | To understand user expectations for error recovery. | Developers, Testers, End Users |