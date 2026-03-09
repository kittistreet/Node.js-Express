const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; // เพิ่ม default port กรณีลืมตั้ง env

// ตั้งค่า View และ Static Files
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "/public/")));
app.set("views", "./src/views");
app.set("view engine", "ejs");

// 1. เชื่อมต่อ MongoDB
// เปลี่ยน localhost เป็น 127.0.0.1 หากพบปัญหาการเชื่อมต่อ
mongoose.connect('mongodb://127.0.0.1:27017/myProject')
  .then(() => console.log(chalk.blue('Connected to MongoDB...')))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// 2. สร้าง Schema และ Model (อ้างอิงจากไฟล์ csvjson.json)
const airbnbSchema = new mongoose.Schema({
  id: Number,
  name: String,
  host_name: String,
  neighbourhood: String,
  room_type: String,
  price: mongoose.Schema.Types.Mixed, // รองรับทั้งตัวเลขและค่าว่าง ""
  number_of_reviews: Number,
  availability_365: Number
});

// เชื่อมไปที่ collection ชื่อ 'airbnb.list' ตามที่คุณระบุ
const Airbnb = mongoose.model('Airbnb', airbnbSchema, 'airbnb.list');

app.get("/", async (req, res) => {
  try {
    const airbnbData = await Airbnb.find().limit(20); 
    
    // ตรงนี้สำคัญมาก: ชื่อ key ทางซ้ายคือชื่อที่จะถูกส่งไปใช้ใน EJS
    res.render("index", { 
        username: "KTT.W", 
        airbnbList: airbnbData  // <--- ต้องใช้ชื่อ airbnbList ให้ตรงกับในไฟล์ .ejs
    });
  } catch (err) {
    res.status(500).send("Error");
  }
});

// Router อื่นๆ
const productsRouter = require("./src/router/productsRouter");
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log("Listening on PORT" + chalk.green(" : " + PORT));
});