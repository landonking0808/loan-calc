// Accessibility check: load index.html in headless Chromium, inject axe-core, fail on any violation.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(process.env.URL || 'file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(async () => await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }));
  const pmt = await page.textContent('#out-pmt');
  await browser.close();
  console.log(`axe-core ${res.testEngine.version}: ${res.passes.length} rules passed, ${res.violations.length} violations`);
  res.violations.forEach(v => console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`));
  console.log('rendered monthly payment:', pmt);
  if (errors.length) console.log('page errors:', errors);
  if (res.violations.length || errors.length || pmt !== '$1,896.20') process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
