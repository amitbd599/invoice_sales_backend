var nodemailer = require("nodemailer");

const EmailSend = async (emailTo, emailText, emailSubject) => {
  const transporter = nodemailer.createTransport({
    host: "mail.amitjs.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "test@amitjs.com",
      pass: "QB)*j9g?r]Sk",
    },
  });

  const info = {
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: emailTo, // list of receivers
    subject: emailSubject, // Subject line
    html: `<b>${emailText}</b>`, // html body
  };

  return await transporter.sendMail(info);
};

module.exports = EmailSend;
