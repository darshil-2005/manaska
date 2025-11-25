describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should load the register page successfully', () => {
    cy.contains('Create your account').should('be.visible');
    cy.contains('Join ManaskaAI to start mapping your ideas').should('be.visible');
  });

  it('should display all form fields', () => {
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.get('input[name="agree"]').should('exist');
  });

  it('should show validation for username length', () => {
    cy.get('input[name="username"]').type('abc');
    cy.contains('Must be at least 6 characters').parent().should('have.class', 'text-destructive');
    cy.get('input[name="username"]').clear().type('abcdef');
    cy.contains('Must be at least 6 characters').parent().should('have.class', 'text-green-600');
  });



  it('should validate email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.contains('Must be a valid email address').parent().should('have.class', 'text-destructive');
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.contains('Must be a valid email address').parent().should('have.class', 'text-green-600');
  });


  it('should show password validation rules', () => {
    cy.get('input[name="password"]').type('weak');
    cy.contains('At least 8 characters').should('be.visible');
    cy.contains('At least one digit (0-9)').should('be.visible');
    cy.contains('At least one special character').should('be.visible');
  });

  it('should validate password strength', () => {
    cy.get('input[name="password"]').type('StrongPass123!');
    cy.contains('At least 8 characters').should('not.have.class', 'text-destructive');
    cy.contains('At least one digit (0-9)').should('not.have.class', 'text-destructive');
  });

  it('should validate password match', () => {
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123');
    cy.contains('Passwords match').should('be.visible');
    cy.get('input[name="confirmPassword"]').clear().type('Password123!');
    cy.contains('Passwords match').should('not.have.class', 'text-destructive');
  });

  it('should require terms agreement', () => {
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="username"]').type('johndoe123');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');
    cy.get('#register-submit-button').click();
    cy.contains('You must agree to the terms').should('be.visible');
  });

  it('should display social login options', () => {
    cy.contains('Or sign up with').should('be.visible');
  });

  it('should have link to login page', () => {
    cy.contains('Already have an account?').should('be.visible');
    cy.contains('Log in').click();
    cy.url().should('include', '/login');
  });

  it('should show error when email already exists', () => {
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 400,
      body: { error: "Email already exists" }
    }).as('emailExists');

    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="username"]').type('johndoe123');
    cy.get('input[name="email"]').type('existing@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');

    cy.wait(150);
    cy.get('[data-testid="agree-checkbox"]').click({ force: true });

    cy.get('#register-submit-button').click();

    cy.wait('@emailExists');
    cy.contains("Email already exists").should('be.visible');
  });


  it("should show error when username is already taken", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 400,
      body: { error: "Username already taken" }
    }).as("usernameTaken");

    cy.get('input[name="name"]').type("John Doe");
    cy.get('input[name="username"]').type("johndoe123");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");
    cy.get('[data-testid="agree-checkbox"]').click({ force: true });

    cy.get("#register-submit-button").click();

    cy.wait("@usernameTaken");
    cy.contains("Username already taken").should("be.visible");
  });


  it("should show server error message on 500", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 500,
      body: { error: "Internal server error" }
    }).as("serverError");

    cy.get('input[name="name"]').type("John Doe");
    cy.get('input[name="username"]').type("johndoe123");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");
    cy.get('[data-testid="agree-checkbox"]').click({ force: true });

    cy.get("#register-submit-button").click();

    cy.wait("@serverError");
    cy.contains("Internal server error").should("be.visible");
  });


  it("should redirect to login page after successful registration", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 200,
      body: { success: true }
    }).as("registerSuccess");

    cy.get('input[name="name"]').type("John Doe");
    cy.get('input[name="username"]').type("johndoe123");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");
    cy.get('[data-testid="agree-checkbox"]').click({ force: true });

    cy.get("#register-submit-button").click();

    cy.wait("@registerSuccess");
    cy.url().should("include", "/login");
  });


  it("should trim whitespace from email", () => {
    cy.get('input[name="email"]').type("   john@example.com   ");
    cy.get('input[name="email"]').should("have.value", "john@example.com");
  });

});
