describe('Canvas Page (Static)', () => {
  beforeEach(() => {
    cy.visit('/canvas');
  });

  it('should load the canvas page successfully', () => {
    cy.contains('Untitled Mind Map').should('be.visible');
  });

  it('should display header with all controls', () => {
    cy.get('header').within(() => {
      cy.contains('Untitled Mind Map').should('be.visible');
      cy.contains('Grid').should('be.visible');
      cy.contains('Generate Script').should('be.visible');
      cy.contains('Share').should('be.visible');
      cy.contains('Save').should('be.visible');
      cy.contains('Export').should('be.visible');
    });
  });

  it('should display coordinates display', () => {
    cy.get('header').within(() => {
      cy.contains('0').should('be.visible');
    });
  });

  it('should toggle grid mode', () => {
    cy.contains('Grid').parent().find('button').click();
  });

  it('should display theme toggle', () => {
    cy.get('header').within(() => {
      cy.get('button[class*="rounded"]').should('exist');
    });
  });

  it('should open export popover', () => {
    cy.contains('Export').click();
    cy.contains('Export Options').should('be.visible');
    cy.contains('File Type').should('be.visible');
  });

  it('should display export format options', () => {
    cy.contains('Export').click();
    cy.get('[role="combobox"]').click();
    cy.contains('PNG').should('be.visible');
    cy.contains('JPEG').should('be.visible');
    cy.contains('SVG').should('be.visible');
    cy.contains('JSON').should('be.visible');
    cy.contains('Markdown').should('be.visible');
  });

  it('should change export format', () => {
    cy.contains('Export').click();
    cy.get('[role="combobox"]').click();
    cy.contains('SVG').click();
  });

  it('should have download button in export popover', () => {
    cy.contains('Export').click();
    cy.contains('Download').should('be.visible');
  });

  it('should display resizable panels', () => {
    cy.get('[class*="ResizablePanel"]').should('have.length.at.least', 2);
  });

  it('should display code editor panel', () => {
    cy.get('[class*="monaco-editor"]').should('exist');
  });

  it('should display canvas panel', () => {
    cy.get('[class*="excalidraw"]').should('exist');
  });

  it('should have resizable handle between panels', () => {
    cy.get('[class*="ResizableHandle"]').should('exist');
  });

  it('should display default DSL code in editor', () => {
    cy.contains('welcomeNode').should('be.visible');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show toast container', () => {
    cy.get('.Toastify').should('exist');
  });

  it('should handle generate script button click', () => {
    cy.contains('Generate Script').click();
  });

  it('should handle share button click', () => {
    cy.contains('Share').click();
  });

  it('should handle save button click', () => {
    cy.contains('Save').click();
  });
});
