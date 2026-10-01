import { test, expect } from '@playwright/test';
import { GaragePage } from '../pages/GaragePage';

test('guest can add Audi TT to Garage', async ({ page }) => {
  const garage = new GaragePage(page);

  // Setup: guest login is a precondition, not the main assertion
  await garage.guestLogIn();

  // Add a car via the Garage's "Add a car" dialog
  await garage.addCar('Audi', 'TT', '12000');

  // Main assertion: Audi TT appears in Garage
  await expect(garage.carRow('Audi', 'TT')).toBeVisible();
});
