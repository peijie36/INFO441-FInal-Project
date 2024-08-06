import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { statusCheck } from "../../scripts/utils";
const cookies = new Cookies();

const BASE_URL = "http://localhost:3000"

const HeaderBar = ({ showLoginBox }) => {
    const [loggedIn, setLoggedIn] = useState(cookies.get('fit-loggedin'));
    
    return (
        <div id="login" className="d-flex align-items-center">
            <div className="p-2 d-flex justify-content-between flex-fill">
            <div id="username" className="d-flex align-items-center">
                <h1 className="m-0 px-2">FitT</h1>
            </div>
            <div className="d-flex">
                {
                    (loggedIn ? <LogoutButton setLoggedIn={setLoggedIn} /> : <LoginButton showLoginBox={showLoginBox} callback={setLoggedIn} /> )
                }
            </div>
            </div>
        </div>
    )
};

const LoginButton = ({showLoginBox }) => {
    return (
        <button className="btn main-button m-2" onClick={() => {
            showLoginBox(document.getElementById("login-form").parentElement.parentElement.style.display === "none");
        }}>Log In</button>
    )
}

const LogoutButton = ({setLoggedIn}) => {
    const navigate = useNavigate();

    return (
        <button className="btn secondary-button m-2" onClick={async () => {
            await logout();
            cookies.remove('fit-loggedin');
            navigate(0);
        }}>Log Out</button>
    )
}

async function logout() {
    try {
        let res = await fetch("/api/v1/auth/logout", {method: "POST"});
        await statusCheck(res);
    } catch (err) {
        console.error(err);
    }
}

export default HeaderBar;