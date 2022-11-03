## 📹 webcam control

- javascript webcam control
- `javascript` `nodejs express`

### 🥁 기본 설정
```javascript
const express = require('express');
const app = express();
const PORT = 3000;
```

### 🎸 public 설정
```javascript
app.use(express.static(__dirname + '/public'));
```

### 🎪 라우팅 정의
```javascript
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
```

### 🤹‍♂️ 서버 실행
```javascript
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});
```
