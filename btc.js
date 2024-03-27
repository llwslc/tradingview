const fs = require('fs/promises');
const axios = require('axios');

const BINANCE_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const LIST_PATH = './list';
const BINANCE_LIST_PATH = `${LIST_PATH}/BTC.txt`;

const main = async () => {
  try {
    try {
      await access(LIST_PATH);
    } catch (error) {
      await fs.mkdir(LIST_PATH);
    }
    await fs.access(BINANCE_LIST_PATH);
    await fs.unlink(BINANCE_LIST_PATH);
  } catch {}

  try {
    const { data } = await axios.get(BINANCE_URL);

    let listStr = '';
    data.forEach(({ symbol, firstId }) => {
      if (firstId === -1) return;

      if (/BTC$/.test(symbol)) {
        listStr += `BINANCE:${symbol}\n`;
      }
    });

    fs.writeFile(BINANCE_LIST_PATH, listStr, 'utf-8');
  } catch (error) {
    console.log(error);
  }
};

main();
