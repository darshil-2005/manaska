# **Authentication and Account Management**
---
#### Authored by: 
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

