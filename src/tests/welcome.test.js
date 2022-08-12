/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-import */
import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

use(chaiHttp);

describe('WELCOME END-POINTS TESTING', () => {
  it('Should get welcome message', (done) => {
    request(server)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.type).to.equal('application/json');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.message).to.equal('Welcome to ZPlatform-API!');
        expect(res.body.status).to.equal('success');
      });

    done();
  });

  it('Should not display Welcome due to invalid Url', (done) => {
    request(server)
      .get('/sdsjkds')
      .end((err, res) => {
        expect(res).to.have.status(404);
      });

    done();
  });
});
