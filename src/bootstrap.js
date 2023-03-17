import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/utils/errorBoundry/ErrorBoundaryFallBackPage";
// import "./assets/scss/main.scss";

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter basename="/mcp">
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <App />
    </ErrorBoundary>
  </BrowserRouter>
);
