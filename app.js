import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const username = process.env.MAIL_USERNAME;
const password = process.env.MAIL_PASSWORD;
const clientID = process.env.OAUTH_CLIENTID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;
const redirectURI = process.env.OAUTH_REDIRECT_URI;
const user_email = process.env.FROM_EMAIL;
const to_email = process.env.TO_EMAIL;
const oAuth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  redirectURI
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });
const sendMail = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: username,
        pass: password,
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: `${user_email}`,
      to: `${to_email}`,
      subject: "Nodemailer Project",
      text: "This project works now!",
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () =>
  console.log(`Server connected to http://localhost:${PORT}`)
);
sendMail();
//Creating a nodemailer API
// 1. Create a  transporter object
// 2. Create a mailOptions object
// 3. Use transporter.sendMail method
