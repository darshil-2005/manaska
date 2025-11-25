describe('Dashboard Page', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('GET', '/api/canvas*', {
      statusCode: 200,
      body: {
        maps: [
          {
            id: '1',
            title: 'Test Mind Map 1',
            description: 'Test description',
            pinned: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Test Mind Map 2',
            pinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    }).as('getMaps');

    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        profile: {
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    }).as('getProfile');

    cy.visit('/dashboard');
    cy.wait(['@getMaps', '@getProfile']);
  });

  it('should load the dashboard successfully', () => {
    cy.contains('Manaska').should('be.visible');
    cy.contains('Manage all your mind maps in one place').should('be.visible');
  });

  it('should display mind map cards', () => {
    cy.contains('Test Mind Map 1').should('be.visible');
    cy.contains('Test Mind Map 2').should('be.visible');
  });

  it('should show pinned badge on pinned maps', () => {
    cy.contains('Test Mind Map 1').parents('[class*="Card"]').within(() => {
      cy.contains('Pinned').should('be.visible');
    });
  });

  it('should display statistics', () => {
    cy.contains('Pinned').should('be.visible');
    cy.contains('Total Maps').should('be.visible');
    cy.contains('1').should('be.visible'); // Pinned count
    cy.contains('2').should('be.visible'); // Total count
  });

  it('should filter maps by search term', () => {
    cy.get('input[placeholder*="Search"]').type('Test Mind Map 1');
    cy.contains('Test Mind Map 1').should('be.visible');
    cy.contains('Test Mind Map 2').should('not.exist');
  });

  it('should refresh maps list', () => {
    cy.intercept('GET', '/api/canvas*', {
      statusCode: 200,
      body: { maps: [] }
    }).as('refreshMaps');

    cy.get('#refresh-maps-button').click();
    cy.wait('@refreshMaps');
  });

  it('should create new mind map', () => {
    cy.intercept('POST', '/api/mindmap/create', {
      statusCode: 200,
      body: {
        map: { id: '3', title: 'Untitled mind map' }
      }
    }).as('createMap');

    cy.get('#create-map-button').click();
    cy.wait('@createMap');
  });

  it('should toggle pin on mind map', () => {
    cy.intercept('POST', '/api/user/pin', {
      statusCode: 200,
      body: {
        map: { id: '1', pinned: false, updatedAt: new Date().toISOString() }
      }
    }).as('togglePin');

    cy.get('#toggle-pin-1').click();
    cy.wait('@togglePin');
  });

  it('should rename mind map', () => {
    cy.intercept('PATCH', '/api/mindmap/1', {
      statusCode: 200,
      body: {
        map: { id: '1', title: 'Renamed Map', updatedAt: new Date().toISOString() }
      }
    }).as('renameMap');

    cy.get('#rename-map-1').click();
    cy.get('input[value="Test Mind Map 1"]').should('be.visible');
  });

  it('should delete mind map', () => {
    cy.intercept('DELETE', '/api/mindmap/1', {
      statusCode: 200
    }).as('deleteMap');

    cy.get('#delete-map-1').click();
    cy.wait('@deleteMap');
  });

  it('should open settings from dropdown', () => {
    cy.get('#user-menu-button').click();
    cy.contains('Settings').click();
    cy.url().should('include', '/settings');
  });

  it('should logout from dropdown', () => {
    cy.intercept('POST', '/api/auth/logout', {
      statusCode: 200
    }).as('logout');

    cy.get('#user-menu-button').click();
    cy.contains('Log out').click();
    cy.wait('@logout');
  });

  it('should show empty state when no maps', () => {
    cy.intercept('GET', '/api/canvas*', {
      statusCode: 200,
      body: { maps: [] }
    }).as('getEmptyMaps');

    cy.visit('/dashboard');
    cy.wait('@getEmptyMaps');
    cy.contains('No mind maps yet').should('be.visible');
  });

  it('should show no results message when search has no matches', () => {
    cy.get('input[placeholder*="Search"]').type('NonExistentMap');
    cy.contains('No mind maps match your search').should('be.visible');
  });
});
