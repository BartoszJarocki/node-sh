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

describe('POST /api/v1/companies', () => {
  it('should create a new company', (done) => {
    let name = 'Test name';
    let description = 'Test desc';
    let url = 'Test url';

    request(app)
      .post('/api/v1/companies')
      .send({ name, description, url })
      .expect(201)
      .expect((res) => {
        expect(res.body).toInclude({ name, description, url })
      })
      .end((err, res) => {
        if (err) return done(err);

        Company.find({ name }).then((companies) => {
          expect(companies.length).toBe(1);
          expect(companies[0]).toContain({ name, description, url });

          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create new company', (done) => {
    let name = 'Test name';
    let description = 'Test desc';

    request(app)
      .post('/api/v1/companies')
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

describe('GET /api/v1/companies', () => {
  it('should fetch all companies', (done) => {
    request(app)
      .get('/api/v1/companies')
      .expect(200)
      .expect((res) => {
        expect(res.body.companies.length).toBe(testCompanies.length);
      })
      .end(done);
  });
})

describe('GET /api/v1/companies/:id', () => {
  it('should fetch company with given id', (done) => {
    request(app)
      .get(`/api/v1/companies/${testCompanies[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.company).toContain(testCompanies[0]);
      })
      .end(done);
  });

  it('should return 404 when company with given id not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/api/v1/companies/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 when id is not correct', (done) => {
    let incorrectId = 'incorrectId'

    request(app)
      .get(`/api/v1/companies/${incorrectId}`)
      .expect(400)
      .end(done);
  })

  it('should remove company with given id', (done) => {
    request(app)
      .delete(`/api/v1/companies/${testCompanies[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.company).toContain(testCompanies[0]);
      })
      .end((err, res) => {
        if (err) return done(err);

        Company.find().then((companies) => {
          expect(companies.length).toBe(testCompanies.length - 1);
          expect(companies).toNotContain(testCompanies[0]);

          done();
        }).catch((e) => done(e));
      });
  });
})

describe('DELETE /api/v1/companies/:id', () => {
  it('should remove company with given id', (done) => {
    let hexId = testCompanies[0]._id.toHexString();

    request(app)
      .delete(`/api/v1/companies/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.company).toContain(testCompanies[0]);
      })
      .end((err, res) => {
        if (err) return done(err);

        Company.findById(hexId).then((company) => {
          expect(company).toNotExist();

          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if company with given id not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/api/v1/companies/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 when id is not correct', (done) => {
    let incorrectId = 'incorrectId'

    request(app)
      .delete(`/api/v1/companies/${incorrectId}`)
      .expect(400)
      .end(done);
  })
})