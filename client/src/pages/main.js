document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLink = document.getElementById("login-link");
  const signupLink = document.getElementById("signup-link");
  const loginMenu = document.querySelector("nav ul");

  if (user) {
    // 로그인한 경우 로그인/회원가입 버튼을 로그아웃 버튼으로 교체
    if (loginLink) {
      loginLink.style.display = "none";
      console.log("✅ 로그인 버튼 숨김 성공!");
    } else {
      console.log("❌ loginLink 요소를 찾지 못함!");
    }

    if (signupLink) {
      signupLink.style.display = "none";
      console.log("✅ 회원가입 버튼 숨김 성공!");
    } else {
      console.log("❌ signupLink 요소를 찾지 못함!");
    }

    // 로그아웃 버튼 추가
    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.id = "logout-btn";
    logoutLink.textContent = `로그아웃 (${user.name})`;

    logoutItem.appendChild(logoutLink);
    loginMenu.appendChild(logoutItem);

    // 로그아웃 기능 추가
    logoutLink.addEventListener("click", function () {
      localStorage.removeItem("loggedInUser"); // 로그인 정보 삭제
      alert("로그아웃 되었습니다.");
      window.location.href = "login.html"; // 로그인 페이지로 이동
    });

    //이메일 인증 표시
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          document.getElementById("user-status").innerText =
            "이메일 인증 완료 ✅";
        } else {
          document.getElementById("user-status").innerText =
            "이메일 인증 필요 ❌";
        }
      }
    });
  }
});
