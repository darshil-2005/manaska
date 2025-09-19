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

### **1.3 Editing & Customization**

These requirements ensure users have comprehensive control over the final mind map, allowing for manual refinement, correction, and personalization of the AI-generated output.

**FR16:** The system shall allow users to manually add new nodes, delete existing nodes, and rename the text content of any node within the mind map canvas.

**FR17:** The system shall support direct manipulation of the mind map structure, allowing users to rearrange nodes and entire branches by dragging and dropping them to new positions.

**FR18:** The system shall provide a set of styling tools that allow users to customize the visual appearance of selected nodes or the entire map, including options for changing colors, node shapes, and text fonts.

**FR19:** The system shall allow users to switch between different mind map layout structures, including as a minimum: a Hierarchical Tree, a Radial Map (central idea with branches), and a Flowchart-like structure.

**FR20:** The system shall provide multi-level "Undo" and "Redo" functions, enabling users to easily revert and re-apply recent edits made to the mind map.

**FR20:** The system shall include a code editor view that allows advanced users to directly view and modify the underlying Domain-Specific Language (DSL) script that defines the mind map's structure and content.

**FR21**: The application shall include a comprehensive and easily navigable documentation section that explains all features, with step-by-step instructions and examples.

**FR22**: The system shall provide a dedicated feedback page containing a form for users to submit suggestions, bug reports, and general feedback directly to the development team.

**FR23**: The system shall clearly display a support contact email address, allowing users an alternative method to provide feedback or seek help.

**FR24**: Error messages shall be written in plain language, clearly explaining the nature of the problem and providing actionable steps for the user to resolve the issue.

### **1.4 Navigation**

These requirements ensure users can easily navigate large and complex mind maps.

**FR25:** The system shall allow users to zoom in and out of the mind map canvas. This shall be controllable via on-screen buttons (+/-) and the mouse scroll wheel.

**FR26:** The system shall allow users to span across the mind map canvas by clicking and dragging the background, enabling exploration of areas outside the current viewport.

**FR27:** The system shall enable users to collapse and expand parent nodes, allowing them to hide or reveal the entire branch of child nodes associated with that parent.


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

### **2.3 Security & Privacy**

User survey data reveals a fundamental split in privacy preferences: roughly half of users desire the convenience of cloud access, while the other half prioritizes the security of local-only storage.1 This is not a minor feature preference but a core architectural consideration. To avoid alienating a significant portion of the user base, the system must be designed from the ground up to support both data storage models, giving users explicit control over their information's location.

**NFR8:** **Authentication:** The system shall enforce secure user authentication. User passwords must be salted and hashed using a modern, strong cryptographic algorithm such as Argon2.

**NFR9:** **Data Encryption in Transit:** All communication between the user's client and the system's servers must be encrypted using Transport Layer Security (TLS) version 1.2 or higher.

**NFR10:** **Data Encryption at Rest:** Any user-generated content, including mind map data and personal information, stored on the system's servers must be encrypted at rest using industry-standard encryption (e.g., AES-256).

**NFR11:** **User Data Control:** The system shall provide users with a clear and explicit choice to store their mind map data either on the cloud (enabling cross-device access and collaboration) or exclusively on their local device (for maximum privacy).1 This choice should be available on a per-map basis.

**NFR12:** **GDPR Compliance:** The system shall be designed and operated in compliance with the General Data Protection Regulation (GDPR). This includes providing users with the ability to access, export, and request the deletion of their personal data.

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
| FR16 | Add/delete/rename nodes | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, UI/UX Designers, End Users |
| FR17 | Drag-drop rearrangement of nodes | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, UI/UX Designers, End Users |
| FR18 | Node styling (color, shapes, fonts) | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, UI/UX Designers, End Users |
| FR19 | Multiple layout options (tree, radial, flowchart) | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, UI/UX Designers, End Users |
| FR20 (A) | Undo/Redo | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, UI/UX Designers, End Users |
| FR20 (B) | DSL code editor | Brainstorming, Questionnaire | Users can list editing needs; brainstorming helps capture a variety of customization. | Developers, Power Users, End Users |
| FR21 | Documentation section | Survey | Easy to ask professors what form of help/documentation they prefer. | Developers, Teaching Assistant, Instructor, End Users |
| FR22 | Feedback page | Survey | Easy to ask professors what form of help/documentation they prefer. | Developers, UI/UX Designers, End Users |
| FR23 | Display support email | Survey | Easy to ask professors what form of help/documentation they prefer. | Developers, End Users |
| FR24 | Plain language error messages | Questionnaire | Quick to validate wording preferences and clarity. | UI/UX Designers, Developers, End Users |
| FR25 | Zoom in/out mind map | Brainstorming | Helps identify which navigation tools are most intuitive for large mind maps. | Developers, UI/UX Designers, End Users |
| FR26(A) | Pan across canvas | Brainstorming | Helps identify which navigation tools are most intuitive for large mind maps. | Developers, UI/UX Designers, End Users |
| FR27 | Collapse/expand nodes | Brainstorming | Helps identify which navigation tools are most intuitive for large mind maps. | Developers, UI/UX Designers, End Users |
| NFR1 | Generation latency (quick summary) | Survey | To capture acceptable waiting times from a large group. | Developers, Testers, LLM, End Users |
| NFR2 | Generation latency (detailed) | Survey | To capture acceptable waiting times from a large group. | Developers, Testers, LLM, End Users |
| NFR3 | UI responsiveness | Brainstorming, Interview | Technical aspect; requires brainstorming with devs \+ user validation. | Developers, Testers, UI/UX Designers, End Users |
| NFR4 | 500 concurrent users | Brainstorming | Best discussed with developers/instructors about scalability goals. | Developers, Testers, DevOps Engineers, Vercel |
| NFR5 | 99.5% uptime | Interview | Needs clarification of uptime expectations from professors/institute. | DevOps Engineers, Vercel, End Users |
| NFR6 | Data integrity | Interview | Critical requirement; discussed in detail with stakeholders. | Developers, Testers, DevOps Engineers, End Users |
| NFR7 | Graceful error handling | Survey | To understand user expectations for error recovery. | Developers, Testers, End Users |
| NFR8 | Secure authentication (Argon2) | Interview | Security concern; needs domain expert feedback. | Developers, Testers, End Users |
| NFR9 | Data encryption in transit (TLS 1.2+) | Interview | Technical, requires in-depth expert input. | Developers, DevOps Engineers, End Users |
| NFR10 | Encryption at rest (AES-256) | Interview | Technical, requires in-depth expert input. | Developers, DevOps Engineers, End Users |
| NFR11 | Cloud/local storage choice | Survey, Interview | Split preferences; surveys capture trends, interviews capture rationale. | Developers, DevOps Engineers, End Users |
| NFR12 | GDPR compliance | Interview | Legal/privacy sensitive; requires expert opinion. | Developers, Testers, End Users, Payment Processor |