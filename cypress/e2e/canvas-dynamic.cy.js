describe('Canvas Dynamic Page', () => {
  const testMapId = 'test-map-123';

  beforeEach(() => {
    cy.intercept('GET', '/api/canvas/*', {
      statusCode: 200,
      body: {
        map: {
          id: testMapId,
          title: 'Test Mind Map',
          map_code: 'Node "test" { label: "Test" }'
        }
      }
    }).as('getMap');

    cy.visit(`/canvas/${testMapId}`);
  });

  it('should load canvas page with map ID', () => {
    cy.contains(`Mind Map ID:`).should('be.visible');
    cy.contains(testMapId).should('be.visible');
  });

  it('should display header controls', () => {
    cy.get('header').within(() => {
      cy.contains('Grid').should('be.visible');
      cy.contains('Generate Script').should('be.visible');
      cy.contains('Share').should('be.visible');
      cy.contains('Save').should('be.visible');
      cy.contains('Export').should('be.visible');
    });
  });

  it('should toggle grid mode', () => {
    cy.contains('Grid').parent().find('button').click();
  });

  it('should display coordinates', () => {
    cy.get('header').within(() => {
      cy.contains('0').should('be.visible');
    });
  });

  it('should open export popover', () => {
    cy.contains('Export').click();
    cy.contains('Export Options').should('be.visible');
  });

  it('should display export format selector', () => {
    cy.contains('Export').click();
    cy.get('[role="combobox"]').should('be.visible');
  });

  it('should show export format options', () => {
    cy.contains('Export').click();
    cy.get('[role="combobox"]').click();
    cy.contains('PNG').should('be.visible');
    cy.contains('JPEG').should('be.visible');
    cy.contains('SVG').should('be.visible');
    cy.contains('JSON').should('be.visible');
    cy.contains('WEBP').should('be.visible');
  });

  it('should save mind map', () => {
    cy.intercept('POST', '/api/canvas/save', {
      statusCode: 200,
      body: { success: true }
    }).as('saveMap');

    cy.contains('Save').click();
  });

  it('should display editor panel', () => {
    cy.get('[class*="monaco-editor"]').should('exist');
  });

  it('should display canvas panel', () => {
    cy.get('[class*="excalidraw"]').should('exist');
  });

  it('should have resizable panels', () => {
    cy.get('[class*="ResizablePanel"]').should('have.length.at.least', 2);
  });

  it('should have resizable handle', () => {
    cy.get('[class*="ResizableHandle"]').should('exist');
  });

  it('should display theme toggle', () => {
    cy.get('header').within(() => {
      cy.get('button[class*="rounded"]').should('exist');
    });
  });

  it('should handle generate script click', () => {
    cy.contains('Generate Script').click();
  });

  it('should handle share click', () => {
    cy.contains('Share').click();
  });

  it('should redirect to login on 401', () => {
    cy.intercept('POST', '/api/canvas/save', {
      statusCode: 401
    }).as('saveUnauthorized');

    cy.contains('Save').click();
    cy.wait('@saveUnauthorized');
  });
});
