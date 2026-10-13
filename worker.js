import { onRequestPost as handleWaitlistPost } from "./functions/api/waitlist.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/waitlist" && request.method === "POST") {
      return handleWaitlistPost({ request, env, ctx });
    }

    return env.ASSETS.fetch(request);
  },
};
