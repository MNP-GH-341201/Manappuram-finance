const cameraFrameLocators = {
  frame: "iframe[src*='hyperverge']",
  cameraLoader: "//div[contains(@class,'hv-camera-loading')]",
  captureButton: "//span[text()='Capture Photo']",
  proceedCapture: "//span[text()='Proceed to Capture']",
  errorIcon: "//img[contains(@class,'hv-retake-screen-exclamation')]",
};

const customerVerificationLocators = {
  customerMenu: "//span[normalize-space()='Customer']",
  onetimeVerificationMenu: "//span[normalize-space()='Onetime Verification']",

  customerIdInput: "input[placeholder='Enter Customer Id']",
  searchButton: "button:has-text('Search')",
  // idDropdown: "input[placeholder='Please Select Your ID']",
  // copyOfVoterIdOption:"span[normalize-space()='COPY OF VOTERSID']",

  proceedHereButton: "button:has-text('Proceed here')",
  proceedToCaptureButton: "button:has-text('Proceed to Capture')",

  mobileVerificationPopup:
    "text=Complete your verification on Mobile browser",
};

const loginLocators = {
  employeeIdInput: "input[placeholder='Employee ID']",
  passwordInput: "input[placeholder='Password']",
  loginButton: "button[type='submit']",
  branchText: "text=SULTAN PET",
};

module.exports = {
  cameraFrameLocators,
  customerVerificationLocators,
  loginLocators,
};