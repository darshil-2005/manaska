# **Potential Conflicts**  

#### Authored by:
- Bhumsar Boro (202301002)  
- Dhruv Patel (202301024)

---

## **1\. Authentication vs Security (Epic 1 & Epic 7\)**

**Conflict:**

* Epic 1 covers account safety (hashed passwords, login alerts, inactivity timeout).

* Epic 7 covers system-level security (data encryption, privacy, crash recovery).

**Overlap:**

* Both mention password protection and session handling.

**Resolution:**

* **Epic 1:** Focus on **user-facing account security** (login flow, password rules, alerts).

* **Epic 7:** Focus on **system-level security** (data encryption, privacy policies, crash recovery).  
  

---

## **2\. Authentication vs Privacy / Deletion (Epic 1 & Epic 7\)**

**Conflict:**

* Epic 1 requires account deletion to permanently remove all user data.

* Epic 7 keeps autosaved states for 7 days to support crash recovery.

**Overlap:**

* Both deal with user data storage — one ensures permanent deletion, the other keeps temporary backups.

**Resolution:**

* **Epic 1:** Make account deletion permanent by removing all related data.

* **Epic 7:** Allow crash recovery, but clear all autosave/cache immediately if the user deletes their account.

* **Rule:** Deletion **always overrides** crash recovery retention.


---

## **3\. AI Enhancements vs Accessibility (Epic 2 & Epic 5\)**

**Conflict:**

* Epic 2 uses AI to auto-generate maps and summaries.

* Epic 5 requires accessibility (simple text, screen reader support, high-contrast colors).

**Overlap:**

* AI results might not always be accessible (too complex, poor color contrast).

**Resolution:**

* **Epic 2:** Generate maps and summaries with AI.

* **Epic 5:** Add an accessibility check (simplify text, safe colors, screen reader-friendly) before showing results.

---

## **4\. Export Features (Epic 2 & Epic 3\)**

**Conflict:**

* Epic 2 includes export to TXT/MD/PDF as part of AI/mind map creation.

* Epic 3 also defines export formats (PNG, PDF, JSON, Markdown).

**Overlap:**

* Export functionality defined in both epics.

**Resolution:**

* **Epic 2:** Focus on mind map creation and editing only.

* **Epic 3:** Own all export, save, delete, and share features.


---

## **5\. Pro Plan and Bring Your Own LLM (Epic 2 & Epic 8\)**

**Conflict:**

* **Epic 8:** Pricing & Pro Plan defines features for Pro users, including subscription management, billing, and exclusive features like unlimited mind maps and priority support.

* **Epic 2:** Use Own LLM API Key allows users to bring their own LLM key, which may bypass some features meant to be exclusive for Pro users.

**Overlap:**

* Pro users might lose out on premium value if they bring their own LLM key.

* Pro users are expected to access enhanced AI features, but a personal LLM key may bypass these.

**Resolution:**

* **Epic 8 (Pricing & Pro Plan):** Define premium access to AI capabilities based on the system's internal LLM, ensuring Pro users receive exclusive benefits like priority processing and enhanced features.

* **Epic 2 (Use Own LLM API Key):** Allow users to connect their own API key for customizable LLM models but **without interfering with core premium benefits**.

* Users using their own LLM key should retain **core Pro features**, but **enhanced AI suggestions and proprietary features** remain tied to the platform’s LLM.

