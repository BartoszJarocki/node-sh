const express = require('express');
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Company } = require('./models/company')

const port = process.env.PORT || 3000;

const app = express();
app.use('/static', express.static('public'));
app.use(bodyParser.json())
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

app.post('/companies', (req, res) => {
  console.log(req.body);

  let company = new Company({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  company.save().then((doc) => {
    res.status(201).send(doc);
  }, (err) => {
    res.status(404).send(err);
  });
})
app.get('/', (req, res) => {
  res.send('Hello World!');
});

process.on('exit', () => {
  console.log('Closing database connection.');
  mongoose.disconnect();
});
