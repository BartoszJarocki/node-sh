const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Company } = require('./models/company');

const port = process.env.PORT || 3000;

const app = express();
app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

app.post('/companies', (req, res) => {
  let newCompany = new Company({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  newCompany.save().then((company) => {
    res.status(201).send(company);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/companies', (req, res) => {
  Company.find().then((companies) => {
    res.status(200).send({ companies });
  }).catch((e) => res.status(404).send())
});

app.get('/companies/:id', (req, res) => {
  let companyId = req.params.id;

  Company.findById(companyId).then((company) => {
    if (!company) {
      res.status(404).send();
    }

    res.status(200).send({ company });
  }).catch((e) => res.status(400).send())
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

process.on('exit', () => {
  console.log('Closing database connection.');
  mongoose.disconnect();
});

module.exports = { app };
