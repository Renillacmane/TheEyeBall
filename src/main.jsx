import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider,} from "react-router-dom";

import "./index.css";
//import App from './App.jsx'
import SignUp from './layouts/sign-up/SignUp.jsx'
import SignIn from './layouts/sign-in/SignIn.jsx';
import UpcomingMovies from './layouts/upcomingMovies/UpcomingMovies.jsx'

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <SignIn/>,
  },
  {
    path: "/",
    element: <SignUp/>,
  },
  {
    path: "/upcoming",
    element: <UpcomingMovies/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
