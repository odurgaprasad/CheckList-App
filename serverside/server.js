const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json());

const DATA_API =
  "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";

const checklist = [
  {
    id: 1,
    description: "Valuation Fee Paid",
    validate: (data) => data.isValuationFeePaid === true,
  },
  {
    id: 2,
    description: "UK Resident",
    validate: (data) => data.isUkResident === true,
  },
  {
    id: 3,
    description: "Risk Rating Medium",
    validate: (data) => data.riskRating === "Medium",
  },
  {
    id: 4,
    description: "LTV Below 60%",
    validate: (data) => {
      const { loanRequired, purchasePrice } = data.mortgage;
      console.log(loanRequired);
      const loan = parseFloat(loanRequired.replace(/[^0-9.-]+/g, ""));
      const price = parseFloat(purchasePrice.replace(/[^0-9.-]+/g, ""));
      return (loan / price) * 100 < 60;
    },
  },
];

app.get("/api/checklist", async (req, res) => {
  try {
    const { data } = await axios.get(DATA_API);
    console.log(data);
    const results = checklist.map((rule) => ({
      id: rule.id,
      description: rule.description,
      status: rule.validate(data) ? "Passed" : "Failed",
    }));
    res.json(results);
    console.log(results);
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.status : error.message
    );
    res.status(500).json({ error: "Failed to fetch data from API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
