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
import Home from "./Home";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
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
      <div className="flex items-center justify-center min-h-screen bg-green-100">
        <div className="bg-white p-6 md:p-8 rounded-lg max-w-sm mx-4 md:mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Thank you for your payment. Your transaction was completed successfully.</p>
        </div>
      </div>
    ),
  },
  {
    path: "/pay/failed",
    element: (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="bg-white p-6 md:p-8 rounded-lg max-w-sm mx-4 md:mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">Payment Failed</h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Unfortunately, your transaction could not be completed. Please try again later.</p>
        </div>
      </div>
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
