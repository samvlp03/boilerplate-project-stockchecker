const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Stock Price Checker', function() {
  this.timeout(10000); // Increase timeout for API calls

  describe('GET /api/stock-prices/', () => {
    it('Viewing one stock', (done) => {
      chai.request(app)
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('stockData');
          expect(res.body.stockData).to.have.property('stock', 'GOOG');
          expect(res.body.stockData).to.have.property('price');
          expect(res.body.stockData).to.have.property('likes');
          done();
        });
    });

    it('Viewing one stock and liking it', (done) => {
      chai.request(app)
        .get('/api/stock-prices?stock=MSFT&like=true')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.stockData).to.have.property('stock', 'MSFT');
          expect(res.body.stockData.likes).to.be.at.least(1);
          done();
        });
    });

    it('Viewing the same stock and liking it again', (done) => {
      chai.request(app)
        .get('/api/stock-prices?stock=MSFT&like=true')
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Likes should not increase for same IP
          expect(res.body.stockData.likes).to.equal(1);
          done();
        });
    });

    it('Viewing two stocks', (done) => {
      chai.request(app)
        .get('/api/stock-prices?stock[]=AAPL&stock[]=AMZN')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('stockData');
          expect(res.body.stockData).to.be.an('array').with.lengthOf(2);
          expect(res.body.stockData[0]).to.have.property('stock');
          expect(res.body.stockData[0]).to.have.property('price');
          expect(res.body.stockData[0]).to.have.property('rel_likes');
          done();
        });
    });

    it('Viewing two stocks and liking them', (done) => {
      chai.request(app)
        .get('/api/stock-prices?stock[]=TSLA&stock[]=NFLX&like=true')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.stockData).to.be.an('array').with.lengthOf(2);
          expect(res.body.stockData[0]).to.have.property('rel_likes');
          expect(res.body.stockData[1]).to.have.property('rel_likes');
          // rel_likes should be opposites
          expect(res.body.stockData[0].rel_likes).to.equal(-res.body.stockData[1].rel_likes);
          done();
        });
    });
  });
});