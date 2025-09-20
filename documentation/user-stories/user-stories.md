# User Stories for Manaska

#### Authored by: 
- Tirth Patel (202301023)
- Viraj Mehta (202301008)  
- Bhumsar Boro (202301002)
- Dhruv Patel (202301024)


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

### **User Story 13: Email & Password Login**

**Front of the Card:**  
 As a registered user, I want to log in using my email and password so that I can access my account.

**Back of the Card:**

* User can enter email and password in input fields.

* The system validates credentials against the database.

* If correct → user is redirected to dashboard/home page.

* If incorrect → error message is shown ("Invalid email or password").

---

### **User Story 14: OAuth Login**

**Front of the Card:**  
 As a user, I want to log in with Google/Apple/Facebook so that I don’t need to create a new password.

**Back of the Card:**

* Buttons available for "Continue with Google" / "Continue with Apple"/”Continue with Facebook”.

* Redirects to OAuth flow (Open Authorization).

* On success, user account is created/linked automatically.

---

### **User Story 15: Remember Me**

**Front of the Card:**  
 As a user, I want to stay signed in even after closing the browser so that I don’t have to log in repeatedly.

**Back of the Card:**

* "Remember Me" checkbox available.

* If checked, login session persists after closing the browser.

* If unchecked, session ends on logout or closing browser.

---

### **User Story 16: Error Messages & Validation**

**Front of the Card:**  
 As a user, I want to see clear error messages so that I know how to fix login issues.

**Back of the Card:**

* Email must follow proper format (e.g., user@example.com).

* Password field must not be empty.

* Invalid credentials show an error banner.

* Server errors display a friendly message.

---

### **User Story 17: Forgot Password**

**Front of the Card:**  
 As a user who forgot my password, I want to see a button on the login page so that I can reset my password and regain access to my account.

**Back of the Card:**

* "Forgot Password?" link redirects to password recovery flow.

* User can enter registered email.

* System sends reset link via email.

* User can set a new password and log in again.

---

### **User Story 18: Login Notifications**

**Front of the Card:**  
 As a user, I want to receive an email when a new device logs in so that I can catch unauthorized access.

**Back of the Card:**

* Email includes device and location info.

---

### **User Story 19: Auto Logout on Inactivity**

**Front of the Card:**  
 As a user, I want the system to log me out automatically after long inactivity so that my account stays secure.

**Back of the Card:**

* After 30 mins of inactivity, session expires.

* Prompt 2 min before expiry to extend.

---

### **User Story 20: Logout**

**Front of the Card:**  
 As a logged-in user, I want to log out so that I can secure my account on a shared device.

**Back of the Card:**

* Logout button available in profile menu.

* Clears session and cookies.

* Redirects to home page.

---

### **User Story 21: Update Profile Information**

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

### **User Story 22: Manage Profile Picture**

**Front of the Card:**  
 As a user, I want to add, update, or remove my profile picture so that I can personalize my account.

**Back of the Card:**

* User can upload a new image (only supported formats: JPG, PNG, WEBP).

* System checks image size limit (e.g., max 5 MB).

* User can remove current picture (fallback to default avatar).

* On successful upload/update, the new picture is displayed immediately.

* Error message shown if upload fails (invalid format/size).

---

### **User Story 23: Change Password**

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

### **User Story 24: Delete Account**

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