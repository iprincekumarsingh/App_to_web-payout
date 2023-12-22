import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Pay from "./pages/Pay";
import Test from "./pages/Test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Pay />,
  },
  {
    path: "/pay/success",
    element: <Pay />,
  }, {
    path: "/test",
    element: <Test />,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
