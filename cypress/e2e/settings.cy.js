describe('Settings Page - Cleaned & Optimized Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        profile: {
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          image: null
        }
      }
    }).as('getProfile');

    cy.visit('/settings');
    cy.wait('@getProfile');
  });

  describe('Profile Settings', () => {
    it('loads profile info correctly', () => {
      cy.get('#name').should('have.value', 'John Doe').and('be.disabled');
      cy.get('#username').should('have.value', 'johndoe').and('be.disabled');
      cy.get('#email').should('have.value', 'john@example.com').and('be.disabled');
    });

    it('enables editing except email', () => {
      cy.get('#edit-profile-button').click();
      cy.get('#name').should('not.be.disabled');
      cy.get('#username').should('not.be.disabled');
      cy.get('#email').should('be.disabled');
    });

    it('updates profile info', () => {
      cy.intercept('POST', '/api/user/profile', {
        statusCode: 200,
        body: { success: true }
      }).as('updateProfile');

      cy.get('#edit-profile-button').click();
      cy.get('#name').clear().type('Jane Smith');
      cy.get('#username').clear().type('janesmith');
      cy.get('#edit-profile-button').click();

      cy.wait('@updateProfile');
      cy.contains('Profile updated successfully').should('be.visible');
    });

    it('handles update error', () => {
      cy.intercept('POST', '/api/user/profile', {
        statusCode: 400,
        body: { error: 'Update failed' }
      }).as('updateError');

      cy.get('#edit-profile-button').click();
      cy.get('#name').clear().type('New Name');
      cy.get('#edit-profile-button').click();

      cy.wait('@updateError');
      cy.contains('Update failed').should('be.visible');
    });
  });

  describe('Account & Security', () => {
    beforeEach(() => {
      cy.get('#change-password-button').scrollIntoView();
    });

    it('opens and closes password form', () => {
      cy.get('#change-password-button').click();
      cy.get('#current-password').should('be.visible');
      cy.get('#close-password-form').click();
      cy.get('#current-password').should('not.exist');
    });

    it('validates password mismatch', () => {
      cy.get('#change-password-button').click();
      cy.get('#new-password').type('StrongPass123!');
      cy.get('#confirm-new-password').type('Different!');
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('validates password match', () => {
      cy.get('#change-password-button').click();
      cy.get('#new-password').type('StrongPass123!');
      cy.get('#confirm-new-password').type('StrongPass123!');
      cy.contains('Passwords match').should('be.visible');
    });

    it('updates password successfully', () => {
      cy.intercept('POST', '/api/user/change-password', {
        statusCode: 200,
        body: { success: true }
      }).as('passwordUpdate');

      cy.get('#change-password-button').click();
      cy.get('#current-password').type('OldPass123!');
      cy.get('#new-password').type('NewPass123!');
      cy.get('#confirm-new-password').type('NewPass123!');
      cy.get('#update-password-button').click();

      cy.wait('@passwordUpdate');
      cy.contains('Password updated successfully').should('be.visible');
    });

    it('handles password update error', () => {
      cy.intercept('POST', '/api/user/change-password', {
        statusCode: 400,
        body: { error: 'Incorrect current password' }
      }).as('pwError');

      cy.get('#change-password-button').click();
      cy.get('#current-password').type('Wrong!');
      cy.get('#new-password').type('NewPass123!');
      cy.get('#confirm-new-password').type('NewPass123!');
      cy.get('#update-password-button').click();

      cy.wait('@pwError');
      cy.contains('Incorrect current password').should('be.visible');
    });
  });

  describe('API Keys', () => {
    it('shows API key input when provider is selected', () => {
      cy.get('#llm-provider').click();
      cy.contains('OpenAI').click();
      cy.get('#api-key').should('be.visible');
    });

    it('adds API key successfully', () => {
      cy.get('#llm-provider').click();
      cy.contains('OpenAI').click();

      cy.get('#api-key').type('sk-test123456');
      cy.get('#add-api-key-button').click();

      cy.contains('OpenAI key added successfully').should('be.visible');
    });

    it('shows error when adding key with missing fields', () => {
      cy.get('#llm-provider').click();
      cy.contains('OpenAI').click();

      cy.get('#add-api-key-button').click();
      cy.contains('Please select a provider and enter a key').should('be.visible');
    });

    it('deletes an API key', () => {
      cy.get('#delete-api-key-0').click();
      cy.contains('key deleted').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('logs out current device', () => {
      cy.intercept('POST', '/api/auth/logout', { statusCode: 200 }).as('logout');

      cy.get('#logout-this-device').click();
      cy.wait('@logout');
    });

    it('logs out all devices', () => {
      cy.intercept('POST', '/api/auth/logout', { statusCode: 200 }).as('logoutAll');

      cy.get('#logout-all-devices').click();
      cy.wait('@logoutAll');
    });

    it('requires delete confirmation', () => {
      cy.on('window:confirm', () => false);
      cy.get('#delete-account-button').click();
    });

    it('deletes account when confirmed', () => {
      cy.intercept('DELETE', '/api/user/delete', {
        statusCode: 200,
        body: { message: 'Account deleted' }
      }).as('deleteAccount');

      cy.on('window:confirm', () => true);
      cy.get('#delete-account-button').click();

      cy.wait('@deleteAccount');
    });
  });


  describe('Responsive Behavior', () => {
    it('hides sidebar on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('aside').should('not.be.visible');
    });

    it('shows sidebar on desktop', () => {
      cy.viewport(1280, 720);
      cy.get('aside').should('be.visible');
    });
  });
});
