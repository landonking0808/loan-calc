const test = require('node:test');
const assert = require('node:assert');
const L = require('../loan.js');
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: got ${a}, want ${b}`);

test('$300,000 / 30y / 6.5% payment = 1896.20 (standard published value)', () => {
  near(L.monthlyPayment(300000, 6.5, 360), 1896.20, 0.005, 'payment');
});
test('$200,000 / 30y / 6% payment = 1199.10', () => {
  near(L.monthlyPayment(200000, 6, 360), 1199.10, 0.005, 'payment');
});
test('$100,000 / 15y / 5% payment = 790.79', () => {
  near(L.monthlyPayment(100000, 5, 180), 790.79, 0.005, 'payment');
});
test('zero rate divides evenly', () => {
  assert.strictEqual(L.monthlyPayment(12000, 0, 12), 1000);
});
test('first amortization row for 300k/30y/6.5%: interest 1625.00, principal 271.20', () => {
  const s = L.amortize(300000, 6.5, 360);
  assert.strictEqual(s.rows[0].interest, 1625.00);
  assert.strictEqual(s.rows[0].principal, 271.20);
  assert.strictEqual(s.rows[0].balance, 299728.80);
});
test('schedule ends at zero balance and total interest ~ 382,633', () => {
  const s = L.amortize(300000, 6.5, 360);
  assert.strictEqual(s.rows.length, 360);
  assert.strictEqual(s.rows[359].balance, 0);
  near(s.totalInterest, 382633.47, 5, 'total interest'); // cent-rounded schedule drifts a few dollars
  near(s.totalPaid - s.totalInterest, 300000, 0.01, 'principal repaid');
});
test('APR with no fees equals note rate', () => {
  near(L.aprFromFees(300000, 6.5, 360, 0), 6.5, 1e-6, 'apr');
});
test('APR with $6,000 fees on 300k/30y/6.5% ~ 6.69%', () => {
  near(L.aprFromFees(300000, 6.5, 360, 6000), 6.695, 0.002, 'apr');
});
test('APR rises with fees', () => {
  assert.ok(L.aprFromFees(200000, 6, 360, 4000) > L.aprFromFees(200000, 6, 360, 1000));
});
test('summary total interest for 300k/30y/6.5% = 382,633.47', () => {
  const s = L.summary(300000, 6.5, 360);
  assert.strictEqual(s.payment, 1896.20);
  assert.strictEqual(s.totalInterest, 382633.47);
});
