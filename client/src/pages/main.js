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
  }, []); //무한 스크롤을 위해 빈 배열 전달

  const fetchItems = async () => { //무한 스크롤을 위한 데이터 불러오기 함수
    if (loading || !hasMore) return;//로딩 중이거나 추가 데이터가 없으면 중단
    setLoading(true);//로딩 상태로 변경

    try {
      const response = await axios.get(`/api/news?page=${page}`); // 병원 소식 API 호출
      if (response.data.length > 0) {//불러온 데이터가 있을 경우
        setItems((prevItems) => [...prevItems, ...response.data]);//데이터 추가
        setPage((prevPage) => prevPage + 1);//페이지 번호 증가
      } else {//불러온 데이터가 없을 경우
        setHasMore(false); // 더 이상 불러올 데이터가 없을 경우
      }
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IntersectionObserver를 이용해 무한 스크롤 감지
  useEffect(() => {//로더 요소를 감지
    const observer = new IntersectionObserver(//IntersectionObserver 생성
      (entries) => {//콜백 함수
        if (entries[0].isIntersecting) {//로더 요소가 화면에 보일 때
          fetchItems();//데이터 불러오기 함수 호출
        }
      },
      { threshold: 1 }//임계값: 1
    );

    if (loader.current) {// 로더 요소가 있을 경우
      observer.observe(loader.current);//로더 요소 감지
    }

    return () => {//컴포넌트 언마운트 시
      if (loader.current) observer.unobserve(loader.current);
    };//로더 요소 감지 해제
  }, [loader]);//로더 요소가 변경될 때만 실행

  const handleLogout = () => {//로그아웃 함수
    localStorage.removeItem("loggedInUser");//로그인 정보 삭제
    alert("로그아웃 되었습니다.");//알림 메시지
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
        <div className="news-list">//데이터 목록
          {items.map((item, index) => (//데이터 목록 출력
            <div key={index} className="news-item">//데이터 항목
              <h3>{item.title}</h3>//제목
              <p>{item.content}</p>//내용
            </div>
          ))}
        </div>
        {loading && <p>로딩 중...</p>}//로딩 중일 때 메시지 출력
        <div
          ref={loader}
          style={{ height: "20px", background: "transparent" }}
        ></div>
      </main>
    </div>
  );
};

export default Main;
