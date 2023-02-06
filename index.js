const express = require("express");
const cors = require('cors');
const app = express(); // 새 앱을 만듦
app.use(cors());
const port = process.env.PORT || 5000; // 백 서버 포트 설정
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // 로그인 토큰을 쿠키에 저장하기
require("dotenv").config();  // .env 파일에서 읽어오기

app.use(bodyParser.urlencoded({ extended: true })); // 바디파서가 클라이언트에서 오는 정보를 분석해서 가져올 수 있도록
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB 연결
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => { // 루트 디렉토리에 라우트
    res.send('Hello World!'); // 웹사이트에 출력
})

// 라우터
app.use("/api/users", require("./routes/users"));
app.use("/api/stage", require("./routes/stage"));
app.use("/api/game", require("./routes/game"));
app.use("/api/illust", require("./routes/illust"));



app.listen(port, () => { // 포트(5000)에서 실행(listen)
    console.log(`Example app listening on port ${port}`); // npm run start하면 터미널 콘솔에 출력
});

