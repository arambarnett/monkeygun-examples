// 01 · Exchange listing video
// A token just listed. Post its snapshot; get a 30-second vertical video with the logo,
// the numbers spoken naturally, and your CTA as the last scene. One call, then poll.
//
//   node examples/01-exchange-listing.mjs
//
// In production you would fire this from your listing pipeline, pass the listing id as
// external_id, and receive `video.rendered` on a webhook instead of polling.
import { api, waitForVideo, done } from '../lib/monkeygun.mjs'

const listing = {
  symbol: 'BTC', name: 'Bitcoin',
  priceUsd: 112340, change24hPct: 2.4, change7dPct: 6.1,
  volume24hUsd: 38200000000, marketCapUsd: 2230000000000, holders: 54000000,
  imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  listedAt: '2026-09-25', tradingPairs: ['BTC/USD', 'BTC/USDC'],
}

const r = await api('/v1/videos/from-data', {
  title: `${listing.name} ($${listing.symbol}) is live`,
  brief: 'A 30-second listing announcement for traders scrolling the app. Open on the price and the 24h move, name the pairs, end on the CTA.',
  cta: `Trade $${listing.symbol} on yourexchange.com`,
  data: listing,
  imageUrl: listing.imageUrl,
  images: 'source',
  format: '9:16', targetSeconds: 30,
  brand: { pack: 'bold', accent: '#C7F24C', ground: '#0B0C0F', watermark: 'yourexchange.com' },
  public: true,
  external_id: `listing-${listing.symbol}-${listing.listedAt}`,
})
console.log(`created ${r.videoId}, charged ${r.charged} credits`)
done(await waitForVideo(r.videoId))
