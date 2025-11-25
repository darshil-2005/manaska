describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should load the home page successfully', () => {
    cy.contains('Turn Ideas into Mind Maps Instantly').should('be.visible');
  });

  it('should display the navbar with correct elements', () => {
    cy.get('header').within(() => {
      cy.contains('Manaska').should('be.visible');
      cy.contains('Features').should('be.visible');
      cy.contains('How it Works').should('be.visible');
      cy.contains('Use Cases').should('be.visible');
      cy.contains('Sign In').should('be.visible');
      cy.contains('Try Free').should('be.visible');
    });
  });

  it('should navigate to login page when clicking Sign In', () => {
    cy.contains('Sign In').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register page when clicking Try Free', () => {
    cy.contains('Try Free').first().click();
    cy.url().should('include', '/register');
  });

  it('should toggle examples modal', () => {
    cy.contains('See Examples').click();
    cy.contains('Example Mind Maps').should('be.visible');
    cy.contains('Lecture Notes').should('be.visible');
    cy.contains('Project Planning').should('be.visible');
    cy.contains('Close Examples').click();
    cy.contains('Example Mind Maps').should('not.exist');
  });

  it('should toggle learn more modal', () => {
    cy.contains('Learn More').click();
    cy.contains('About ManaskaAI').should('be.visible');
    cy.contains('Key Benefits:').should('be.visible');
    cy.contains('Perfect For:').should('be.visible');
    cy.contains('Close').click();
    cy.contains('About ManaskaAI').should('not.exist');
  });

  it('should display features section', () => {
    cy.get('#features').scrollIntoView();
    cy.contains('Everything you need').should('be.visible');
    cy.contains('Import anything').should('be.visible');
    cy.contains('Instant processing').should('be.visible');
    cy.contains('Export everywhere').should('be.visible');
  });

  it('should display how it works section', () => {
    cy.get('#how').scrollIntoView();
    cy.contains('How it works').should('be.visible');
    cy.contains('Input your content').should('be.visible');
    cy.contains('AI processes').should('be.visible');
    cy.contains('Get your mind map').should('be.visible');
  });

  it('should display security section', () => {
    cy.contains('Security & Privacy First').scrollIntoView();
    cy.contains('Bank-Level Security').should('be.visible');
    cy.contains('Your Data Stays Yours').should('be.visible');
  });

  it('should display use cases section', () => {
    cy.get('#use-cases').scrollIntoView();
    cy.contains('Who Uses ManaskaAI?').should('be.visible');
    cy.contains('Students').should('be.visible');
    cy.contains('Professionals').should('be.visible');
    cy.contains('Creatives').should('be.visible');
  });

  it('should display FAQ section', () => {
    cy.contains('Frequently Asked Questions').scrollIntoView();
    cy.contains('How does the AI create mind maps?').should('be.visible');
    cy.contains('What file formats can I import?').should('be.visible');
    cy.contains('Is there a free plan?').should('be.visible');
  });

  it('should display CTA section', () => {
    cy.contains('Ready to Get Started?').scrollIntoView();
    cy.contains('Start Free Now').should('be.visible');
  });

  it('should display footer', () => {
    cy.contains('© 2025 ManaskaAI. All rights reserved.').scrollIntoView().should('be.visible');
  });
});
