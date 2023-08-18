import express from "express";
import createTemplate from "./phr-template";
import fs from "fs";
const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.status(200).send("Server is Up and Running on Port " + port);
});

app.post("/", async (req, res) => {
  // Calling the template render func with dynamic data
  const result = await createTemplate(req.body);

  const ws = fs.createWriteStream(`./files/report${req.body._id}.pdf`);
  result.pipe(ws);
  ws.on("finish", () => res.status(200).send("Done"));
  ws.on("error", (err) =>
    res.send(400).send({
      message: "Something went wrong",
      err: err,
    })
  );
});

app.listen(port, () => {
  console.log(`The sample PDF app is running on port ${port}.`);
});
