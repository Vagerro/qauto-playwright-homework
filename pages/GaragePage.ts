import { Page, Locator, expect } from '@playwright/test';

/**
 * Page object for the QAuto Garage screen and its "Add a car" dialog.
 * Encapsulates locators/actions only — no assertions about business
 * outcomes beyond simple state checks (e.g. dialog visibility).
 */
export class GaragePage {
  readonly page: Page;
  readonly guestLogInButton: Locator;
  readonly addCarButton: Locator;
  readonly addCarDialog: Locator;
  readonly brandSelect: Locator;
  readonly modelSelect: Locator;
  readonly mileageInput: Locator;
  readonly dialogAddButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.guestLogInButton = page.getByRole('button', { name: /guest log in/i });
    this.addCarButton = page.getByRole('button', { name: /add car/i });
    this.addCarDialog = page.getByRole('dialog');
    this.brandSelect = this.addCarDialog.getByLabel(/brand/i);
    this.modelSelect = this.addCarDialog.getByLabel(/model/i);
    this.mileageInput = this.addCarDialog.getByLabel(/mileage/i);
    this.dialogAddButton = this.addCarDialog.getByRole('button', { name: /^add$/i });
  }

  async guestLogIn() {
    await this.page.goto('/');
    await this.guestLogInButton.click();
    await expect(this.page).toHaveURL(/panel\/garage/);
  }

  async openAddCarDialog() {
    await this.addCarButton.click();
    await expect(this.addCarDialog).toBeVisible();
  }

  async fillAddCarForm(brand: string, model: string, mileage: string) {
    await this.brandSelect.selectOption({ label: brand });
    await this.modelSelect.selectOption({ label: model });
    await this.mileageInput.fill(mileage);
  }

  async submitAddCarForm() {
    await this.dialogAddButton.click();
    await expect(this.page).toHaveURL(/panel\/garage/);
  }

  async addCar(brand: string, model: string, mileage: string) {
    await this.openAddCarDialog();
    await this.fillAddCarForm(brand, model, mileage);
    await this.submitAddCarForm();
  }

  carRow(brand: string, model: string) {
    return this.page.getByText(new RegExp(`${brand}\\s*${model}`, 'i')).first();
  }
}
