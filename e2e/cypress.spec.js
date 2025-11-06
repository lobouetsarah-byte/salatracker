/**
 * Tests E2E Cypress pour Salatrack
 * 
 * Installation :
 * npm install -D cypress
 * 
 * Exécution :
 * npx cypress open (interface)
 * npx cypress run (headless)
 */

const BASE_URL = 'https://app.salatracker.com';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test1234!';

describe('Salatrack - Flux utilisateur complet', () => {
  
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('Page d\'accueil charge correctement', () => {
    cy.contains('Salatrack').should('be.visible');
  });

  it('Inscription complète', () => {
    cy.visit(`${BASE_URL}/onboarding`);
    
    // Étape 1 : Prénom
    cy.get('input#firstName').type('TestUser');
    cy.contains('button', 'Suivant').click();
    
    // Étape 2 : Objectifs
    cy.contains('Suivre mes progrès').click();
    cy.contains('button', 'Suivant').click();
    
    // Étape 3 : Email
    cy.get('input#email').type(TEST_EMAIL);
    cy.contains('button', 'Suivant').click();
    
    // Étape 4 : Mot de passe
    cy.get('input#password').type(TEST_PASSWORD);
    cy.contains('button', 'Créer mon compte').click();
    
    // Vérifier redirection
    cy.url().should('eq', `${BASE_URL}/`);
    cy.contains('Salatrack').should('be.visible');
  });

  it('Connexion utilisateur', () => {
    cy.visit(`${BASE_URL}/auth`);
    
    cy.get('input#email-login').type(TEST_EMAIL);
    cy.get('input#password-login').type(TEST_PASSWORD);
    cy.contains('button', 'Se connecter').click();
    
    cy.url().should('eq', `${BASE_URL}/`);
    cy.contains('Salatrack').should('be.visible');
  });

  it('PWA - Vérifier manifest', () => {
    cy.request(`${BASE_URL}/manifest.webmanifest`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq('Salatrack');
      expect(response.body.short_name).to.eq('Salatrack');
      expect(response.body.theme_color).to.eq('#0c3b2e');
    });
  });

  it('PWA - Vérifier icônes', () => {
    cy.request(`${BASE_URL}/favicon.png`).its('status').should('eq', 200);
    cy.request(`${BASE_URL}/icon-512.png`).its('status').should('eq', 200);
  });

  it('SEO - Vérifier robots.txt', () => {
    cy.request(`${BASE_URL}/robots.txt`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('User-agent: *');
      expect(response.body).to.include('Sitemap:');
    });
  });

  it('SEO - Vérifier sitemap.xml', () => {
    cy.request(`${BASE_URL}/sitemap.xml`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('<urlset');
      expect(response.body).to.include('https://salatrack.app/');
    });
  });

  it('Reset mot de passe', () => {
    cy.visit(`${BASE_URL}/auth`);
    
    cy.contains('Mot de passe oublié').click();
    cy.get('input#reset-email').type(TEST_EMAIL);
    cy.contains('button', 'Envoyer').click();
    
    cy.contains('Vérifiez votre email', { timeout: 5000 }).should('be.visible');
  });

  it('Navigation - Vérifier liens', () => {
    cy.contains('a', 'Conditions').click();
    cy.url().should('include', '/terms');
    cy.go('back');
    
    cy.contains('a', 'Confidentialité').click();
    cy.url().should('include', '/privacy');
  });
});

describe('Salatrack - Responsive Design', () => {
  
  const viewports = [
    { device: 'iPhone X', width: 375, height: 812 },
    { device: 'iPad', width: 768, height: 1024 },
    { device: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ device, width, height }) => {
    it(`Affichage correct sur ${device}`, () => {
      cy.viewport(width, height);
      cy.visit(BASE_URL);
      cy.contains('Salatrack').should('be.visible');
    });
  });
});

describe('Salatrack - Performance', () => {
  
  it('Page charge en moins de 3 secondes', () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: (win) => {
        win.performance.mark('start-load');
      },
    });

    cy.window().then((win) => {
      win.performance.mark('end-load');
      win.performance.measure('load-time', 'start-load', 'end-load');
      const measure = win.performance.getEntriesByName('load-time')[0];
      expect(measure.duration).to.be.lessThan(3000);
    });
  });
});
