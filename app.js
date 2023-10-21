const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: "653367125044d986e336644c"
  };
  next();
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
