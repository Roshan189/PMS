import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";
import { App } from "./App.jsx";
import User from "./masters/User.jsx";
import Zone from "./masters/Zone.jsx";
import Circle from "./masters/Circle.jsx";
import Division from "./masters/Division.jsx";
import Designation from "./masters/Designation.jsx";
import Authority from "./masters/Authority.jsx";
import Hindrance from "./masters/Hindrance.jsx";
import ProjectType from "./masters/ProjectType.jsx";
import Status from "./masters/Status.jsx";
import NotFound from "./masters/NotFound.jsx";
import Login from "./reports/Login.jsx";
import History from "./reports/History.jsx";
import AuditTrail from "./reports/AuditTrail.jsx";
import LayoutWrapper from "./component/LayoutWrapper.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWrapper />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/admin/user",
        element: <User />,
      },
      {
        path: "/admin/zone",
        element: <Zone />,
      },
      {
        path: "/admin/circle",
        element: <Circle />,
      },
      {
        path: "/admin/division",
        element: <Division />,
      },
      {
        path: "/admin/designation",
        element: <Designation />,
      },
      {
        path: "/admin/authority",
        element: <Authority />,
      },
      {
        path: "/admin/hindrance",
        element: <Hindrance />,
      },
      {
        path: "/admin/projecttype",
        element: <ProjectType />,
      },
      {
        path: "/admin/status",
        element: <Status />,
      },
      {
        path: "/admin/report/login",
        element: <Login />,
      },
      {
        path: "/admin/report/history",
        element: <History />,
      },
      {
        path: "/admin/report/audittrail",
        element: <AuditTrail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
