const express = require("express");
const cors = require("cors");
const apartments = require("./data/apartments");
const app = express();
app.use(cors());
const PORT = 3000;

app.get("/apartments", (req, res) => {
  const { city } = req.query;
  const filteredApartments = apartments[city] || [];

  console.log(filteredApartments);
  res.json(filteredApartments);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
