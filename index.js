// 기본 설정
const express = require('express');
const app = express();
const PORT = 9090;

// public 설정
app.use(express.static(__dirname + '/public'));

// 라우팅 정의
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});
