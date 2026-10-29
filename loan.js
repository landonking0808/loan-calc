// Loan math: pure functions, usable in the browser and in Node (tests).
(function (root) {
  'use strict';
  function monthlyPayment(principal, annualRatePct, months) {
    if (!(principal > 0) || !(months > 0)) return 0;
    const r = annualRatePct / 100 / 12;
    if (r === 0) return principal / months;
    return principal * r / (1 - Math.pow(1 + r, -months));
  }
  function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
  // Amortization schedule; final payment adjusted so balance ends at exactly 0.
  function amortize(principal, annualRatePct, months) {
    const r = annualRatePct / 100 / 12;
    const pmt = round2(monthlyPayment(principal, annualRatePct, months));
    let bal = principal, rows = [], totalInterest = 0, totalPaid = 0;
    for (let n = 1; n <= months; n++) {
      const interest = round2(bal * r);
      let principalPart = round2(pmt - interest);
      let payment = pmt;
      if (n === months || principalPart > bal) { principalPart = round2(bal); payment = round2(principalPart + interest); }
      bal = round2(bal - principalPart);
      totalInterest = round2(totalInterest + interest);
      totalPaid = round2(totalPaid + payment);
      rows.push({ n, payment, interest, principal: principalPart, balance: bal });
    }
    return { payment: pmt, rows, totalInterest, totalPaid };
  }
  // APR (US Reg Z style, actuarial): rate that equates amount financed
  // (principal - prepaid finance charges) to the payment stream at the note rate.
  function aprFromFees(principal, annualRatePct, months, fees) {
    const pmt = monthlyPayment(principal, annualRatePct, months);
    const financed = principal - fees;
    if (!(financed > 0) || !(pmt > 0)) return NaN;
    const pv = (rm) => rm === 0 ? pmt * months : pmt * (1 - Math.pow(1 + rm, -months)) / rm;
    let lo = 0, hi = 1; // monthly rate bounds
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (pv(mid) > financed) lo = mid; else hi = mid;
    }
    return ((lo + hi) / 2) * 12 * 100;
  }
  function summary(principal, annualRatePct, months) {
    const pmt = monthlyPayment(principal, annualRatePct, months);
    return { payment: round2(pmt), totalPaid: round2(pmt * months), totalInterest: round2(pmt * months - principal) };
  }
  const api = { monthlyPayment, amortize, aprFromFees, summary, round2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LoanMath = api;
})(this);
