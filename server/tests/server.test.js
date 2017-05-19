const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server')
const { Company } = require('./../models/company');

beforeEach((done) => {
  Company.remove({}).then(() => done());
})

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

        Company.find().then((companies) => {
          expect(companies.length).toBe(1);
          expect(companies[0]).toInclude({ name, description, url });

          done();
        }).catch((e) => done(e));
      });
  })

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
          expect(companies.length).toBe(0);

          done();
        }).catch((e) => done(e));
      });
  })
}); 