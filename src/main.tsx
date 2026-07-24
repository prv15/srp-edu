import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./theme/index.css";
import { InstituteProvider } from "./contexts/InstituteContext";
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
       <InstituteProvider>

    <App />

</InstituteProvider>
    </React.StrictMode>
);