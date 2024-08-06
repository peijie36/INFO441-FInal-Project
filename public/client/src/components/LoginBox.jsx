import { statusCheck } from "../../scripts/utils";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import "../stylesheets/styles.css"
import { useState } from "react";
const cookies = new Cookies();

const LoginBox = () => {
  const [loginVisible, setLoginVisible] = useState(true);

  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "#00000080"}}>
      {loginVisible ? <LoginForm setLoginVisible={setLoginVisible}/> : <RegisterForm setLoginVisible={setLoginVisible}/>}
    </div>
  );
};

const RegisterForm = ({ setLoginVisible }) => {
  const navigate = useNavigate();

  return (
    <form id="register-form"
      className="d-flex flex-column align-items-center justify-content-center p-5 bg-light rounded"
    onSubmit={async (e) => {
      e.preventDefault();
      await register();
      navigate(0);
    }} >
      <input type="text" className="form-control my-2" name="email" placeholder="email" />
      <input type="password" className="form-control my-2" name="pass" placeholder="pass" />
      <button className="btn main-btn">Register</button>
      <p onClick={() => setLoginVisible(true)}><small>Already have an account?  Sign in!</small></p>
    </form>
  )
}

const LoginForm = ({ setLoginVisible }) => {
  const navigate = useNavigate();

  return (
    <form id="login-form"
      className="d-flex flex-column align-items-center justify-content-center p-5 bg-light rounded"
    onSubmit={async (e) => {
      e.preventDefault();
      await login(e);
      navigate(0);
    }} >
      <input type="text" className="form-control my-2" name="email" placeholder="email" />
      <input type="password" className="form-control my-2" name="pass" placeholder="pass" />
      <button className="btn main-btn">Log In</button>
      <p onClick={() => setLoginVisible(false)}><small>Don't have an account? Sign up!</small></p>
    </form>
  )
}

async function register(e) {
  try {
      let params = new FormData(document.getElementById("register-form"));
      console.log(params);
      let res = await fetch("/api/v1/auth/register", {
          method: "POST",
          body: params
      });

      await statusCheck(res);
      cookies.set('fit-loggedin', true, { path: '/' });
  } catch (err) {
      console.error(err);
  }
}

async function login() {
  try {
      let params = new FormData(document.getElementById("login-form"));
      let res = await fetch("/api/v1/auth/login", {
          method: "POST",
          body: params
      });

      await statusCheck(res);
      cookies.set('fit-loggedin', true, { path: '/' });
  } catch (err) {
      console.error(err);
  }
}

export default LoginBox;