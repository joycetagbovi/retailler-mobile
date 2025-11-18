
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker, requestPersistentStorage } from "./utils/pwaRegister";

// Register service worker for PWA functionality
registerServiceWorker();

// Request persistent storage for offline data
requestPersistentStorage();

createRoot(document.getElementById("root")!).render(<App />);
  