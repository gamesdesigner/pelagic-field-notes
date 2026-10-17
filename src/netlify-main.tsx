import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import AccountGate from "../app/AccountGate";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) throw new Error("Missing application root");

createRoot(root).render(
  <StrictMode>
    <AccountGate><Home /></AccountGate>
  </StrictMode>,
);
