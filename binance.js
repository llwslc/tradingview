const fs = require('fs/promises');
const axios = require('axios');

const BINANCE_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const BINANCE_LIST_PATH = 'Binance.txt';

const main = async () => {
  try {
    await fs.access(BINANCE_LIST_PATH);
    await fs.unlink(BINANCE_LIST_PATH);
  } catch {}

  try {
    const { data } = await axios.get(BINANCE_URL);

    let listStr = '';
    data.forEach(({ symbol, firstId }) => {
      if (firstId === -1) return;
      if (/UPUSDT$/.test(symbol)) return;
      if (/DOWNUSDT$/.test(symbol)) return;

      if (/USDT$/.test(symbol)) {
        listStr += `BINANCE:${symbol}\n`;
      }
    });

    fs.writeFile(BINANCE_LIST_PATH, listStr, 'utf-8');
  } catch (error) {
    console.log(error);
  }
};

main();
