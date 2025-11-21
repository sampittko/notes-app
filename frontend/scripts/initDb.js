const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../backend/db.json");

if (!fs.existsSync(dbPath)) {
  const initialData = {
    notes: [],
  };

  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  console.log("Created db.json with initial data");
} else {
  console.log("db.json already exists");
}
