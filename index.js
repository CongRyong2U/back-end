const express = require('express') // express 모듈을 가져옴
const app = express() // 새 앱을 만듦
const port = 5000 // 백 서버 포트 설정


app.get('/', (req, res) => { // 루트 디렉토리에 라우트
    res.send('Hello World!') // 웹사이트에 출력
})

app.listen(port, () => { // 포트(5000)에서 실행(listen)
    console.log(`Example app listening on port ${port}`) // npm run start하면 터미널 콘솔에 출력
})