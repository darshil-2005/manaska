# **User Stories**

#### Authored by: 
- Tirth Patel (202301023)
- Viraj Mehta (202301008)  
- Bhumsar Boro (202301002)
- Dhruv Patel (202301024)
- Darshil Gandhi (202301056)


---

## **User Story 1: Email and Password Registration**

**Front of the Card**  
 As a new user, I want to sign up by providing my email and a password so that I can create a secure account for the Mind Map Generator.

**Back of the Card**

* The signup form must include fields for **Email**, **Create password**, and **Confirm password**.

* The system must validate that the text entered in **Create password** and **Confirm password** are identical.

* If the passwords do not match, a clear error message must be displayed.

* Upon clicking **Signup**, the system checks if the email already exists; if not, a new account is created.

---

## **User Story 2: Password Visibility Toggle (Universal)**

**Front of the Card**  
 As a user filling out any form that requires a password, I want to be able to show or hide my password as I type it so that I can verify I have entered it correctly.

**Back of the Card**

* Every password input field across the app (**Signup**, **Login**, **Forgot/Reset Password**, **Change Password**) must have a visibility toggle icon (like an eye).

* By default, the password text should be masked (e.g., dots or asterisks).

* Clicking the icon should reveal the password in plain text.

* Clicking the icon again should mask the password.

* The toggle should only change the visual display and not the actual stored value.

---

## **User Story 3: OAuth Signup**

**Front of the Card**  
 As a new user, I want to sign up using my existing Google, Apple, or Facebook account so that I can create an account quickly without filling out the form manually.

**Back of the Card**

* The signup form must display distinct buttons for **Login with Facebook** and **Login with Google**.

* Clicking a social login button initiates the authentication process with that provider.

* Upon successful authentication, a new user account is created using the email and name provided by the social platform.

* The user is automatically logged in and redirected to their dashboard.

---

## **User Story 4: Handle Existing Email on Signup**

**Front of the Card**  
 As a user trying to sign up with an email that is already registered, I want to see a clear message so that I understand I should log in instead of creating a new account.

**Back of the Card**

* After clicking **Sign Up**, the system must check if the entered email is already in the database.

* If the email exists:

  * Stop the signup submission.

  * Show an inline error:  
     *“This email is already registered. Please log in instead.”*

  * Provide a clickable link to the **Login** page inside or below the error message.

---

## **User Story 5: Handle Existing Username on Signup**

**Front of the Card**  
 As a user trying to sign up with a username that is already taken, I want to see an error message so that I can try another username.

**Back of the Card**

* After clicking **Sign Up**, the system must check if the entered username is already taken.

* If the username exists:

  * Stop the signup submission.

  * Show an inline error:  
     *“This username is already taken. Please choose another.”*

  * Keep the user on the same form to edit the username.

---

## **User Story 6: Real-time Email Validation**

**Front of the Card**  
 As a user entering my email address, I want to receive immediate feedback on whether the format is valid so that I can correct any typos before submitting the form.

**Back of the Card**

* As I type in the **Email** field and then click or tab away, the system should instantly check if the input matches a standard email format (e.g., name@domain.com).

* If the format is invalid, a descriptive helper text should appear (e.g., *“Please enter a valid email address”*).

* The input box should show an error state (e.g., red border).

* The error indication disappears once the email is corrected.

---

## **User Story 7: Password Confirmation Mismatch**

**Front of the Card**  
 As a user creating a password, I want to be clearly notified if the Confirm password field does not match the Create password field so that I can easily correct the mistake.

**Back of the Card**

* The system should only check for a mismatch after text is entered in both password fields.

* If values don’t match:

  * Show an explicit error message (*“Passwords do not match”*).

  * Highlight the **Confirm password** field with an error state (e.g., red border).

* The error message and highlighting disappear as soon as the fields match.

---

## **User Story 8: Handling an Existing Account**

**Front of the Card**  
 As a user trying to sign up with an email that is already registered, I want to see a specific error message so that I understand I should log in instead of creating a new account.

**Back of the Card**

* The check for an existing email is performed only after I click **Signup**.

* If the email is already in the database:

  * Halt the form submission.

  * Display a clear error message:  
     *“An account with this email already exists. Please login.”*

  * Include a clickable link to the **Login** page.

---

## **User Story 9: Viewing Password Requirements**

**Front of the Card**  
 As a new user, I want to see password requirements before submitting the form so that I can create a valid password.

**Back of the Card**

* When I first click into the **Create password** field, show a tooltip or helper text.

* This text lists password rules (e.g., *“Minimum 8 characters,” “Must include a number,” “Must include a special character”*).

* As I type, the list shows checkmarks for the criteria I’ve met.

* The helper text remains visible as long as the field is in focus.

---

## **User Story 10: Terms and Privacy Agreement**

**Front of the Card**  
 As a new user, I want to accept the Terms of Service and Privacy Policy so that I understand the rules before creating an account.

**Back of the Card**

* Show a required checkbox with:  
   *“I agree to the Terms of Service and Privacy Policy.”*

* **Terms of Service** and **Privacy Policy** are clickable links that open in new tabs.

* The **Signup** button stays disabled until the checkbox is selected.

---

## **User Story 11: Email Verification After Signup**

**Front of the Card**  
 As a new user, I want to verify my email address so that my account is confirmed and secure.

**Back of the Card**

* After signup, send an email with a verification link.

* The user must click the link to activate their account.

* Until verified, login is restricted or shows a warning message.

---

## **User Story 12: Welcome Email After Signup**

**Front of the Card**  
 As a user, I want to receive a welcome email after registering so that I know my account is created.

**Back of the Card**

* After successful signup, trigger a transactional **Welcome Email**.

* The email should include:

  * A friendly welcome message

  * Helpful links

  * Basic getting started steps

---

## **User Story 13: Email & Password Login**

**Front of the Card:**  
 As a registered user, I want to log in using my email and password so that I can access my account.

**Back of the Card:**

* User can enter email and password in input fields.

* The system validates credentials against the database.

* If correct → user is redirected to dashboard/home page.

* If incorrect → error message is shown ("Invalid email or password").

---

## **User Story 14: OAuth Login**

**Front of the Card:**  
 As a user, I want to log in with Google/Apple/Facebook so that I don’t need to create a new password.

**Back of the Card:**

* Buttons available for "Continue with Google" / "Continue with Apple"/”Continue with Facebook”.

* Redirects to OAuth flow (Open Authorization).

* On success, user account is created/linked automatically.

---

## **User Story 15: Remember Me**

**Front of the Card:**  
 As a user, I want to stay signed in even after closing the browser so that I don’t have to log in repeatedly.

**Back of the Card:**

* "Remember Me" checkbox available.

* If checked, login session persists after closing the browser.

* If unchecked, session ends on logout or closing browser.

---

## **User Story 16: Error Messages & Validation**

**Front of the Card:**  
 As a user, I want to see clear error messages so that I know how to fix login issues.

**Back of the Card:**

* Email must follow proper format (e.g., user@example.com).

* Password field must not be empty.

* Invalid credentials show an error banner.

* Server errors display a friendly message.

---

## **User Story 17: Forgot Password**

**Front of the Card:**  
 As a user who forgot my password, I want to see a button on the login page so that I can reset my password and regain access to my account.

**Back of the Card:**

* "Forgot Password?" link redirects to password recovery flow.

* User can enter registered email.

* System sends reset link via email.

* User can set a new password and log in again.

---

## **User Story 18: Login Notifications**

**Front of the Card:**  
 As a user, I want to receive an email when a new device logs in so that I can catch unauthorized access.

**Back of the Card:**

* Email includes device and location info.

---

## **User Story 19: Auto Logout on Inactivity**

**Front of the Card:**  
 As a user, I want the system to log me out automatically after long inactivity so that my account stays secure.

**Back of the Card:**

* After 30 mins of inactivity, session expires.

* Prompt 2 min before expiry to extend.

---

## **User Story 20: Logout**

**Front of the Card:**  
 As a logged-in user, I want to log out so that I can secure my account on a shared device.

**Back of the Card:**

* Logout button available in profile menu.

* Clears session and cookies.

* Redirects to home page.

---

## **User Story 21: Update Profile Information**

**Front of the Card:**  
 As a user, I want to update my profile information name, username and profile picture so that my account reflects my identity.

**Back of the Card:**

* User can edit fields: name, username and email.

* System validates input:

  * Username must be unique.

  * Email must follow valid format.

* On saving: changes are stored in the database.

* Success message is displayed ("Profile updated successfully").

* Error message shown if update fails (e.g., duplicate username etc).

---

## **User Story 22: Manage Profile Picture**

**Front of the Card:**  
 As a user, I want to add, update, or remove my profile picture so that I can personalize my account.

**Back of the Card:**

* User can upload a new image (only supported formats: JPG, PNG, WEBP).

* System checks image size limit (e.g., max 5 MB).

* User can remove current picture (fallback to default avatar).

* On successful upload/update, the new picture is displayed immediately.

* Error message shown if upload fails (invalid format/size).

---

## **User Story 23: Change Password**

**Front of the Card:**  
 As a logged-in user, I want to change my password so that I can keep my account secure and recover it in case I need to.

**Back of the Card:**

* User navigates to Profile → Settings → Change Password.

* User must enter current password.

* User must enter and confirm new password.

* System validates new password (e.g., min 8 chars, strong).

* On success → password updated, confirmation message shown.

* On failure (wrong current password / weak new password) → error message shown.

---

## **User Story 24: Delete Account**

**Front of the Card:**  
 As a logged-in user, I want to delete my account permanently so that my data is removed from the system.

**Back of the Card:**

* User navigates to Profile → Settings → Delete Account.

* A confirmation dialog appears (e.g., "Are you sure? This action cannot be undone.").

* User must confirm deletion (e.g., re-enter password or type “DELETE”).

* On confirmation → account & associated data are permanently deleted.

* System logs out the user immediately after deletion.

---

## **User Story 25: Raw Idea Input**

**Front of the Card**  
 As a user, I want to type or paste my unstructured ideas so that I can generate a structured mind map.

**Back of the Card**

* The text area must support multi-line input.

* If the input field is empty, a clear error message must be displayed.

* Clicking **Generate Mind Map** must send the input for processing.

---

## **User Story 26: File Upload**

**Front of the Card**  
 As a user, I want to upload a file with my notes so that I don’t have to retype them.

**Back of the Card**

* Supported file types include **.txt**, **.md**, **.docx**, and **.pdf**.

* Invalid file types must trigger an error message.

* File content must be extracted and used to generate the mind map.

---

## **User Story 27: Voice Input for Ideas**

**Front of the Card**  
 As a user, I want to speak my thoughts and have them transcribed into nodes so that I can brainstorm hands-free.

**Back of the Card**

* Voice input must convert speech to text accurately.

* The transcribed notes must appear as nodes in the mind map.

---

## **User Story 28: AI Organization**

**Front of the Card**  
 As a user, I want the system to organize my raw input into nodes and sub-nodes so that I can clearly see relationships.

**Back of the Card**

* The system must automatically convert input into a structured mind map.

* The generated map must display categories, nodes, and sub-nodes.

---

## **User Story 29: Error Handling**

**Front of the Card**  
 As a user, I want a retry option if the AI fails so that I don’t lose my input.

**Back of the Card**

* A clear error message must be displayed if the AI cannot generate a map.

* A **Retry** button must be available to attempt regeneration.

---

## **User Story 30: Highlight Key Nodes**

**Front of the Card**  
 As a user, I want the system to highlight the important nodes so that I can quickly identify the key ideas in my mind map.

**Back of the Card**

* The system must emphasize central or high-priority nodes.

* Key nodes must be visually distinct using size, color, or style.

---

## **User Story 31: AI Suggestions for Expansion**

**Front of the Card**  
 As a user, I want the AI to suggest additional nodes based on my content so that I can expand my thinking.

**Back of the Card**

* Suggested nodes must appear in a separate **AI Suggestions** panel.

* Users must be able to drag suggestions into the main map.

* Suggestions must refresh on demand.

---

## **User Story 32: Context Notes on Node Hover**

**Front of the Card**  
 As a user, I want to see a context note when I hover over a node so that I can get a detailed explanation of what the node’s content actually means.

**Back of the Card**

* When the user hovers over a node, a context note appears near the node.

* The context note provides additional details or explanation about the node’s content.

* The context note should not obstruct the main view of the mind map.

* The note disappears when the user moves the cursor away from the node.

* The context note can be edited by the node’s creator (or whoever has permission).

---

## **User Story 33: Add/Delete/Rename Nodes**

**Front of the Card**  
 As a user, I want to add, delete, or rename nodes so that I can refine my mind map.

**Back of the Card**

* Each node must support add, delete, and rename operations.

* Changes must be reflected in the map immediately.

---

## **User Story 34: Rearranging Nodes**

**Front of the Card**  
 As a user, I want to rearrange nodes by dragging and dropping so that I can adjust the structure.

**Back of the Card**

* Nodes must be draggable.

* Rearrangements must persist within the session.

---

## **User Story 35: Styling Options**

**Front of the Card**  
 As a user, I want to change node colors, shapes, and fonts so that my map is visually clear.

**Back of the Card**

* Styling options must be provided for nodes.

* Styles must apply instantly to selected nodes.

---

## **User Story 36: Undo/Redo**

**Front of the Card**  
 As a user, I want to undo or redo changes so that I can recover from mistakes.

**Back of the Card**

* Undo and redo actions must be available.

* The system must maintain a history of recent actions.

---

## **User Story 37: Keyboard Shortcuts**

**Front of the Card**  
 As a user, I want keyboard shortcuts for frequent actions (add node, delete node, save) so that I can work faster.

**Back of the Card**

* All shortcuts must be listed in a help or reference menu.

* Shortcuts must trigger the same actions as buttons.

---

## **User Story 38: Drag, Drop & Edit**

**Front of the Card**  
 As a user, I want to drag and drop nodes and edit the underlying code so that I can customize the structure and content of my mind map.

**Back of the Card**

* Users must be able to rearrange nodes in the mind map visually.

* A built-in editor must allow users to modify the underlying script representation of the map.

* Changes made in either the visual map or code editor must remain synchronized automatically.

---

## **User Story 39: Zoom & Pan**

**Front of the Card**  
 As a user, I want to zoom and pan so that I can explore large mind maps easily.

**Back of the Card**

* Mouse scroll and drag must allow zooming and panning.

* Zoom controls (**+/-**) must be visible on the interface.

---

## **User Story 40: Collapse/Expand Branches**

**Front of the Card**  
 As a user, I want to collapse and expand branches so that I can focus on specific areas.

**Back of the Card**

* Each parent node must include expand and collapse options.

* Collapsed branches must hide all child nodes.

---

## **User Story 41: Export Mind Map**

**Front of the Card**  
 As a user, I want to export my mind map in different formats (PNG, PDF, JSON, Markdown) so that I can use it in slides, documents, or external tools like Miro and Obsidian.

**Back of the Card**

* Export options must include **PNG**, **PDF**, **JSON**, and **Markdown**.

* **PNG** and **PDF** exports must capture the current map layout and styling.

* **JSON** export must follow a standard node-edge schema for compatibility with external mind map tools.

* **Markdown** export must produce a file compatible with Miro and Obsidian.

* Each selected format must trigger an automatic file download.

---

## **User Story 42: Save Mind Map**

**Front of the Card**  
 As a user, I want to save my mind map so that I can revisit it later.

**Back of the Card**

* A **Save** option must be available.

* Saved maps must appear in the user’s workspace.

---

## **User Story 43: Auto-Save**

**Front of the Card**  
 As a user, I want my work to auto-save so that I don’t lose progress.

**Back of the Card**

* The system must automatically save changes at periodic intervals.

---

## **User Story 44: Delete Mind Maps**

**Front of the Card**  
 As a user, I want to delete mind maps so that I can keep my workspace clean.

**Back of the Card**

* Each saved map must have a delete option.

* A confirmation message must appear before deletion is executed.

---

## **User Story 45: Shareable Link**

**Front of the Card**  
 As a user, I want to share my mind map with others via a link so that they can view it.

**Back of the Card**

* A **Share** option must generate a unique link.

* Shared maps must be view-only.

---

## **User Story 46: Dark Mode**

**Front of the Card**  
 As a user, I want a dark mode option so that I can work comfortably in low-light environments.

**Back of the Card**

* A toggle must switch between light and dark themes.

* The theme preference must persist across user sessions.

---

## **User Story 47: Offline Mode**

**Front of the Card**  
 As a user, I want to access and edit my saved mind maps offline so that I can continue working without internet connectivity.

**Back of the Card**

* The application must use browser storage to store cached mind maps locally.

* Cached maps must be retained for **15 days** by default.

* Users must be able to view and edit cached maps without internet access.

* When connectivity is restored, offline edits must automatically sync with the server to ensure consistency.

---

## **User Story 48: Accessibility for Visually Impaired Users**

**Front of the Card**  
As a visually impaired user, I want to navigate the app using only audio cues, so I can use Manaska just like any other user.  

**Back of the Card**  
* All navigation must be accessible via keyboard controls and screen readers.  
* The user must be able to access all features without needing visual interaction.  
* The audio must be clear, understandable, and its volume and speed must be adjustable.  
* All responses (e.g., mind map generated, changes saved, syntax error) must be available in audio format.  
* `aria-label` and `aria-describedby` tags must be added in HTML where needed.  
* The solution must follow WCAG accessibility guidelines and standards.  

---

## **User Story 49: Accessibility for Users Hard of Hearing**

**Front of the Card**  
As a user that is hard of hearing, I want to navigate the app without needing any audio cues, so I can use Manaska just like any other user.  

**Back of the Card**  
* If any audio feedback is provided by Manaska, it must include appropriate captions.  
* Users must be able to access the entire app without relying on audio cues.  

---

## **User Story 50: Accessibility for Cognitively Impaired Users**

**Front of the Card**  
As a cognitively impaired user, I want the app to be easy to use by having:  

* A layout with clear structure and hierarchy.  
* Sections with proper headings and descriptions.  
* Simple, easy-to-understand language.  
* Tooltips with explanations for elements on the screen.  
* Confirmation messages before performing drastic actions.  

So that I can use the app to its full potential.  

**Back of the Card**  
* The layout must use consistent headings and section schemes to organize content clearly.  
* All interactive elements must have accessible labels and tooltips describing their function.  
* Text content must be written in plain language, avoiding jargon and domain-specific terms.  
* Actions that delete or significantly alter data must prompt the user with a confirmation dialog before proceeding.  

---

## **User Story 51: Accessibility for Color Blind Users**

**Front of the Card**  
As a color blind user, I want to specify which kinds of color schemes the system should use while generating the mind map, and I want to clearly read the text on the website, so I can use Manaska properly.  

**Back of the Card**  
* The LLM prompt must consider the user’s color preferences when generating the mind map.  
* Text and background must maintain sufficiently high contrast, following WCAG guidelines.  

---

## **User Story 52: Comprehensive & Easy-to-Understand Documentation**

**Front of the Card**  
As a user, I want reference and guidance on all aspects of the app in the documentation, and I want it to be easy to understand.  

**Back of the Card**  
* The website must have extensive documentation explaining how to use features, with clearly listed steps and examples.  
* The language must be grammatically correct, simple, and easy to understand.  
* The documentation must have a clear structure, with closely related topics grouped together.  

---

## **User Story 53: Searchable Documentation**

**Front of the Card**  
As a user, I want to be able to search the documentation so that I can quickly find answers and guidance without scrolling through all the content.  

**Back of the Card**  
* A search bar must be available at the top of the documentation page.  
* The system must search across all documentation topics, guides, and FAQs.  
* Search must return:  
  * A list of relevant results with titles, short excerpts, and direct links to the section.  
  * Results sorted by relevance (most likely matches first).  
* The search must support:  
  * Keyword queries (e.g., “export mind map”).  
  * Partial matches (e.g., “expor” still finds “export”).  
* If no results are found, show a friendly message (e.g., “No matches found. Try another keyword.”).  
* Mobile-friendly design: search must work seamlessly on phones and tablets.  

---

## **User Story 54: Feedback Providing**

**Front of the Card**  
As a user, I want to provide detailed feedback on what the app does well, what it does poorly, and what features I’d like to see in the future.  

**Back of the Card**  
* The website must include a feedback page where users can submit feedback directly to developers.  
* The website must provide a contact email for submitting feedback.  

---

## **User Story 55: Error Handling & Support**

**Front of the Card**  
As a user, I want clear and helpful error messages when something goes wrong, so I can quickly understand and fix issues.  

**Back of the Card**  
* All potential errors must be handled gracefully with explanations of what went wrong and how to resolve it.  
* A help section or support link must be easily accessible during issues.  

---

## **User Story 56: Security & Privacy**

**Front of the Card**  
As a privacy-conscious user, I want my data to be secure and handled transparently, so I can trust the app with my sensitive information.  

**Back of the Card**  
* Users must be informed about data collection, storage, and usage.  
* Mind maps and personal data must be encrypted during storage and transmission.  
* Users must be able to easily delete their data.  
* Users must be notified and explicitly consent before any third-party cookies or tracking tools are set.  

---

## **User Story 57: Personal Dashboard for Recent Maps & Favorites**

**Front of the Card**  
As a user, I want a dashboard showing my recently generated maps and favorite charts, so I can quickly resume my work without searching through old files.  

**Back of the Card**  
* The dashboard must display:  
  * A list/grid of recently created or edited maps/charts (with timestamps).  
  * A section for favorites, pinned by the user.  
* Each dashboard item must include:  
  * Map/Chart title.  
  * Thumbnail or preview.  
  * Date of last update.  
* Users must be able to:  
  * Click an item to open it directly.  
  * Pin/unpin maps to/from favorites.  
  * Sort and filter items (e.g., by date modified, alphabetical order, type).  
* The dashboard must load automatically upon login as the home screen.  
* A clear “Create New Map” button must be visible.  

---

## **User Story 58: Responsive Mobile Web Support**

**Front of the Card**  
As a user, I want the website to be fully responsive and accessible on my phone, so I can create and edit mind maps on the go without needing a separate app.  

**Back of the Card**  
* The website layout must automatically adjust for different screen sizes (desktop, tablet, mobile).  
* Core desktop features must also be usable on mobile:  
  * Creating mind maps from text prompts.  
  * Adding, removing, renaming, and moving nodes.  
  * Viewing recent and favorite maps.  
  * Saving and syncing maps with the cloud.  
* UI must be touch-friendly:  
  * Large tap targets for buttons and menus.  
  * Swipe gestures for interactions (e.g., opening/closing sidebars).  
  * Collapsible menus and simplified toolbars for small screens.  

---

## **User Story 59: AI Summarization of Mind Maps**

**Front of the Card**  
As a user, I want the system to automatically generate a concise textual summary of my mind map so that I can quickly understand the main points without scanning the whole map.  

**Back of the Card**  
* The system must analyze the nodes and branches of a map and produce a structured summary.  
* The summary must highlight:  
  * The central topic.  
  * Key branches (main categories).  
  * A short explanation of each major node.  
* Summaries must be displayed in a side panel or pop-up.  
* The summary must be exportable as Markdown, TXT, or PDF.  
* AI must adapt the summary length depending on map size (shorter for small maps, more detailed for large ones).  
* Users can regenerate summaries to get different phrasing or generate it in different languages.  

---

## **User Story 60: Scalability for Large Mind Maps (50+ Nodes)**

**Front of the Card**  
As a user, I want the system to handle very large mind maps (50+ nodes) smoothly so that I can work on complex projects without performance issues.  

**Back of the Card**  
* The system must remain responsive when loading, editing, or navigating maps with 50+ nodes.  
* Zooming, panning, and dragging nodes must be smooth.  
* The rendering engine must use techniques such as:  
  * Virtualization / lazy loading of nodes (only render visible nodes).     
* Memory usage must be optimized to prevent browser crashes.  
* The system must be tested with maps up to 50 nodes to ensure headroom.   
* Users must see a loading indicator when opening very large maps.  

---

## **User Story 61: Crash Recovery (Restore Last State)**

**Front of the Card**  
As a user, I want the system to automatically restore my last working state after a crash or unexpected closure so that I don’t lose progress on my mind map.  

**Back of the Card**  
* The system must periodically save session data (map structure, zoom level, open tabs, active edits) in local storage or cache.  
* If the browser crashes, tab closes, or device restarts:  
  * On reopening the app, the user is prompted with “Restore last session?”.  
  * If accepted, the map reloads exactly as it was before.  
* Autosave must trigger every 30–60 seconds or after significant changes.  
* Restored maps must include:  
  * Node data (text, styles, relationships).  
  * User position in the canvas (zoom, pan).  
* Restored state must expire after 7 days to avoid storage bloat.    

---

## **User Story 62: Pricing Page**

**Front of the Card**  
As a potential user, I want to view a clear pricing page so that I can understand the differences between the Free and Pro plans before subscribing.  

**Back of the Card**  
* Pricing page must list available plans (Free, Pro, Enterprise if applicable).  
* Each plan must show included features (maps, AI expansions, collaboration).  
* Plans must clearly display costs (monthly/annual).  
* A comparison table must highlight differences.  
* Pricing page must be accessible from the homepage and dashboard.  

---

## **User Story 63: Upgrade to Pro Plan**

**Front of the Card**  
As a free user, I want the ability to upgrade to the Pro plan so that I can access premium features.  

**Back of the Card**  
* An “Upgrade to Pro” button must be visible on the pricing page and dashboard.  
* Clicking it must lead to a secure checkout flow.  
* After payment, account status must change to Pro immediately.  
* User must receive a confirmation/receipt email.  

---

## **User Story 64: Pro-Only Features**

**Front of the Card**  
As a Pro user, I want exclusive features so that I feel I’m getting value for my subscription.  

**Back of the Card**  
* Pro-only features may include:  
  * Unlimited mind maps.  
  * Priority support.  
* Free users see lock icons or “Upgrade to access” notices for restricted features.  

---

## **User Story 65: Manage Subscription**

**Front of the Card**  
As a Pro user, I want to manage my subscription so that I can change or cancel my plan anytime.  

**Back of the Card**  
* Settings must include a “Manage Subscription” link.  
* Users must be able to:  
  * Switch billing (monthly ↔ annual).  
  * Update payment method.  
  * Cancel subscription.  
* System must show next billing date + past invoices.  
* On cancel, Pro features remain until the billing period ends.  

---

## **User Story 66: Use Own LLM API Key**

**Front of the Card**  
As a user, I want to use my own LLM API key to generate charts/mind maps so that I can control cost and model choice.  

**Back of the Card**  
* Users can add and manage their own API key in settings.  
* Keys are securely stored and masked in the UI.  
* System validates the key before use.  
* Generations show whether a user key or platform key is being used.  
* Errors (invalid/expired key, rate limits) display clear messages.  

---
