import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import Home from "./comp/pages/home.jsx";
import Transactions from "./comp/pages/transactions.jsx";
import Budgets from "./comp/pages/budgets.jsx";
import Pots from "./comp/pages/pots.jsx";
import Recurring from "./comp/pages/recurring.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/transactions",
    element: <Transactions />
  },
  {
    path: "/budgets",
    element: <Budgets />
  },
  {
    path: "/pots",
    element: <Pots />
  },
  {
    path: "/recurring",
    element: <Recurring />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);