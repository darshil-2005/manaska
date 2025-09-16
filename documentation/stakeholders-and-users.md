# **Stakeholders and Users**

**Description:**

The **Mind Map Generator** is an intelligent web application tool that converts unstructured ideas, notes, or thoughts into structured, visually organized mind maps for brainstorming, project planning, writing outlines, teaching, and visualizing complex concepts. It features export options in PNG, PDF, and JSON formats for seamless integration with tools like Miro and Obsidian. At its core, the system uses a custom Domain-Specific Language (DSL) with a parser and interpreter to generate structured data models, while a renderer and layout engine produce clear and intuitive diagrams. An AI model trained on curated datasets automates the conversion of raw input into structured mind maps, while a no-code editor enables users to interactively customize outputs without technical knowledge. The application includes secure authentication for managing multiple mind maps, with future plans to add subscription-based premium features such as unlimited maps, extended export options, and collaborative editing. Developed by an internal team comprising a project leader, UI/UX designers, developers, testers, and DevOps engineers, and guided by teaching assistants and instructors, the solution integrates backend services, APIs, UI/UX, and deployment strategies to deliver a scalable, user-friendly, and full-featured platform.

### **1\. Stakeholders**

#### **Internal Stakeholders**

a. Project Leader-  
 Role: Oversees project execution, ensures coordination between team members, manages  timelines.  
 Expectations: Successful project delivery, leadership experience, achieving milestones.

b. UI/UX Designers-  
 Role: Design user-friendly and accessible interfaces for the app.  
 Expectations: Creative freedom, feedback from users, and implementation of their designs.

c. Developers-  
 Role: Implement features, write code, and integrate system components.  
 Expectations: Clear requirements, stable tools, working product.

d. Testers-  
 Role: Validate app functionality, identify bugs, and ensure quality assurance.  
 Expectations: Detailed test plans, responsive fixes from developers.

e. DevOps Engineers-  
 Role: Handle deployment, CI/CD pipelines, and cloud setup.  
 Expectations: Smooth releases, stable infrastructure, automation.

f. Teaching Assistant (Mentor)-  
 Role: Provides technical guidance and Agile process mentoring.  
 Expectations: Team follows best practices, project succeeds.

g. Course Instructor / Professor-  
 Role: Evaluates final project, ensures academic alignment.  
 Expectations: Educational success, fairness in evaluation.

#### **External Stakeholders**

a. End Users (Direct Users)

 **Subcategories:**

* Students/Researchers – brainstorming & research organization.  
* Professionals (Managers, Consultants) – project planning & client workshops.  
* Educators/Trainers – lesson plans, teaching aids.  
* Teams – collaborative brainstorming, Agile sprints.  
* Power Users – DSL scripting, automation, API use.  
* Content Creators / Writers – Structuring articles, blogs, scripts, storyboards, Outlining thoughts, creating drafts, publishing workflows.  
* Entrepreneurs / Startups *–* Business model planning, fundraising decks, pitch preparation, Customer journey mapping, go-to-market strategies

Expectations: Easy UI, fast generation, collaboration, export (PNG/PDF/JSON/md).

b. GitHub  
Role: Hosts the project’s code repository. Supports version control, collaboration, and issue tracking. Facilitates deployment workflows and branch management.  
Expectations: Reliable uptime and access. Easy-to-use interface for managing code and reviewing changes. Seamless integration with deployment platforms.

c. Vercel  
Role: Hosts and deploys the Next.js application. Automatically triggers deployments when changes are merged into the main branch on GitHub. Provides scalability and performance optimization.  
Expectations: Fast, reliable builds and deployment pipelines. Integration with GitHub for continuous deployment. Monitoring, caching, and analytics.

e. Payment Processor (e.g., Stripe, PayPal)  
Role: Handles user transactions, subscriptions, and payments. Provides secure and user-friendly checkout options.  
Expectations: Fast, secure processing of payments. Support for multiple currencies and payment methods. Compliance with financial regulations and data protection.

f. LLM (Large Language Model, e.g., GPT-based)  
Role: Analyzes unstructured thoughts and generates structured ideas, outlines, and relationships. Supports brainstorming, summarization, and concept generation.  
Expectations: High accuracy and contextual understanding. Minimal response latency for seamless user interaction. Safeguarding privacy and responsible AI use.

g. Email Sending API (e.g., SendGrid, Mailgun)  
Role: Handles automated email communications with users. Sends notifications, account verifications, password resets, and transactional emails/  
Expectations: High deliverability and low spam rates. Easy integration with the backend system. Secure handling of user data and compliance with privacy laws (e.g., GDPR, CAN-SPAM). Reliable performance during peak usage.

**2\. Users**

#### **Primary (Direct) Users**

* Students / Researchers  
   Role: Brainstorm academic ideas, organize research, and create outlines.  
   Expectations: Easy-to-use UI, reliable storage, export features (PDF/PNG/JSON).

* Business Professionals / Managers / Consultants  
   Role: Use the app for project planning, client workshops, and strategy sessions.  
   Expectations: Fast generation of maps, collaboration features, integration with PM tools (Jira, Trello).

* Writers / Content Creators  
   Role: Generate, structure, and refine creative ideas.  
   Expectations: Flexible editing, customization, export into writing tools.

* Teams (Agile & Collaborative Groups)  
   Role: Use the app for brainstorming, sprint planning, and cross-functional work.  
   Expectations: Real-time collaboration, version history, access controls.

* Power Users (Advanced / Technical Users)  
   Role: Customize mind maps using DSL scripts, automation, and API integrations.  
   Expectations: API access, scripting capabilities, customization options.

#### **Secondary (Indirect) Users**

* Teachers / Educators  
   Role: Review or assess mind maps used in lessons, assignments, or presentations.  
   Expectations: Clear visuals, easy sharing, accessibility for students.

* Managers / Supervisors  
   Role: Consume structured outputs for project updates, reviews, and reports.  
   Expectations: Accuracy, professional presentation, easy review.

* Collaborators (Non-Primary Contributors)  
   Role: Interact with exported or shared mind maps but don’t create them.  
   Expectations: Readable, shareable, easy-to-understand outputs.

* Academic / Business Institutions  
   Role: Benefit from structured results used in assignments, planning, or documentation.  
   Expectations: Quality, compliance, accessibility at scale.

  

