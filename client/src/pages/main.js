import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Main.css";

const Main = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]); // 병원 소식 데이터
  const [page, setPage] = useState(1); // 현재 페이지
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 여부
  const loader = useRef(null); // 감지할 요소

  // ✅ 로그인 정보 로드
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  }, []);

  // ✅ 병원 소식 불러오기
  useEffect(() => {
    fetchItems(); // 초기 데이터 로드
  }, []);

  const fetchItems = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`/api/news?page=${page}`); // 병원 소식 API 호출
      if (response.data.length > 0) {
        setItems((prevItems) => [...prevItems, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없을 경우
      }
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IntersectionObserver를 이용해 무한 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchItems();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    alert("로그아웃 되었습니다.");
    window.location.href = "/login";
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
        <div className="news-list">
          {items.map((item, index) => (
            <div key={index} className="news-item">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
        {loading && <p>로딩 중...</p>}
        <div
          ref={loader}
          style={{ height: "20px", background: "transparent" }}
        ></div>
      </main>
    </div>
  );
};

export default Main;
