'use strict';

module.exports = function (app) {

  const axios = require('axios');
  const crypto = require('crypto');
  // In-memory store for likes
  const stockLikes = {};

  function anonymizeIP(ip) {
    // Hash the IP address for privacy
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  async function getStockData(symbol) {
    try {
      const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
      const response = await axios.get(url);
      if (response.data?.symbol) {
        return {
          stock: response.data.symbol,
          price: response.data.latestPrice
        };
      }
      return null;
    } catch (err) {
      console.error(`Error fetching stock data for symbol "${symbol}":`, err.message);
      return null;
    }
  }

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let { stock, like } = req.query;
      if (!stock) return res.status(400).json({ error: 'Stock symbol required' });
      const ip = anonymizeIP(req.ip);
      let stocks = Array.isArray(stock) ? stock : [stock];
      stocks = stocks.map(s => s.toUpperCase());

      let results = [];
      for (let s of stocks) {
        if (!stockLikes[s]) {
          stockLikes[s] = { likes: 0, ips: new Set() };
        }
        if (like === 'true' && !stockLikes[s].ips.has(ip)) {
          stockLikes[s].likes++;
          stockLikes[s].ips.add(ip);
        }
        const data = await getStockData(s);
        if (!data) {
          return res.status(404).json({ error: `Stock ${s} not found` });
        }
        results.push({
          stock: data.stock,
          price: data.price,
          likes: stockLikes[s].likes
        });
      }

      if (results.length === 1) {
        return res.json({ stockData: results[0] });
      } else {
        // Calculate relative likes
        results[0].rel_likes = results[0].likes - results[1].likes;
        results[1].rel_likes = results[1].likes - results[0].likes;
        return res.json({ stockData: results });
      }
    });
    
};
