const fs = require('fs/promises');
const axios = require('axios');

const BINANCE_URL = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
const LIST_PATH = './list';
const BINANCE_LIST_PATH = `${LIST_PATH}/Future.txt`;

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
    const {
      data: { symbols },
    } = await axios.get(BINANCE_URL);

    let listStr = '';
    symbols.forEach(({ pair, quoteAsset }) => {
      if (/USDT$/.test(quoteAsset)) {
        listStr += `BINANCE:${pair}.P\n`;
      }
    });

    fs.writeFile(BINANCE_LIST_PATH, listStr, 'utf-8');
  } catch (error) {
    console.log(error);
  }
};

main();
