import {StrictMode} from 'react';
import {prerender} from 'react-dom/static';
import App from './App.tsx';

// Build-time only: scripts/prerender.mjs calls this to bake the homepage markup
// into dist/index.html. prerender() waits for the lazy LandingPage chunk, so the
// output is the real page inside a Suspense boundary that hydrateRoot can pick up.
export async function render(): Promise<string> {
  const {prelude} = await prerender(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return new Response(prelude).text();
}
