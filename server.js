const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    ip: req.ips,
    ua: req.headers['user-agent'],
    host: req.hostname,
    protocol: req.protocol,
    headers: req.headers,
  });
})

app.use(require('./handler'))

app.listen(process.env.PORT || 5000, () => {
  console.info(`Server is running on port ${process.env.PORT || 5000}`);
})