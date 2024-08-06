import AppLogo from '../assets/logo.png';
import HeaderBar from './HeaderBar';

import "../stylesheets/styles.css";
import LoginBox from './LoginBox';
import { useState } from 'react';

function Auth() {
  const [loginBoxActive, setLoginBoxActive] = useState(false);
  console.log(loginBoxActive);
  return (
    <div id="root" className="d-flex justify-content-center">
      <div className="body">
        <HeaderBar showLoginBox={setLoginBoxActive} />
        <div style={(loginBoxActive ? {} : {display: 'none'})}>
          <LoginBox />
        </div>
        <div id="landing" className="d-flex justify-content-center">
          <div>
            <div className="py-5 w-100">
              <img className="logo" src={AppLogo} alt="person opening fridge" />
            </div>
  
            <div className="d-flex justify-content-center">
              <h2>Welcome to FitT</h2>
            </div>
            <div className="d-flex justify-content-center">
              <h2>Log in to see inventory</h2>
            </div>
          </div>          
        </div>
      </div>      
    </div>
  )
}

export default Auth;
