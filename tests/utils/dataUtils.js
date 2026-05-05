export function makeUniqueVendorData(prefix = 'Test') {
  const ts = Date.now();
  const phone = '9' + String(ts).slice(-9);
  const email = `vendor_${ts}@gmail.com`;
  const name = `${prefix}_${ts}`;
  return { phone, email, name };
}