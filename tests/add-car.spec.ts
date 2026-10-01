import { test, expect } from '@playwright/test';

test('guest can add Audi TT to Garage', async ({ page }) => {
  // Setup: guest login is a precondition, not the main assertion
  await page.goto('/');
  await page.getByRole('button', { name: /guest log in/i }).click();
  await expect(page).toHaveURL(/panel\/garage/);

  // Open "Add a car" form
  await page.getByRole('button', { name: /add car/i }).click();
  const addCarDialog = page.getByRole('dialog');
  await expect(addCarDialog).toBeVisible();

  // Fill Brand / Model / Mileage
  await addCarDialog.getByLabel(/brand/i).selectOption({ label: 'Audi' });
  await addCarDialog.getByLabel(/model/i).selectOption({ label: 'TT' });
  await addCarDialog.getByLabel(/mileage/i).fill('12000');
  await addCarDialog.getByRole('button', { name: /^add$/i }).click();

  // Main assertion: Audi TT appears in Garage
  await expect(page).toHaveURL(/panel\/garage/);
  await expect(page.getByText(/Audi\s*TT/i).first()).toBeVisible();
});
