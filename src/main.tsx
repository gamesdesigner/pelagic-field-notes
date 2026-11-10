import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import AccountGate from "../app/AccountGate";
import "../app/globals.css";

// Public library/about/sign-in pages do not need the lesson engine or 3D labs.
const Home = lazy(() => import("../app/page"));

const root = document.getElementById("root");

if (!root) throw new Error("Missing application root");

createRoot(root).render(
  <StrictMode>
    <AccountGate><Suspense fallback={<div className="site-shell" role="status">Loading your ocean lessons…</div>}><Home /></Suspense></AccountGate>
  </StrictMode>,
);
