document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 새로고침 방지

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

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
});
