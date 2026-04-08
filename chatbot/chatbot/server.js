const express = require('express');
const cors = require('cors');
// Removed OpenAI import - no API key needed!
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Chat endpoint - No API key required!
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'Message is required' });
  }

  // Simple rule-based responses (no AI needed!)
  const msg = message.toLowerCase();
  let reply = '';

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    reply = 'Hello! How can I help you with customer support today?';
  }
  else if (msg.includes('network') || msg.includes('internet') || msg.includes('connection')) {
    reply = 'For network issues, try restarting your router, checking cables, or contacting your ISP. Let me know if you need more specific help!';
  }
  else if (msg.includes('login') || msg.includes('password') || msg.includes('sign in')) {
    reply = 'For login issues, please reset your password using the "Forgot Password" link or verify your email/username. Need help with that?';
  }
  else if (msg.includes('payment') || msg.includes('billing') || msg.includes('charge')) {
    reply = 'For payment concerns, check your bank statement or try a different payment method. If you need to dispute a charge, please contact our billing department.';
  }
  else if (msg.includes('order') || msg.includes('tracking') || msg.includes('delivery')) {
    reply = 'You can track your order status in the "My Orders" section of your account. If you have the order number, I can help you look it up!';
  }
  else if (msg.includes('refund') || msg.includes('return')) {
    reply = 'For refunds or returns, please visit our returns page or contact our support team with your order details. We\'ll be happy to assist!';
  }
  else if (msg.includes('technical') || msg.includes('error') || msg.includes('bug')) {
    reply = 'For technical issues, try clearing your cache, updating your browser, or restarting the app. If the problem persists, please provide more details.';
  }
  else if (msg.includes('thank') || msg.includes('thanks')) {
    reply = 'You\'re welcome! Is there anything else I can help you with today?';
  }
  else if (msg.includes('bye') || msg.includes('goodbye')) {
    reply = 'Goodbye! Have a great day. Feel free to come back if you need more help.';
  }
  else {
    reply = 'I\'m here to help with common customer support questions. Could you please provide more details about your issue? For example: login problems, orders, payments, or technical issues.';
  }

  return res.json({ reply });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('🚀 No API key required - using rule-based responses!');
});