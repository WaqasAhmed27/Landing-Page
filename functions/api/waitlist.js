export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { businessName, email, city, posSoftware } = body;
    const resendApiKey = context.env.RESEND_API_KEY;

    if (!email || !businessName) {
      return new Response(JSON.stringify({ error: 'Business Name and Email are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: missing RESEND_API_KEY.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const teamResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TapTile Waitlist <onboarding@resend.dev>', // Needs to be a verified domain in prod
        to: ['taptilepk@gmail.com'], // Sandbox accounts must send to their verified email
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

    return new Response(JSON.stringify({ success: true, message: 'Added to waitlist' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process waitlist request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
