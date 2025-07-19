import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "@/styles/index.css";
import store from "./store";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { StarknetProvider } from "./config/Catridge";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetProvider>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </StarknetProvider>
  </StrictMode>
);
