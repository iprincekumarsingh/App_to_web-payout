import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Pay from "./pages/Pay";
import Test from "./pages/Test";
import App from "./App";
import UpgradePage from "./pages/UpgradePage";
import OneTimePay from "./pages/OneTimePay";
import "./index.css"
import Login from "./Login";
import DeleteAcccount from "./pages/DeleteAcccount";

const router = createBrowserRouter([
  {
    path: '/',
    element: 'Something Went Wrong'
  },
  {
    path: "/pay",
    element: <Pay />,
  },
  {
    path: '/oneTimePayment',
    element: <OneTimePay />

  },
  {
    path: "/pay/success",
    element: (
      <>
        <h1>Payment Success</h1>
      </>
    ),
  },
  {
    path: "/test",
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: "/upgrade/plan",
    element: <UpgradePage />,
  }, {
    path: '/delete/account',
    element: <DeleteAcccount />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
