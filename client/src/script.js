//회원가입
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 새로고침 방지

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (!auth.currentUser || !auth.currentUser.emailVerified) {
        alert("이메일 인증을 완료해야 회원가입할 수 있습니다.");
        return;
      }

      // 비밀번호 정규식 (최소 8자, 대소문자, 숫자, 특수문자 포함)
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      if (!passwordRegex.test(password)) {
        alert(
          "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
        );
        return;
      }

      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 기존 유저 데이터 가져오기 (배열 형태)
      let users = JSON.parse(localStorage.getItem("users")) || [];
      console.log("현재 저장된 users:", users); // ✅ 디버깅 콘솔 추가

      // 중복 이메일 체크
      if (users.find((user) => user.email === email)) {
        alert("이미 가입된 이메일입니다.");
        window.location.href = "login.html"; // 로그인 페이지로 이동
        return;
      }

      // 새로운 유저 데이터 생성
      users.push({ name, email, password });

      // 로컬 스토리지에 저장
      localStorage.setItem("users", JSON.stringify(users));

      console.log("회원가입 후 저장된 users:", localStorage.getItem("users")); // ✅ 디버깅 콘솔 추가

      // 회원가입 성공 시 처리
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      window.location.href = "login.html"; // 로그인 페이지로 이동
    });
  }

  // 로그인 기능
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 새로고침 방지

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // 저장된 유저 데이터 가져오기
      let users = JSON.parse(localStorage.getItem("users")) || [];
      console.log("로그인 시도 - 저장된 users:", users); // ✅ 디버깅 콘솔 추가

      // 입력한 정보와 일치하는 유저 찾기
      let validUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (validUser) {
        alert("로그인 성공!");
        // ✅ 로그인 정보 저장 (currentUser → loggedInUser 수정!)
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        console.log(
          "로그인 후 loggedInUser:",
          localStorage.getItem("loggedInUser")
        ); // ✅ 디버깅 콘솔 추가

        window.location.href = "main.html"; // 로그인 성공 시 메인 페이지로 이동
      } else {
        alert("이메일 또는 비밀번호가 틀렸습니다.");
      }
    });
  }

  // // 🔹 Firebase 프로젝트 설정 정보
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAKFubZGdzxgqXY_PVZp-MyvYjbSAHY3fM",
  //   authDomain: "medic.firebaseapp.com",
  //   projectId: "medic",
  //   storageBucket: "medic.appspot.com",
  //   messagingSenderId: "medic",
  //   appId: "medic",
  // };

  // // 🔹 Firebase 초기화
  // firebase.initializeApp(firebaseConfig);
  // const auth = firebase.auth();

  // 📌 이메일 인증 코드 전송
  document.getElementById("send-code").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    if (!email) return alert("이메일을 입력하세요!");

    try {
      await auth.sendSignInLinkToEmail(email, {
        url: "http://localhost:5500/signup.html", // 인증 후 이동할 페이지
        handleCodeInApp: true,
      });

      // 🔹 로컬 스토리지에 이메일 저장 (로그인 시 사용)
      window.localStorage.setItem("emailForSignIn", email);

      alert("이이메일로 인증 링크를 보냈습니다! 인증 후 다시 로그인하세요.");
    } catch (error) {
      alert("이메일 전송 실패: " + error.message);
    }
  });

  // 📌 인증 확인 후 회원가입 처리
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    let email = window.prompt("가입 시 입력한 이메일을 입력하세요:");
    auth
      .signInWithEmailLink(email, window.location.href)
      .then(() => {
        alert("이메일 인증 완료!");
      })
      .catch((error) => alert("인증 실패: " + error.message));
  }
  // 📌 인증 링크에서 회원가입 처리
  document.addEventListener("DOMContentLoaded", function () {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        email = window.prompt("가입 시 입력한 이메일을 입력하세요:");
      }

      auth
        .signInWithEmailLink(email, window.location.href)
        .then(() => {
          alert("이메일 인증 완료! 이제 회원가입을 진행하세요.");
          window.localStorage.removeItem("emailForSignIn"); // 인증 후 삭제
        })
        .catch((error) => alert("인증 실패: " + error.message));
    }
  });
});
