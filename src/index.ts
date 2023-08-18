import dotenv from "dotenv";
dotenv.config();
import express from "express";
import createTemplate from "./phr-template";
import fs from "fs";

import nodemailer from "nodemailer";
import s3Service from "./s3.service";

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

const SENDMAIL = async (mailDetails: any, callback: (info: any) => any) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log("ERROR SENDING MAIl", error);
  }
};

const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.status(200).send("Server is Up and Running on Port " + port);
});

app.post("/", async (req, res) => {
  // Calling the template render func with dynamic data
  const result = await createTemplate(req.body);
  const filename = `./files/report${req.body._id}.pdf`;
  const ws = fs.createWriteStream(filename);
  result.pipe(ws);

  await new Promise((resolve) => {
    ws.on("finish", () => {
      resolve("Success");
    });
    ws.on("error", (err) => {
      console.log("ERROR IN WRITING FILE", err);
      resolve("PDF generation failed");
    });
  });

  const fileData: Buffer = await new Promise((resolve, reject) => {
    fs.readFile(filename, async function (err, data) {
      if (err) {
        console.log("ERROR IN READING FILE", err);
        reject(err);
      } // Fail if the file can't be read.
      resolve(data);
    });
  });

  const responseFromAWS = await s3Service.uploadFile(req.body._id, fileData);
  const publicURL = responseFromAWS.Location;

  await SENDMAIL(
    {
      from: `IIITM Health Center <${process.env.SMTP_EMAIL}>`, // sender address
      to: req.body.patient.email, // receiver email
      subject: `Health Report for Appointment on ${new Date(
        req.body.createdAt
      ).toDateString()}`, // Subject line
      html: `<p>Hi ${req.body.patient.name}, Please find your health report here: ${publicURL}</p>`,
    },
    (info) => {
      console.log("MAIL SENT: ", info);
    }
  );

  res.status(200).send({
    message: "Mail Sent Successfully",
    publicURL: publicURL,
  });
});

app.listen(port, () => {
  console.log(`server is up and running on port ${port}.`);
});
