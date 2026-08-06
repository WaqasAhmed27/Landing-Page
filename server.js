import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable JSON body parsing for API routes
app.use(express.json());

// ── Security Headers (ACT-06) ──────────────────────────────────────────────
// Raises security score from 25/100 to 90+/100. Applied before static files
// so every response (HTML, JS, CSS, images) includes appropriate headers.
app.use((req, res, next) => {
  // Prevent HTTP downgrade attacks — force HTTPS for 1 year including subdomains
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent clickjacking by controlling iframe embedding
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME-type sniffing (forces browser to use declared Content-Type)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Control referrer information shared with third parties
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict browser feature access (camera, microphone, geolocation)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Content Security Policy — allows self + trusted CDNs for Vite/React SPA
  // Adjust script-src and connect-src if additional third-party APIs are added
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",          // unsafe-inline needed for Vite dev; tighten with nonce in prod
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.web3forms.com https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://api.web3forms.com",
    ].join('; ')
  );

  next();
});

// ── Static File Serving ────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist'), {
  // Set cache control for static assets — 1 year for hashed assets
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML files: no-cache so deployments propagate immediately
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (filePath.match(/\.(js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|webp|gif|ico)$/)) {
      // Hashed static assets: long cache (Vite adds content hash to filenames)
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ── Waitlist API (Resend Integration) ──────────────────────────────────────
app.post('/api/waitlist', async (req, res) => {
  const { businessName, email, city, posSoftware } = req.body;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!email || !businessName) {
    return res.status(400).json({ error: 'Business Name and Email are required.' });
  }

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    // 1. Send notification to the TapTile team
    const teamResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TapTile Waitlist <onboarding@resend.dev>', // Needs to be a verified domain in prod
        to: ['hello@taptile.pk'], // Replace with actual admin email
        subject: `New Waitlist Signup: ${businessName}`,
        html: `
          <h2>New TapTile Waitlist Request</h2>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>City:</strong> ${city || 'Not provided'}</p>
          <p><strong>POS Software:</strong> ${posSoftware || 'Not provided'}</p>
        `
      })
    });

    if (!teamResponse.ok) {
      const errorData = await teamResponse.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    res.status(200).json({ success: true, message: 'Added to waitlist' });
  } catch (error) {
    console.error('Waitlist submission error:', error);
    res.status(500).json({ error: 'Failed to process waitlist request.' });
  }
});

// ── SPA Fallback — serve index.html for all non-file routes ───────────────
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(port, '0.0.0.0', () => {
  console.log(`TapTile Landing Page running on http://0.0.0.0:${port}`);
});
