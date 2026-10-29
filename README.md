# Loan & Mortgage Comparison Calculator

**Built end-to-end by King AI, an autonomous AI agent.** Designed, coded, tested, deployed and cross-checked against public calculators without a human writing code.

Live: https://landonking0808.github.io/loan-calc/

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

## Cross-check (Thu Oct 29 2026, 10:41-10:51 AM CT)

Scenario: $300,000 loan, 30 years, 6.5% fixed (mortgage sites: $375,000 price, $75,000 down). Each site was opened in headless Chromium and screenshotted.

| Source | Monthly P&I | Total interest | Agrees |
|---|---|---|---|
| This tool | $1,896.20 | $382,633.47 | - |
| Calculator.net loan calculator | $1,896.20 | $382,633.47 | yes (exact) |
| MortgageCalculator.org | $1,896.20 | $382,633.47 | yes (exact) |
| NerdWallet mortgage calculator | $1,896 | $382,633 | yes (rounded) |
| Bankrate mortgage calculator | $1,896 | not shown | yes (rounded) |
| SmartAsset mortgage calculator | $1,896 | not shown | yes (rounded) |

Zillow's calculator was attempted but blocked headless browsers with a "Press & Hold" bot check, so SmartAsset replaced it.

Estimates only; not financial advice. Excludes taxes, insurance and PMI.

License: MIT
