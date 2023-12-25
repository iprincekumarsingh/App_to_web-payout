import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Pay from "./pages/Pay";
import Test from "./pages/Test";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Pay />,
  },
  {
    path: "/pay/success",
    element: <h1>Hello</h1>,
  }, {
    path: "/test",
    element: <App />,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
