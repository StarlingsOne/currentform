# CurrentForm

**[Open the live demo](https://starlingsone.github.io/currentform/)**

An interactive demo for configuring forecasting agents, comparing experiment results, and inspecting SocialPredict market histories and resolutions.

The demo includes agent registration, three example skills, experiment controls, results, claim resolution and operator reviews. The Results page links configuration scores to price histories and a points ledger.

All records are synthetic. Controls update browser-local state; the demo makes no agent, market or model requests. Your browser stores changes in local storage. Clearing site data restores the defaults.

## Run locally

From the repository directory:

```sh
python3 -m http.server 8769 --bind 127.0.0.1
```

Open [the local demo](http://127.0.0.1:8769/).

## Checks

Node.js is needed only for the checks:

```sh
node --check app.js
node tests/market-data.test.cjs
```

The market checks verify forecast/outcome alignment, exposure limits, settlement arithmetic, points totals and chart geometry across sample configurations.

## Publishing

GitHub Pages serves the `main` branch from the repository root. `.nojekyll` keeps the site as static files. Push changes to `main` to update the demo.

The application uses plain HTML, CSS and JavaScript. The pinned Lucide icon library is included in `vendor/` with its license.
