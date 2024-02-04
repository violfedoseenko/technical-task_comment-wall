import React from "react";
import ReactDOM from "react-dom/client";
import useMockAdapter from "src/api/useMockAdapter";
import "./index.scss";
import App from "./App";
import { StoreProvider } from "./store/StoreProvider";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

const RootApp = () => {
    useMockAdapter();

    return (
        <StoreProvider>
            <App />
        </StoreProvider>
    );
};

root.render(
    <React.StrictMode>
        <RootApp />,
    </React.StrictMode>,
);
