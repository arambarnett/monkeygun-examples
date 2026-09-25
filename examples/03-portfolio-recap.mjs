// 03 · User portfolio recap + the embedded studio
// Two things an exchange does for its users:
//   (a) make "your week" from a WalletSnapshot server-side, tagged with the user's id, and
//   (b) mint an embed token so the user can open the studio inside your app and make their own.
//
//   node examples/03-portfolio-recap.mjs
import { api, waitForVideo, done } from '../lib/monkeygun.mjs'

const userId = 'user_48213'        // your id for the user; comes back on webhooks as externalUserId
const wallet = {
  walletLabel: '@soggychad', totalUsd: 10539, positions: 4, pnl7dUsd: -2140, pnl7dPct: -16.9,
  holdings: [
    { symbol: 'BTC', name: 'Bitcoin', valueUsd: 6200, pctOfBag: 58.8, change24hPct: 2.4, iconUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { symbol: 'ETH', name: 'Ethereum', valueUsd: 2900, pctOfBag: 27.5, change24hPct: -1.1, iconUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { symbol: 'SOL', name: 'Solana', valueUsd: 1439, pctOfBag: 13.7, change24hPct: -6.3, iconUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  ],
  bestMover: { symbol: 'BTC', change24hPct: 2.4 }, worstMover: { symbol: 'SOL', change24hPct: -6.3 },
  asOf: '2026-09-25T00:00:00Z',
}

// (a) the recap, server-side
const r = await api('/v1/videos/from-data', {
  title: `${wallet.walletLabel}: your week`,
  brief: 'A friendly 25-second recap of this portfolio for its owner. Lead with the total, name the best and worst mover, keep it light, no advice.',
  cta: 'See your full portfolio in the app',
  data: wallet, images: 'source',
  format: '9:16', targetSeconds: 25, public: true,
  brand: { pack: 'classic', accent: '#7DD3FC', ground: '#0B0F14', watermark: 'yourexchange.com' },
  external_id: `recap-${userId}-${wallet.asOf.slice(0, 10)}`,
})
console.log(`recap ${r.videoId} created (${r.charged} credits)`)
done(await waitForVideo(r.videoId))

// (b) a studio session for the same user — put `url` in an <iframe> on your page
const embed = await api('/v1/embed/token', { externalUserId: userId, origin: 'https://yourexchange.com', ttlSeconds: 3600 })
console.log(`\nembed url for ${userId} (valid until ${embed.expiresAt}):\n  ${embed.url}`)
console.log('  The page posts { type: "monkeygun", event: "video.rendered", videoId, url } to the parent;')
console.log('  rendered-video webhooks carry externalUserId so your backend can attribute without the browser.')
