import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Self-hosted IBM Plex — the exact type pairing opencode.ai ships.
   Self-hosting keeps the site offline-capable and free of third-party calls. */
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./index.css";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Could not find the #root container to mount the app into.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);