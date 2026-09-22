const N8N_ASSESSMENT_WEBHOOK_URL = process.env.N8N_ASSESSMENT_WEBHOOK_URL;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed'
    });
  }

  if (!N8N_ASSESSMENT_WEBHOOK_URL) {
    console.error('Missing N8N_ASSESSMENT_WEBHOOK_URL environment variable');
    return res.status(500).json({
      ok: false,
      message: 'Unable to submit your assessment right now.'
    });
  }

  try {
    const { answers = {}, submitted_at = '', source = 'public_assessment' } = req.body || {};

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Please complete the assessment before submitting.'
      });
    }

    const email = String(answers.email || '').trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!answers.company_name || !answers.contact_name || !emailPattern.test(email)) {
      return res.status(400).json({
        ok: false,
        message: 'Please complete your business, name and a valid work email.'
      });
    }

    const payload = {
      source,
      submitted_at: submitted_at || new Date().toISOString(),
      answers
    };

    const response = await fetch(N8N_ASSESSMENT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('n8n assessment webhook error:', response.status, detail);

      return res.status(502).json({
        ok: false,
        message: 'Unable to submit your assessment right now.'
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Public assessment error:', error);

    return res.status(500).json({
      ok: false,
      message: 'Unable to submit your assessment right now.'
    });
  }
};
