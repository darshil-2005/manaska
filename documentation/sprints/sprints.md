# **Sprint Plan**

---

## Sprint 1: POC \+ Foundation

**Goal** 

Deliver a working proof of concept that validates *text → mind map generation on a canvas*, while setting up the project structure, schema, and minimal UI design.



### **Planned Tasks :** 

**Project Setup** 

  * Initialize GitHub repository (all members as contributors).

  * Configure frameworks, libraries, and build tools.

  * Define base folder structure & environment setup.

**Database / Schema Design**

  * Design schema for *Manaska* (nodes, edges, metadata).

  * Document schema (ER diagram \+ migration). 

**UI Pages**

* **Dashboard Page**: basic landing with “Create New Map” button.

* **Canvas Page**: simple canvas implementation for rendering nodes/edges.

* UI/UX design for all pages.

**Ad-hoc POC**

* Send raw ideas to LLM using an ad-hoc prompt.

* LLM returns a simple mindmap in the project’s scripting language.

* Render the result on the canvas as nodes and edges.


### **Definition of Done**

* GitHub repo initialized, with commits from all team members.

* Database schema designed, documented, and committed.

* Minimal Dashboard and Canvas pages implemented.

* Prototype (POC) works: user can enter text → get map in scripting language → see nodes on canvas.


### **Mapped Epics**

* **Epic 2: Mind Map Creation** (basic input → map POC).

* **Epic 3: Save & Share** (local auto-save prototype, optional).

* **Epic 4: UI** (basic Dashboard \+ Canvas).

---

## **Sprint 2: Authentication \+ Core Prototype**

**Goal**  
Complete user authentication and expand the POC into a fully functional map editor with basic export and dashboard support.

### **Planned Tasks**

**UI**

* Implement responsive login and register pages (both light and dark theme).

**Authentication**

* Implement signup, login, and logout with their webpages and API endpoints.

* Add basic profile/account management (name, username, password change).

**Mind Map Editing**

* Enable add/delete/rename nodes.

* Implement drag & drop editing as well as editing through script.

* Add undo/redo and keyboard shortcuts.

**Export**

* Support export to PNG and JSON formats.

**Dashboard**

* Implement a complete dashboard with all the features.


### **Definition of Done**

* Complete Authentication flow working (signup, login, logout).

* Profile update functional.

* Complete mind map editing (CRUD nodes, drag/drop, styling) available.

* Undo/redo and keyboard shortcuts operational.

* Export to PNG and JSON successful.

* Complete Dashboard.

* Completed End-to-End testing of authentication flow.


### **Mapped Epics**

* **Epic 1: Authentication** (basic login, signup, profile management).

* **Epic 2: Mind Map Editing** (editing \+ styling).

* **Epic 3: Export** (PNG, JSON).

* **Epic 4: Dashboard** (Complete dashboard and canvas page).

---

## **Sprint 3: AI, Accessibility & UI**

**Goal**  
Integrate advanced AI features, and accessibility compliance to enhance usability, and test and improve upon the performance metrics of different prompts, and test the core prototype.


### **Planned Tasks**

**UI**

* Implement responsive home, settings, documentation pages (both light and dark theme).

**AI Enhancements**

* Implement AI Summarization of maps (exportable TXT/MD/PDF).

* Enable BYO LLM API key configuration and validation.

**Offline Mode**

* Cache maps locally for up to 7 days.

* Automatically sync changes when reconnected.

**Accessibility Features**

* Support screen readers with ARIA labels.

* Provide captions/text alternatives for audio feedback.

* Enable high contrast themes and color-blind friendly settings.

* Add tooltips and confirmation dialogs for key actions.

**Documentation**

* Publish guides, FAQs, and searchable documentation.

**Export**

* Support export to markdown format that is compatible with obsidian and miro.

**Testing**

* Rigorous and extensive testing of the core prototype.


### **Definition of Done**

* AI summaries working, exportable in multiple formats.

* Users can configure and use their own LLM API key.

* Offline mode tested: maps cached for 7 days, syncs on reconnect.

* Accessibility features verified manually and with automated tests.

* Documentation published and searchable on web/mobile.

* Complete End-to-End testing of Core Prototype.


### **Mapped Epics**

* **Epic 2: Mind Map Creation** (AI Summarization, BYO API Key).

* **Epic 4: Offline Support**.

* **Epic 5: Accessibility**.

* **Epic 6: Documentation & Search**.

---

## **Sprint 4: Reliability, Pricing & Final Polish**

**Goal**  
Deliver stability, scalability, pricing functionality, and feedback systems to finalize the project.

### **Planned Tasks**

**UI**

* Implement a responsive pricing and feedback pages (both light and dark theme).

**Security & Privacy**

* Encrypt all data where required.

**Scalability & Reliability**

* Optimize rendering for maps with 50–100 nodes.

* Implement crash recovery: autosave every 30–60 seconds locally/cloud, restore last session.

**Pricing & Pro Plan**

* Implement pricing page with Free and Pro plans.

* Upgrade flow with trusted payment gateway.

* Pro-only features: unlimited maps, priority support.

* Manage subscription (billing cycle, invoices, cancel option).

**Feedback & Support**

* Make a feedback form on the feedback page and connect to the backend.

* Error messages link directly to documentation/help pages.


### **Definition of Done**

* Security/privacy features implemented and verified.

* Maps with 50+ nodes load smoothly and without crashing.

* Crash recovery successfully restores last session.

* Pricing and upgrade flow tested end-to-end.

* Subscription management operational.

* Feedback form submissions visible to developers.


### **Mapped Epics**

* **Epic 7: Security, Privacy & Reliability**.

* **Epic 8: Pricing & Pro Plan**.

* **Epic 6: Feedback & Support**.

---

## **Sprint 5: Testing, Feedback & Continuous Improvement**

**Goal**  
Thoroughly test the application, gather initial customer/user feedback, and make improvements to ensure the app is stable, user-friendly, and aligned with user expectations.


### **Planned Tasks**

**Testing**

* Run **integration tests** to validate end-to-end flows (login → create map → save/export → logout).

* Perform **responsivity testing** (desktop, mobile, tablets).

* Testing the core features on mobile and tablets.

* Verify **accessibility compliance** against WCAG 2.1.

**User Feedback**

* Collect feedback from a small group of pilot/test users.

* Collect structured feedback via in-app forms, surveys, or interviews.

* Track and categorize issues (bugs, UX problems, missing features).

**Improvements**

* Fix critical bugs reported by test users.

* Polish UI/UX based on feedback (navigation, responsiveness, visual clarity).

* Update documentation to reflect changes and clarify pain points identified by users.


### **Definition of Done**

* All major features pass integration testing, and cross-device tests.

* The app remains stable under load for 50-60 node maps.

* Accessibility tests pass with no critical blockers.

* Feedback collected from at least 10–15 real/pilot users.

* Key issues from feedback addressed with fixes or improvements.

* Documentation updated based on new insights.

* Common user issues given by real/pilot users added to documentation.


### **Mapped Epics**

* Epic 2: Mind Map Creation (refinements).

* Epic 4: UI & Responsiveness (usability fixes).

* Epic 5: Accessibility (compliance validation).

* Epic 6: Feedback & Support (feedback loop).

* Epic 7: Reliability (stability under load).

---

