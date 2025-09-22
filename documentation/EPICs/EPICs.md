
# EPICs

---

## **Epic 1: Authentication & Account Management**

**Front of the Card**  
 As a user, I want to securely create and manage my account so that I can log in, protect my data, and access personalized features.

**Back of the Card (Acceptance Criteria)**

* Signup with email & password, with confirmation.

* Email verification before full access.

* OAuth login with Google/Github.

* Login, logout, “Remember me,” and password reset available.

* Profile management (name, username, email, profile picture).

* Password change requires a current password, and enforces strong rules.

* Account deletion permanently removes data.

* Clear error states and validation messages.

* Security: hashed passwords, rate limits, inactivity timeout, login alerts.

**Scope (Included)**

* Registration, login, reset, verification, profile, delete account.

**Definition of Done**

* Acceptance criteria met.

* Complete Testing done.

* Documentation updated.

**Mapped User Stories**  
 1 to 24\.

---

## **Epic 2: Mind Map Creation, Editing & AI Enhancements**

**Front of the Card**  
 As a user, I want to create, edit, and enhance mind maps (with AI assistance) so that I can brainstorm and structure ideas effectively.

**Back of the Card (Acceptance Criteria)**

* Input: text, file (.txt/.md/.docx/.pdf), or voice.

* AI organizes input into nodes/sub-nodes as a mind map.

* Editing: add/delete/rename, drag & drop, styling, shortcuts, undo/redo, zoom/pan, collapse/expand.

* Hover notes with context; editable.

* AI summarization of the whole mindmap; export as TXT/MD/PDF; multi-language.

* BYO LLM API key: add/manage, validate, error handling, usage indicator.

* Errors: clear message \+ retry option.

**Scope (Included)**

* Map creation, editing (on canvas/with code), styling, AI suggestions, AI summaries, BYO keys.

**Definition of Done**

* Works on desktop & mobile web.

* Reasonable accuracy on syntax generation with AI.

* User documentation updated.

**Mapped User Stories**  
 25–40, 59, 66\.

---

## **Epic 3: Export, Save & Share**

**Front of the Card**  
 As a user, I want to save, export, and share my mind maps so that I can reuse them in documents and share with others.

**Back of the Card (Acceptance Criteria)**

* Auto-save locally at intervals or after major edits.

* Export: PNG, PDF (visual), JSON (schema), Markdown.

* Delete: confirmation required.

* Share link: unique, view-only, revocable.

**Scope (Included)**

* Save, auto-save, export, delete, share.

**Definition of Done**

* Acceptance criteria met.

* End-to-End testing of the flow.

* Docs updated.

**Mapped User Stories**  
 41–45.

---

## **Epic 4: UI, Accessibility & Cross-Platform Experience**

**Front of the Card**  
 As a user, I want a responsive UI with offline access and a dashboard so I can use the app across devices and easily find my work.

**Back of the Card (Acceptance Criteria)**

* Dark Mode toggle, persists.

* Offline caching with sync on reconnect (7 days retention).

* Dashboard: created maps \+ favorites/pinned maps with thumbnails, sort & filter, “Create New Map” button to create a new one.

* Mobile responsive: touch-friendly, collapsible toolbars, swipe gestures.

**Scope (Included)**

* Themes, offline caching, dashboard, mobile responsive.

**Definition of Done**

* Acceptance criteria met.

* Documentation covers dashboard & offline.

**Mapped User Stories**  
 46, 47, 57, 58

---

## **Epic 5: Accessibility Support**

**Front of the Card**  
 As a user with diverse needs, I want accessibility features so that I can use the app effectively regardless of impairment.

**Back of the Card (Acceptance Criteria)**

* Visually impaired: keyboard navigation, screen readers, audio cues with adjustable settings.

* Hard of hearing: captions/text alternatives for audio.

* Cognitive: clear structure, plain language, tooltips, confirmation dialogs.

* Color blind: high-contrast themes, LLM respects color preferences.

* WCAG 2.1 AA compliance on core flows.

**Scope (Included)**

* Visual, auditory, cognitive, and color accessibility.

**Definition of Done**

* Acceptance criteria met.

* Documentation for accessibility shortcuts & settings.

**Mapped User Stories**  
 48–51

---

## **Epic 6: Documentation & Feedback**

**Front of the Card**  
 As a user, I want clear documentation and an easy way to provide feedback so I can learn features and help improve the app.

**Back of the Card (Acceptance Criteria)**

* Documentation: guides, tutorials, FAQs.

* Searchable docs: search bar, relevance ranking, partial matches, mobile-friendly.

* Feedback page \+ contact email.

* Error messages with help links.

**Scope (Included)**

* Docs, search, feedback, support.

**Definition of Done**

* Acceptance criteria met.

* Feedback form connected.

* Documentation published and searchable.

**Mapped User Stories**  
 52–55

---

## **Epic 7: Security, Privacy & Reliability**

**Front of the Card**  
 As a privacy-conscious user, I want my data secure and the app stable so I can trust it for important work.

**Back of the Card (Acceptance Criteria)**

* Data encrypted in transit & at rest; transparent policy; easy deletion.

* Explicit consent for cookies/tracking.

* Scalability: 50+ nodes responsive, tested to 60\.

* Efficient rendering: virtualization/WebGL.

* Crash recovery: autosave every 30–60s; restore prompt; state expires after 7 days; option to disable.

**Scope (Included)**

* Security/privacy features, scalability, crash recovery.

**Definition of Done**

* Performance tests for large maps.

* Crash recovery verified.

* Security/privacy policy published.

**Mapped User Stories**  
 56, 60, 61

---

## **Epic 8: Pricing & Pro Plan**

**Front of the Card**  
 As a user, I want a clear pricing model and easy upgrade options so that I can decide on a plan and manage my subscription.

**Back of the Card (Acceptance Criteria)**

* Pricing page: Free, Pro (and Enterprise if applicable).

* Upgrade flow: checkout with trustable payment gateways, instant activation, confirmation email.

* Pro-only features: unlimited maps, priority support; lock icons/“Upgrade” for free users.

* Manage subscription: view billing date & invoices, change cycle, update payment, cancel with access until end.

**Scope (Included)**

* Pricing UI, upgrade flow, plan entitlements, subscription management.

**Definition of Done**

* End-to-end testing of APIs related to upgrade, downgrade, change plan, etc.

* Documentation on plans & features.

**Mapped User Stories**  
 62–65

---

