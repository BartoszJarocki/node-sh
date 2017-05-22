const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Company } = require('./models/company');

const port = process.env.PORT || 3000;

const app = express();
app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

app.post('/api/v1/companies', (req, res) => {
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

app.get('/api/v1/companies', (req, res) => {
  Company.find().then((companies) => {
    res.status(200).send({ companies });
  }).catch((e) => res.status(404).send())
});

app.get('/api/v1/companies/:id', (req, res) => {
  let companyId = req.params.id;

  if (!ObjectID.isValid(companyId)) {
    return res.status(400).send();
  }

  Company.findById(companyId).then((company) => {
    if (!company) {
      res.status(404).send();
    }

    res.status(200).send({ company });
  }).catch((e) => res.status(400).send())
});

app.delete('/api/v1/companies/:id', (req, res) => {
  let companyId = req.params.id;

  if (!ObjectID.isValid(companyId)) {
    return res.status(400).send();
  }

  Company.findByIdAndRemove(companyId).then((company) => {
    if (!company) {
      res.status(404).send();
    }

    res.status(200).send({ company });
  }).catch((e) => res.status(400).send())
});

app.patch('/api/v1/companies/:id', (req, res) => {
  let companyId = req.params.id;

  if (!ObjectID.isValid(companyId)) {
    return res.status(400).send();
  }

  let body = _.pick(req.body, ['name', 'description', 'url']);
  
  Company.findByIdAndUpdate(companyId, { $set: body }, { new: true }).then((company) => {
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
