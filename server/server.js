//providing data

const express = require("express");
const cors = require("cors")
const app = express();
const port = 3000;
const budget = require("./data");
app.use(cors());
app.get("/budget", (req, res) => {
  res.json(budget);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
