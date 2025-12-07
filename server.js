const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = "mongodb+srv://myUser:myDBPassword@cluster0.mbgk15z.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "zipsDB";
const collectionName = "places";

// Use EJS templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Process search
app.post("/process", async (req, res) => {
  const input = req.body.query.trim();
  console.log(`\nUser input: ${input}`);

  let result;
  await client.connect();
  const db = client.db(dbName);
  const places = db.collection(collectionName);

  if (!isNaN(input[0])) {
    // Input is a ZIP
    result = await places.findOne({ zips: input });
    console.log("Searching by ZIP...");
  } else {
    // Input is a Place
    result = await places.findOne({ place: new RegExp(`^${input}$`, "i") });
    console.log("Searching by Place...");
  }

  console.log("DB Result:", result);

  res.render("result", { result });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
