const fs = require('fs/promises');
const axios = require('axios');
const pass = require('./pass');

const BINANCE_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const LIST_PATH = './list';
const BINANCE_LIST_PATH = `${LIST_PATH}/Binance.txt`;

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
    data.forEach(({ symbol, firstId, closeTime }) => {
      if (firstId === -1) return;
      if (/UPUSDT$/.test(symbol)) return;
      if (/DOWNUSDT$/.test(symbol)) return;
      if (pass.filter(_ => symbol.startsWith(_)).length) return;

      if (/USDT$/.test(symbol)) {
        if ((symbol.match(/USD/g) || []).length === 2) return;
        if (Date.now() - closeTime > 24 * 60 * 60 * 1000) return;
        listStr += `BINANCE:${symbol}\n`;
      }
    });

    fs.writeFile(BINANCE_LIST_PATH, listStr, 'utf-8');
  } catch (error) {
    console.log(error);
  }
};

main();
