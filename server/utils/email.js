const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(email, url) {
    this.to = email;
    this.url = url;
    this.from = `DEV Reset <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // TODO
      return 1;
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      url: this.url,
      subject,
    });

    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    });
  }

  async sendResetPassword() {
    await this.send('reset', 'Reset your password');
  }

  async sendContactMessage(name, email, reason, message) {
    const html = pug.renderFile(`${__dirname}/../views/contact.pug`, {
      name,
      email,
      reason,
      message,
    });

    await this.newTransport().sendMail({
      from: this.from,
      to: 'contact@spadewoodworks.com',
      subject: `Contact Form: ${reason}`,
      html,
      text: htmlToText.htmlToText(html),
    });
  }
};
