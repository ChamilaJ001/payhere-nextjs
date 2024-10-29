const crypto = require("crypto");
const PaymentService = require("../Services/PaymentService");
const AdsService = require("../Services/AdsService");
const UserPlan = require("../Models/User/UserPlanModel");
const { updateUserPlan } = require("../helpers/helper");
const { sendPaymentEmail } = require("../helpers/email-sender");
const logger = require("../configs/logger");

class PaymentController {
  async GenerateHash(req, res) {
    const { order_id, amount, currency } = req.body;

    const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
    const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;

    const formattedAmount = Number(amount).toFixed(2);

    // Generate the hash
    const hash = crypto
      .createHash("md5")
      .update(
        `${MERCHANT_ID}${order_id}${formattedAmount}${currency}${crypto
          .createHash("md5")
          .update(MERCHANT_SECRET)
          .digest("hex")
          .toUpperCase()}`
      )
      .digest("hex")
      .toUpperCase();

    res.json({ hash });
  }

  // Get payhere notification
  async PayhereNotification(req, res) {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method,
      status_message,
      custom_1,
      custom_2,
    } = req.body;
    const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;

    const local_md5sig = crypto
      .createHash("md5")
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto
          .createHash("md5")
          .update(MERCHANT_SECRET)
          .digest("hex")
          .toUpperCase()}`
      )
      .digest("hex")
      .toUpperCase();

    const userData = JSON.parse(custom_1);
    const { name, email, user_id } = userData;

    const customData = JSON.parse(custom_2);
    const { adId, dates, qty } = customData;

    // 2 - success
    // 0 - pending
    // -1 - canceled
    // -2 - failed
    // -3 - chargedback

    if (local_md5sig === md5sig && status_code == 2) {
      // Update database
    }
  }
}

module.exports = new PaymentController();
