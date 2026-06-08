export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GOATPAY_KEY = process.env.GOATPAY_KEY || 'gp_live_96aa3847912f44423b60e4089abc59a8ac1019e72bd46b90';
  const GOATPAY_URL = 'https://api.goatpay.com.br/v1';

  try {
    if (req.method === 'POST') {
      // Criar PIX
      const { amount, description, external_id } = req.body;
      const response = await fetch(`${GOATPAY_URL}/payment-pix/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOATPAY_KEY}`
        },
        body: JSON.stringify({ amount, description, external_id })
      });
      const data = await response.json();
      return res.status(200).json(data);

    } else if (req.method === 'GET') {
      // Verificar status do PIX
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID required' });
      const response = await fetch(`${GOATPAY_URL}/payment-pix/${id}`, {
        headers: { 'Authorization': `Bearer ${GOATPAY_KEY}` }
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
