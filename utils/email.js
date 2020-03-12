const nodemailer = require("nodemailer");
const user = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass: ""
  }
});

/**
 * @class Email
 */
class Email {
  /**
   * @method send
   */
  static send(msg, error = false) {
    return transporter.sendMail({
      to: user,
      from: user,
      subject: error ? "Scraper Error" : "Scraper Results",
      html: error ? `<p>${msg}</p>` : msg
    });
  }
}

module.exports = Email;
