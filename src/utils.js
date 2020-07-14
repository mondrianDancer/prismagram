import { adjectives, nouns } from "./words";
import jwt from "jsonwebtoken";

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendMail = (email) => {
  const api_key = process.env.APIKEY;
  const domain = process.env.DOMAIN;
  const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
  return mailgun.messages().send(email, (error, body) => {
    if (error) console.log(error);
    else console.log(body);
  });
};

export const sendSecretMail = (adress, secret) => {
  const email = {
    from: "Juyeon@gmail.com",
    to: adress,
    subject: "🔒Login Secret for Prismagram🔒",
    html: `Hello! Your login secret is <strong>${secret}</strong>. <br/>
          Copy paste on the app/website to login`,
  };
  return sendMail(email);
};
export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);
