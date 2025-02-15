import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // 새로고침 방지

    try {
      // 1️⃣ 백엔드 로그인 요청
      const response = await axios.post("/api/auth/login", { email, password });

      // 서버에서 JWT 토큰 반환한다고 가정
      const { token, user } = response.data;

      // ✅ 백엔드 로그인 성공 시 토큰 및 유저 정보 저장
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      alert("로그인 성공! (서버 인증)");
      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
      return;
    } catch (error) {
      console.warn("백엔드 로그인 실패, 로컬 데이터 확인 중...");
    }

    // 2️⃣ 백엔드 로그인 실패 시 로컬 데이터 확인 (기존 방식 유지)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 입력한 정보와 일치하는 유저 찾기
    let validUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (validUser) {
      alert("로그인 성공! (로컬 데이터)");
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
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
