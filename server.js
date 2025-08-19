const express = require("express");
const { connectDB } = require("./database"); // ✅ import correctly

const app = express();

connectDB(); 

app.use(express.json());

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
