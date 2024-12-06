const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// ミドルウェア（JSONリクエスト対応）
app.use(express.json());

// エンドポイント：リクエスト送信API
app.post('/send-requests', (req, res) => {
  const { targetUrl, duration = 300, interval = 100 } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  const durationMs = duration * 1000; // 実行時間（ミリ秒）
  const startTime = Date.now();
  let requestCount = 0;

  console.log(`Starting to send requests to ${targetUrl} for ${duration} seconds.`);

  const sendRequest = async () => {
    try {
      const response = await axios.get(targetUrl);
      console.log(`Response: ${response.status}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    } finally {
      requestCount++;
    }
  };

  const intervalId = setInterval(() => {
    if (Date.now() - startTime >= durationMs) {
      clearInterval(intervalId);
      console.log('Finished sending requests.');
      res.json({ message: 'Requests completed', totalRequests: requestCount });
      return;
    }
    sendRequest();
  }, interval);
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
