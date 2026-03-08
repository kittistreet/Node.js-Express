const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const productsRouter = express.Router();

const app = express();
const PORT = process.env.PORT;

app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "/public/")));

app.set("views", "./src/views");
app.set("view engine", "ejs");

// productsRouter.route("/").get((req, res) => {
//   res.render("products",{
//     {},
//     {},
//     {},
//     {}
    

//   });
// });


productsRouter.route("/1").get((req, res) => {
  res.send("Hello world !! I'm Product1");
});

app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.render("index", { username: "KTT.W" });
});

app.listen(PORT, () => {
  console.log("Listening on PORT" + chalk.green(" : " + PORT));
  // debug("Listening on port" + chalk.green(" : "+port));
});
