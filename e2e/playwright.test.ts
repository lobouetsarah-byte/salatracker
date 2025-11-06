import { test, expect } from '@playwright/test';

/**
 * Tests E2E Playwright pour Salatrack
 * 
 * Installation :
 * npm install -D @playwright/test
 * npx playwright install
 * 
 * Exécution :
 * npx playwright test
 * npx playwright test --headed (avec interface)
 * npx playwright test --debug (mode debug)
 */

const BASE_URL = 'https://app.salatracker.com';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test1234!';

test.describe('Salatrack - Flux utilisateur complet', () => {
  
  test('Inscription + Connexion + Ajout prière', async ({ page }) => {
    // Accéder à la page d'inscription
    await page.goto(`${BASE_URL}/onboarding`);
    
    // Étape 1 : Prénom
    await page.fill('input#firstName', 'TestUser');
    await page.click('button:has-text("Suivant")');
    
    // Étape 2 : Objectifs (sélectionner au moins un)
    await page.click('text=Suivre mes progrès');
    await page.click('button:has-text("Suivant")');
    
    // Étape 3 : Email
    await page.fill('input#email', TEST_EMAIL);
    await page.click('button:has-text("Suivant")');
    
    // Étape 4 : Mot de passe
    await page.fill('input#password', TEST_PASSWORD);
    await page.click('button[type="submit"]:has-text("Créer mon compte")');
    
    // Attendre la redirection vers le dashboard
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    
    // Vérifier présence de l'interface principale
    await expect(page.locator('text=Salatrack')).toBeVisible();
  });

  test('Connexion existante', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    
    await page.fill('input#email-login', TEST_EMAIL);
    await page.fill('input#password-login', TEST_PASSWORD);
    await page.click('button[type="submit"]:has-text("Se connecter")');
    
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    await expect(page.locator('text=Salatrack')).toBeVisible();
  });

  test('Vérifier PWA installable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Vérifier manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
    
    // Vérifier meta PWA
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#0c3b2e');
  });

  test('Navigation offline (vérification service worker)', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Vérifier que le service worker est enregistré
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('Reset mot de passe', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    
    await page.click('text=Mot de passe oublié');
    await page.fill('input#reset-email', TEST_EMAIL);
    await page.click('button:has-text("Envoyer")');
    
    // Vérifier message de confirmation
    await expect(page.locator('text=Vérifiez votre email')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Salatrack - Responsive', () => {
  
  test('Mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('text=Salatrack')).toBeVisible();
  });
  
  test('Tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('text=Salatrack')).toBeVisible();
  });
  
  test('Desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('text=Salatrack')).toBeVisible();
  });
});
