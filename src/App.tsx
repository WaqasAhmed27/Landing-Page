import React, { Suspense, lazy } from "react";
import PageLoader from "./components/PageLoader";

// Full product landing page (ACT-05: activated for SEO — replaces ComingSoon)
const LandingPage = lazy(() => import("./components/LandingPage"));

// ComingSoon page preserved and accessible during development:
// const ComingSoon = lazy(() => import("./components/ComingSoon"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingPage />
    </Suspense>
  );
}
