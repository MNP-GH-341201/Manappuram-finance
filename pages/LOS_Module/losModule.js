const { expect } = require('@playwright/test');

class AddLosApplicationPage {
  constructor(page) {
    this.page = page;
    this.loanApplicationsMenu = page.getByText('Loan Applications', {
      exact: true,
    });
    this.loanApplicationsSubMenu = page.getByText('Loan Application', {
      exact: true,
    });
    this.CreateNewApplicationButton = page.getByRole('button', { name: /Create New Application/i });
    this.SelectProduct = page.locator('select[formcontrolname="productId"]');
    this.SelectLoanType = page.locator('select[formcontrolname="loanTypeId"]');
    this.SelectSchemeName = page.locator('select[formcontrolname="schemeId"]');
    this.purposeLoan = page.locator('select[formcontrolname="purposeEndUseId"]');
    this.remarks = page.locator('textarea[formcontrolname="endUseRemarks"]');
    this.continueButton = page.getByRole('button', { name: /Continue/i });
  }

  async navigateToAddLoanApplication() {
    await this.loanApplicationsMenu.click();
    await expect(this.loanApplicationsSubMenu).toBeVisible();
    await this.loanApplicationsSubMenu.click();

    await expect(
      this.page.getByText('Loan Originating System')
    ).toBeVisible({ timeout: 60000 });
  }
  async  CreateNewApplication () {
    await this.SelectProduct.selectOption({ label: 'MSME & ALLIED ' });
    await this.SelectLoanType.selectOption({ label: 'MSME - Working Capital' });
    await expect(this.page.getByText('Add Inventory')).toBeVisible();
    await this.page.getByText('Add Inventory').click();
}
}
module.exports = { AddLosApplicationPage };