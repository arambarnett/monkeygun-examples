# Monkeygun examples

Runnable, dependency-free Node scripts against the Monkeygun API. Each one is a complete integration for one use case. Docs: https://monkey-gun.gitbook.io/monkeygun

```bash
git clone https://github.com/arambarnett/monkeygun-examples && cd monkeygun-examples
cp .env.example .env            # put your key in (Monkeygun → Settings → Developer)
set -a && source .env && set +a
node examples/01-exchange-listing.mjs
```

| # | Example | What it shows | Credits |
|---|---|---|---|
| 01 | [Exchange listing](examples/01-exchange-listing.mjs) | A TokenSnapshot → 30 s listing video with the logo and your CTA. One call, then poll (or a webhook). | 60 |
| 02 | [Yield rate split](examples/02-yield-rate-split.mjs) | A PoolSnapshot with an authored script: exact words, a real bar chart of the APY split, as-of disclaimer, async job polling. | 60 |
| 03 | [Portfolio recap + embedded studio](examples/03-portfolio-recap.mjs) | "Your week" from a WalletSnapshot tagged to a user, then an embed token so the user makes their own inside your app. | 60 |
| 04 | [Footage campaign](examples/04-footage-campaign.mjs) | Upload footage you already have by URL, index it once, find highlights, cut a video from it with `images: "library"`. | 20/min + 5/min + 45 |
| 05 | [Weekly stocks brief](examples/05-stocks-weekly.mjs) | The built-in market data feed (Yahoo, CoinGecko, FX, weather) as the source. No data of your own. | 60 |
| 06 | [URL to video](examples/06-url-to-video.mjs) | Any page → source pack (facts, stills, palette) → video that can only say what the page says. | 60 |

Every script prints the keyed `renderUrl` (plays without a session), a share page, and a poster. One credit is one cent; new accounts start with 500.

## The client

[`lib/monkeygun.mjs`](lib/monkeygun.mjs) is 40 lines: `api(path, body)` for REST calls, `tool(name, args)` for the tool catalog (`POST /v1/tools/{name}`), `waitForVideo` and `waitForJob` for polling. In production replace polling with a webhook: `POST /v1/webhooks { url, events: ["video.rendered", "video.render_failed"] }` and match on `external_id`.

## Samples

Each script was run against production. Watch the results:

| # | Sample |
|---|---|
| 01 | [Bitcoin ($BTC) is live](https://monkeygun.com/w/vid-422?k=5eed15a54d475d0eb30e) |
| 02 | [How much of USDC Vault's 26% is real?](https://monkeygun.com/w/vid-421?k=44d584944fda17b69a38) |
| 03 | [@soggychad: your week](https://monkeygun.com/w/vid-423?k=d69a6e2083d2f8de2f79) |
| 04 | [Cut from your own footage](https://monkeygun.com/w/vid-425?k=815e407ba99a2ad20c58) |
| 05 | [AMD up 23% in a week](https://monkeygun.com/w/vid-424?k=e203ca6d3e163cf1fb64) |
| 06 | [Ken Sugimori: the hand behind the first 151 Pokémon](https://monkeygun.com/w/vid-426?k=3d45860c08fe23ce4566) |

More on the [examples page in the docs](https://monkey-gun.gitbook.io/monkeygun/examples/runnable-examples).
