import express from "express";
import createTemplate from "./create-template";

const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.status(200).send("Server is Up and Running on Port " + port);
});

app.post("/", async (req, res) => {
  // Calling the template render func with dynamic data
  const result = await createTemplate({
    diagnosis: ["fever", "cough", "cold"],
    patient: {
      email: "imt_2020111@iiitm.ac.in",
      name: "raj varsani",
      phone: "1234567890",
    },
    doctor: {
      email: "doctor@iiitm.ac.in",
      name: "dr. prashant jain",
      phone: "1234567890",
    },
    vitals: {
      height: 167,
      weight: 87,
      pulse: 124,
      temperature: 103,
      bloodPressure: "120/80",
    },
    complaints: [
      {
        description: "weakness",
        duration: 5,
        severity: "high",
        frequency: "constant",
      },
      {
        description: "headache",
        duration: 5,
        severity: "high",
        frequency: "constant",
      },
    ],
    prescription: {
      medications: [
        {
          dosage: {
            morning: {
              beforeMeal: true,
              afterMeal: false,
            },
            afternoon: {
              beforeMeal: true,
              afterMeal: false,
            },
            night: {
              beforeMeal: true,
              afterMeal: true,
            },
          },
          quantity: 8,
          type: "dosage",
          notes: "",
          name: "Amoxicillin - 500 mg",
        },
        {
          dosage: {
            morning: {
              beforeMeal: true,
              afterMeal: false,
            },
            afternoon: {
              beforeMeal: true,
              afterMeal: false,
            },
            night: {
              beforeMeal: true,
              afterMeal: false,
            },
          },
          quantity: 2,
          notes: "Take whenever feel headache",
          type: "notes",
          name: "Amoxicillin - 500 mg",
        },
      ],
      advice: "Take Bed Rest for two days",
    },
    completedAt: "2023-08-17T13:06:54.709Z",
  });

  // Setting up the response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=export.pdf`);

  // Streaming our resulting pdf back to the user
  result.pipe(res);
});

app.listen(port, () => {
  console.log(`The sample PDF app is running on port ${port}.`);
});
