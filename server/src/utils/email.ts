// Use dynamic import for node-fetch to avoid ESM issues
let fetch: any;

// Initialize fetch function
async function initFetch() {
  if (!fetch) {
    const nodeFetch = await import('node-fetch');
    fetch = nodeFetch.default;
  }
  return fetch;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const apiKey = process.env['RESEND_API_KEY'];
  const fromEmail = process.env['FROM_EMAIL'] || 'contact@nanocode.online';
  if (!apiKey) throw new Error('Resend API key not set');
  // Placeholder: Use Resend API directly
  const fetchFn = await initFetch();
  const res = await fetchFn('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: 'Welcome to nanoLearning!',
      html: `<h1>Welcome, ${name}!</h1><p>Thanks for signing up for nanoLearning.</p>`,
    }),
  });
  if (!res.ok) throw new Error('Failed to send email');
  return true;
}

export async function sendPasswordResetEmail(
  email: string,
  resetCode: string,
  name: string
) {
  const apiKey = process.env['RESEND_API_KEY'];
  const fromEmail = process.env['FROM_EMAIL'] || 'contact@nanocode.online';
  if (!apiKey) throw new Error('Resend API key not set');

  const fetchFn = await initFetch();
  const res = await fetchFn('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: 'Password Reset Code - nanoLearning',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Password Reset Request</h1>
          <p>Hello ${name},</p>
          <p>You requested a password reset for your nanoLearning account.</p>
          <p>Your password reset code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${resetCode}</h2>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The nanoLearning Team</p>
        </div>
      `,
    }),
  });
  if (!res.ok) throw new Error('Failed to send email');
  return true;
}
