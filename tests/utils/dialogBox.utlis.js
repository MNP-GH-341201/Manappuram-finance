function handleAllDialogs() {
  const dialog = this.page.locator('.cdk-overlay-pane');

  while (await dialog.isVisible().catch(() => false)) {
    const okBtn = dialog.getByRole('button', { name: /ok/i });
    await okBtn.click();
    await this.page.waitForTimeout(500); // tiny buffer
  }
}
