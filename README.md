## πΉ webcam control

- javascript webcam control
- `javascript` `nodejs express`

### π₯ κΈ°λ³Έ μ€μ 
```javascript
const express = require('express');
const app = express();
const PORT = 3000;
```

### πΈ public μ€μ 
```javascript
app.use(express.static(__dirname + '/public'));
```

### πͺ λΌμ°ν μ μ
```javascript
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
```

### π€ΉββοΈ μλ² μ€ν
```javascript
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});
```
