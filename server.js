const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res, next) => {
  app.render('index.html');
})

app.listen(port, () => {
  console.log(`app up and running at localhost:${port}`);
})