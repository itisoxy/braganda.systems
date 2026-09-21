const N8N_WEBHOOK_URL =
  'https://n8ns2l.braganda.systems/webhook/432284bf-6972-4112-9f67-0682bb58f502';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed'
    });
  }

  try {
    const {
      first_name = '',
      last_name = '',
      email = '',
      company = '',
      interest = '',
      message = '',
      website = ''
    } = req.body || {};

    // Honeypot spam protection
    if (website) {
      return res.status(200).json({ ok: true });
    }

    const firstName = String(first_name).trim();
    const lastName = String(last_name).trim();
    const businessEmail = String(email).trim();

    if (!firstName || !lastName || !businessEmail) {
      return res.status(400).json({
        ok: false,
        message: 'Please complete your name and business email.'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(businessEmail)) {
      return res.status(400).json({
        ok: false,
        message: 'Please enter a valid email address.'
      });
    }

    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      email: businessEmail,
      company: String(company).trim(),
      job_title: '',
      company_size: null,
      interest: String(interest).trim(),
      message: String(message).trim(),
      source: 'Website'
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('n8n webhook error:', response.status, detail);

      return res.status(502).json({
        ok: false,
        message: 'Unable to submit your enquiry right now.'
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      ok: false,
      message: 'Unable to submit your enquiry right now.'
    });
  }
};
