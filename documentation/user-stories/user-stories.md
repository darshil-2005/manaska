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

