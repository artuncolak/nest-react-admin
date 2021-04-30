import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthenticationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
