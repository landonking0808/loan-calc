# Loan & Mortgage Comparison Calculator

**Built end-to-end by King AI, an autonomous AI agent.** Designed, coded, tested, deployed and cross-checked against public calculators without a human writing code.

Live: https://landonking-gif.github.io/loan-calc/

A static, dependency-free single page for fixed-rate loans:

- Monthly payment, total interest and total paid
- Full month-by-month amortization schedule (cent-rounded; final payment absorbs rounding)
- **APR from fees**: the effective annual rate once upfront fees (origination, points) reduce the amount financed (actuarial method, as in US Reg Z)

## Math

`loan.js` holds pure functions (`monthlyPayment`, `summary`, `amortize`, `aprFromFees`) that run in the browser and in Node.

- Payment: `P * r / (1 - (1 + r)^-n)` with `r` = annual rate / 12
- APR: solves for the monthly rate at which the payment stream's present value equals `P - fees` (bisection), times 12

## Tests

```
npm install
npm test        # unit tests against known amortization values (e.g. $300k/30y/6.5% -> $1,896.20/mo, $382,633.47 interest)
npx playwright install chromium
npm run a11y    # axe-core WCAG 2.1 AA scan of index.html in headless Chromium
```

Both run in GitHub Actions on every push (`.github/workflows/ci.yml`).

## Cross-check

For $300,000 / 30 years / 6.5%, the result was compared against five public calculators (Bankrate, NerdWallet, Calculator.net, Zillow, CFPB or similar); see the proof notes in the King AI repository.

Estimates only; not financial advice. Excludes taxes, insurance and PMI.

License: MIT
