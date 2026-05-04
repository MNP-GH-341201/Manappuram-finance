import { expect } from '@playwright/test';

export async function scrollContainerToBottom(page, selector) {
  await page.locator(selector).evaluate(el => { el.scrollTop = el.scrollHeight; });
}

export async function selectSuggestionStartingWith(page, textStartsWith, timeout = 15000) {
  const suggestion = page.getByText(new RegExp(`^${textStartsWith}`, 'i')).first();
  await expect(suggestion).toBeVisible({ timeout });
  await suggestion.click();
}

export async function clickAndHandleDialog(page, clickLocator, {
  timeout = 2000,
  ignoreTexts = [],
  actionForOtherDialogs = 'accept'
} = {}) {
  const dialogPromise = page.waitForEvent('dialog', { timeout }).catch(() => null);
  await clickLocator.click();
  const dialog = await dialogPromise;

  if (!dialog) return null;

  const msg = dialog.message() || '';
  const shouldIgnore = ignoreTexts.some(t => msg.toLowerCase().includes(String(t).toLowerCase()));

  if (shouldIgnore) {
    await dialog.dismiss().catch(() => {});
    return { handled: true, ignored: true, message: msg };
  }

  if (actionForOtherDialogs === 'dismiss') {
    await dialog.dismiss().catch(() => {});
  } else {
    await dialog.accept().catch(async () => dialog.dismiss().catch(() => {}));
  }

  return { handled: true, ignored: false, message: msg };
}

export async function pickDateInJqueryCalendar(page, dayText) {
  await page.locator(`.ui-datepicker-calendar a:text-is("${dayText}")`).first().click();
}