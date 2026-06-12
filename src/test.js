const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://karmakarsuman12138_db_user:8wnZfcBiiZuHVPQS@cluster0.kbly7hr.mongodb.net/?appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Connected");
    console.log("Database:", mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });