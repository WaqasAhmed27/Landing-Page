export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { businessName, email, city, posSoftware, source = 'website' } = body;
    const resendApiKey = context.env.RESEND_API_KEY;

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'A valid email address is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return new Response(JSON.stringify({ success: false, error: 'Please provide a valid email format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const submittedAt = new Date().toISOString();
    const database = context.env.taptile_waitlist;
    if (!database) {
      console.error('Waitlist database binding is not configured.');
      return new Response(JSON.stringify({
        success: false,
        error: 'Waitlist service is temporarily unavailable.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const submission = await database.prepare(`
      INSERT INTO waitlist_submissions
        (email, business_name, city, pos_software, source, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      cleanEmail,
      typeof businessName === 'string' ? businessName.trim() || null : null,
      typeof city === 'string' ? city.trim() || null : null,
      typeof posSoftware === 'string' ? posSoftware.trim() || null : null,
      typeof source === 'string' ? source.trim() || 'website' : 'website',
      submittedAt
    ).run();

    const submissionId = submission.meta.last_row_id;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured in Cloudflare environment.');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Waitlist signup recorded. Email notification is temporarily unavailable.',
        submissionId,
        email: cleanEmail 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const isLaunchHeroSignup = !businessName || source === 'hero_waitlist';
    const subject = isLaunchHeroSignup
      ? `🚀 New Launch Notification Signup: ${cleanEmail}`
      : `📋 New Merchant POS Waitlist: ${businessName} (${cleanEmail})`;

    const htmlContent = isLaunchHeroSignup
      ? `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 2px solid #111; border-radius: 8px;">
          <h2 style="color: #111; margin-top: 0;">🚀 New Launch Notification Waitlist</h2>
          <p>A new user requested to be notified when TapTile launches in Pakistan.</p>
          <hr style="border: 1px solid #eee; margin: 16px 0;" />
          <p><strong>Email Address:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
          <p><strong>Signup Source:</strong> Hero Section Email Field</p>
          <p><strong>Timestamp:</strong> ${new Date().toUTCString()}</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 2px solid #111; border-radius: 8px;">
          <h2 style="color: #111; margin-top: 0;">📋 New Merchant POS Compatibility Request</h2>
          <p>A business submitted their details for POS compatibility & onboarding.</p>
          <hr style="border: 1px solid #eee; margin: 16px 0;" />
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
          <p><strong>City:</strong> ${city || 'Not provided'}</p>
          <p><strong>POS Software:</strong> ${posSoftware || 'Not provided'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toUTCString()}</p>
        </div>
      `;

    const teamResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TapTile Waitlist <onboarding@resend.dev>', // Replace with verified custom domain in production
        to: ['taptilepk@gmail.com'],
        reply_to: cleanEmail,
        subject: subject,
        html: htmlContent
      })
    });

    if (!teamResponse.ok) {
      const errorData = await teamResponse.json().catch(() => ({}));
      console.error('Resend API error:', errorData);
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    await database.prepare(`
      UPDATE waitlist_submissions
      SET email_status = 'sent'
      WHERE id = ?
    `).bind(submissionId).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully added to waitlist.',
      submissionId,
      email: cleanEmail
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process waitlist request. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
