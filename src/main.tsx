import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./theme/index.css";
import { InstituteProvider } from "./contexts/InstituteContext";
import { AuthProvider } from "./providers/AuthProvider";
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <InstituteProvider>
                <App />
            </InstituteProvider>
        </AuthProvider>
    </React.StrictMode>
);
