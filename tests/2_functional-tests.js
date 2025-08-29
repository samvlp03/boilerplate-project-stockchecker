const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

 const expect = chai.expect;

suite('Functional Tests', function() {
	let likeAgent;
	this.timeout(5000);

	test('Viewing one stock: GET request to /api/stock-prices/', async function() {
		const res = await chai.request(server)
			.get('/api/stock-prices')
			.query({ stock: 'GOOG' });
		expect(res).to.have.status(200);
		expect(res.body.stockData).to.have.property('stock', 'GOOG');
		expect(res.body.stockData).to.have.property('price');
		expect(res.body.stockData).to.have.property('likes');
	});

	test('Viewing one stock and liking it: GET request to /api/stock-prices/', async function() {
		likeAgent = chai.request.agent(server);
		const res = await likeAgent
			.get('/api/stock-prices')
			.query({ stock: 'GOOG', like: true });
		expect(res).to.have.status(200);
		expect(res.body.stockData).to.have.property('stock', 'GOOG');
		expect(res.body.stockData).to.have.property('likes');
		expect(res.body.stockData.likes).to.be.a('number');
	});

	test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', async function() {
		const res = await likeAgent
			.get('/api/stock-prices')
			.query({ stock: 'GOOG', like: true });
		expect(res).to.have.status(200);
		expect(res.body.stockData).to.have.property('stock', 'GOOG');
		expect(res.body.stockData).to.have.property('likes');
		expect(res.body.stockData.likes).to.be.a('number');
	});

	test('Viewing two stocks: GET request to /api/stock-prices/', async function() {
		const res = await chai.request(server)
			.get('/api/stock-prices')
			.query({ stock: ['GOOG', 'MSFT'] });
		expect(res).to.have.status(200);
		expect(res.body.stockData).to.be.an('array').with.lengthOf(2);
		expect(res.body.stockData[0]).to.have.property('stock');
		expect(res.body.stockData[0]).to.have.property('price');
		expect(res.body.stockData[0]).to.have.property('rel_likes');
		expect(res.body.stockData[0]).to.not.have.property('likes');
		expect(res.body.stockData[1]).to.have.property('stock');
		expect(res.body.stockData[1]).to.have.property('price');
		expect(res.body.stockData[1]).to.have.property('rel_likes');
		expect(res.body.stockData[1]).to.not.have.property('likes');
	});

	test('Viewing two stocks and liking them: GET request to /api/stock-prices/', async function() {
		const agent = chai.request.agent(server);
		const res = await agent
			.get('/api/stock-prices')
			.query({ stock: ['GOOG', 'MSFT'], like: true });
		expect(res).to.have.status(200);
		expect(res.body.stockData).to.be.an('array').with.lengthOf(2);
		expect(res.body.stockData[0]).to.have.property('rel_likes');
		expect(res.body.stockData[0]).to.not.have.property('likes');
		expect(res.body.stockData[1]).to.have.property('rel_likes');
		expect(res.body.stockData[1]).to.not.have.property('likes');
	});
});
// ...existing code...
