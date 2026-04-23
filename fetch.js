const https = require('https');
https.get('https://liberte-salon.net/shop/', (res) => {
  let d = '';
  res.on('data', (c) => d += c);
  res.on('end', () => {
    require('fs').writeFileSync('shop.html', d);
  });
});
