// 05 · Weekly stocks brief from the built-in market data feed
// No data of your own needed: market_data (free) reads Yahoo Finance for tickers and
// indices, CoinGecko for coins, Open-Meteo for weather, Frankfurter for FX, and returns a
// source pack. The pack's facts are the only numbers the script may use.
//
//   node examples/05-stocks-weekly.mjs
import { api, tool, waitForVideo, done } from '../lib/monkeygun.mjs'

const pack = await tool('market_data', { kind: 'stock', symbols: ['NVDA', 'AMD', '^IXIC'], range: '7d' })
console.log(`source pack ${pack.sourcePackId}: ${pack.facts?.length ?? 0} facts`)

const v = await api('/v1/videos', {
  brief: 'The week in AI chip stocks, 30 seconds, for a retail-investor newsletter. Compare NVDA and AMD against the Nasdaq, end on the subscribe line.',
  sourcePackId: pack.sourcePackId,
  format: '9:16', targetSeconds: 30, images: 'none', captions: true,
  brand: { pack: 'editorial', accent: '#F2C94C', ground: '#0F0E0A', watermark: 'yournewsletter.com', disclaimer: 'Not investment advice.' },
  public: true,
})
console.log(`created ${v.videoId} (${v.charged} credits) → rendering`)
await api(`/v1/videos/${v.videoId}/render`, {})
done(await waitForVideo(v.videoId))
