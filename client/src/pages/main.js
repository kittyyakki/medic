import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    alert("로그아웃 되었습니다.");
    window.location.href = "/login"; // 리액트 라우터로 로그인 페이지 이동
  };

  return (
    <div>
      <header>
        <h1>병원 홈페이지</h1>
        <nav>
          <ul id="login-menu">
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/info">진료 안내</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login" id="login-link">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link to="/signup" id="signup-link">
                    회원가입
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout}>로그아웃 ({user.name})</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <p>환영합니다! 여기에 병원 정보를 추가하세요.</p>
      </main>
    </div>
  );
};

export default Main;
