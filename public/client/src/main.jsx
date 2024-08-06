import React from 'react'
import ReactDOM from 'react-dom/client'
import Cookies from 'universal-cookie';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const cookies = new Cookies();

import Auth from './components/Auth';
import HeaderBar from './components/HeaderBar';
import LandingPage from './components/LandingPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (cookies.get('fit-loggedin') ? <LandingPage /> : <Auth />),
  },
  // {
  //   path: "*",
  //   element: <div>Error: That page wasn't found</div>
  // }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
