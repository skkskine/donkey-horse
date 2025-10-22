const express = require("express");
const app = express();
const port = 3600;
const cors = require("cors");

app.use(cors());

app.get("/getEventsList", (req, res) => {
  res.json({ events: [] });
});

app.listen(port);
console.log("app listening on port");
