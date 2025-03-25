// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/mydatabase') // 'mydatabase'는 데이터베이스 이름. 원하는 이름으로 변경 가능.
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 사용자 스키마 정의 (Mongoose Schema)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  gender: { type: String, required: true },
  // 필요한 다른 필드 추가
});

// 사용자 모델 정의 (Mongoose Model)
const User = mongoose.model('User', userSchema); // 'User'는 컬렉션 이름 (복수형으로 users 컬렉션이 생성됨)


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', async (req, res) => { // async 함수로 변경
  try {
    const username = req.body.username;
    const gender = req.body.gender;

    // 새로운 사용자 생성 (Mongoose Model 사용)
    const newUser = new User({
      username: username,
      gender: gender,
    });

    // 데이터베이스에 저장
    await newUser.save();

    console.log('User saved:', newUser);

    res.send(`<h1>가입 완료!</h1><p>이름: ${username}</p><p>성별: ${gender === 'm' ? '남자' : '여자'}
        <a href="index.html">돌아가기</a>
        </p>`);
  } catch (error) {
    console.error('에러 이름이랑 성별이 제대로 전송되지 않았음. saving user:', error);
    res.status(500).send('<h1>에러</h1><p>Failed to save user.<a href="index.html">돌아가기</a><br/><br/>이름이랑 성별이 제대로 전송되지 않았음.</p>'); // 오류 응답
  }
});


// (선택사항) 모든 회원 정보 가져오는 API
app.get('/users', async (req,res)=>{
    try{
        const users = await User.find({}); // 모든 사용자 찾기
        res.json(users); // JSON 형태로 응답
    } catch(error){
        console.error(error);
        res.status(500).send("에러낫다다");
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`);
});