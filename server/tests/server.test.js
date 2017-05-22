const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server')
const { Company } = require('./../models/company');

const testCompanies = [
  {
    _id: new ObjectID(),
    name: "test",
    description: "test desc",
    url: "test url"
  }, {
    _id: new ObjectID(),
    name: "test1",
    description: "test desc1",
    url: "test url1"
  }, {
    _id: new ObjectID(),
    name: "test2",
    description: "test desc2",
    url: "test url2"
  }, {
    _id: new ObjectID(),
    name: "test3",
    description: "test desc3",
    url: "test url3"
  }
]

beforeEach((done) => {
  Company.remove({}).then(() => {
    return Company.insertMany(testCompanies);
  }).then(() => done());
});

describe('POST /companies', () => {
  it('should create a new company', (done) => {
    let name = 'Test name';
    let description = 'Test desc';
    let url = 'Test url';

    request(app)
      .post('/companies')
      .send({ name, description, url })
      .expect(201)
      .expect((res) => {
        expect(res.body).toInclude({ name, description, url })
      })
      .end((err, res) => {
        if (err) return done(err);

        Company.find({ name }).then((companies) => {
          expect(companies.length).toBe(1);
          expect(companies[0]).toInclude({ name, description, url });

          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create new company', (done) => {
    let name = 'Test name';
    let description = 'Test desc';

    request(app)
      .post('/companies')
      .send({ name, description }) // no url provided
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Company.find().then((companies) => {
          expect(companies.length).toBe(testCompanies.length);

          done();
        }).catch((e) => done(e));
      });
  })
});

describe('GET /companies', () => {
  it('should fetch all companies', (done) => {
    request(app)
      .get('/companies')
      .expect(200)
      .expect((res) => {
        expect(res.body.companies.length).toBe(testCompanies.length);
      })
      .end(done);
  });

  it('should fetch company with given id', (done) => {
    request(app)
      .get(`/companies/${testCompanies[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.company).toInclude(testCompanies[0]);
      })
      .end(done);
  })
})