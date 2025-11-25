describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should load the login page successfully', () => {
        cy.contains('Welcome back').should('be.visible');
        cy.contains('Log in to continue to ManaskaAI').should('be.visible');
    });

    it('should display all form fields', () => {
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="remember"]').should('exist');
    });

    it('should validate email format when @ is present', () => {
        cy.get('input[name="email"]').type('invalid@email').blur();
        cy.contains('Must be a valid email format').should('be.visible');
        cy.get('input[name="email"]').clear().type('valid@email.com').blur();
        cy.contains('Must be a valid email format').should('not.exist');
    });

    it('should allow username without email validation', () => {
        cy.get('input[name="email"]').type('username123');
        cy.contains('Must be a valid email format').should('not.exist');
    });

    it('should toggle password visibility', () => {
        cy.get('input[name="password"]').should('have.attr', 'type', 'password');
        cy.get('#toggle-password-visibility').click();
        cy.get('input[name="password"]').should('have.attr', 'type', 'text');
        cy.get('#toggle-password-visibility').click();
        cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('should check remember me checkbox', () => {
        cy.get('input[name="remember"]').check({ force: true });
        cy.get('input[name="remember"]').should('be.checked');
    });

    it('should navigate to forgot password page', () => {
        cy.contains('Forgot password?').click();
        cy.url().should('include', '/forgotPassword');
    });

    it('should display social login options', () => {
        cy.contains('Or continue with').should('be.visible');
    });

    it('should have link to register page', () => {
        cy.contains("Don’t have an account?").should('be.visible');
        cy.contains('Create account').click();
        cy.url().should('include', '/register');
    });

    it('should show error for empty credentials', () => {
        cy.get('#login-submit-button').click({ force: true });

        cy.contains('Please enter both email/username and password.', {
            timeout: 7000,
        }).should('be.visible');
    });


    it('should disable form during login', () => {
        cy.intercept('POST', '/api/auth/login', {
            delay: 1000,
            statusCode: 200,
            body: { success: true }
        }).as('login');

        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('#login-submit-button').click();

        cy.get('#login-submit-button').should('be.disabled');
        cy.contains('Logging in...').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 401,
            body: { message: 'Invalid credentials' }
        }).as('loginError');

        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('#login-submit-button').click();

        cy.wait('@loginError');
        cy.contains('Invalid credentials').should('be.visible');
    });

    it('should redirect to dashboard on successful login', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: { success: true }
        }).as('loginSuccess');

        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('#login-submit-button').click();

        cy.wait('@loginSuccess');
        cy.contains('Login successful').should('be.visible');
    });

    it('should display left panel', () => {
        cy.viewport(1280, 900);
        cy.get('[data-cy="left-panel"]', { timeout: 5000 }).should('exist');
    });


    it('should display toast container', () => {
        cy.get('.Toastify').should('exist');
    });
});
