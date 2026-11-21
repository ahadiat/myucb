/**
 * Configure these values before using the registration flow.
 * Keep the OCR endpoint and Apps Script deployment URL on HTTPS in production.
 */
export const MEAL_REGISTRATION_CONFIG = {
  // Deploy your Google Apps Script as a Web App and paste its /exec URL here.
  APPS_SCRIPT_URL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_EXEC_URL",

  // Public HTTPS URL for your deployed OCR API, e.g. https://your-domain.com/api/ocr
  // The browser does not call this directly: Apps Script calls it server-to-server.
  OCR_API_URL: "PASTE_YOUR_DEPLOYED_OCR_API_URL",

  // Set the account number students should transfer to.
  BANK_NAME: "Your Bank",
  ACCOUNT_NAME: "Your Organisation",
  ACCOUNT_NUMBER: "0000000000",

  // Optional public image URL for your DuitNow/bank QR image.
  PAYMENT_QR_IMAGE_URL: "",

  // Same price for each selected meal session, in MYR.
  PRICE_PER_MEAL: 1,

  // WhatsApp number with country code, digits only. Example Malaysia: 60123456789
  ADMIN_WHATSAPP: "60123456789",

  // Change this to your event's payment instructions.
  PAYMENT_INSTRUCTIONS: "Use your matric number as the payment reference.",

  // Set true only if your Apps Script enforces the Sunday 2:00 PM–4:00 PM window.
  SHOW_PAYMENT_WINDOW_NOTICE: true,

  STORAGE_KEY: "ucb_meal_registration_v1",
} as const;
