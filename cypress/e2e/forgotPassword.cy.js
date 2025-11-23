describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('/forgotPassword');
  });

  it('should load the forgot password page successfully', () => {
    cy.contains('Forgot Password').should('be.visible');
    cy.contains('Reset your password securely').should('be.visible');
  });

  it('should display email input in step 1', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.contains('Send OTP').should('be.visible');
  });

  it('should send OTP when valid email is provided', () => {
    cy.intercept('POST', '/api/send-otp', {
      statusCode: 200,
      body: { success: true }
    }).as('sendOTP');

    cy.get('input[type="email"]').type('test@example.com');
    cy.contains('Send OTP').click();
    
    cy.wait('@sendOTP');
    cy.contains('OTP sent successfully').should('be.visible');
  });


  it('should proceed to OTP verification step', () => {
    cy.intercept('POST', '/api/send-otp', {
      statusCode: 200,
      body: { success: true }
    }).as('sendOTP');

    cy.get('input[type="email"]').type('test@example.com');
    cy.contains('Send OTP').click();
    
    cy.wait('@sendOTP');
    cy.contains('Please check your email').should('be.visible');
  });
});
