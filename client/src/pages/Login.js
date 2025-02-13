import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); // 새로고침 방지

    // 저장된 유저 데이터 가져오기
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 입력한 정보와 일치하는 유저 찾기
    let validUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (validUser) {
      alert("로그인 성공!");
      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } else {
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <p>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
