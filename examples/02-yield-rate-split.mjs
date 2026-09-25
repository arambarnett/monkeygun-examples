// 02 · Yield protocol: Rate Split
// A daily rate video where every number must trace to the feed. We write the script
// ourselves (no director), so the words are exact, a real bar chart shows the APY split,
// and the disclaimer carries the as-of time. Cost: 60 credits for 30 s.
//
//   node examples/02-yield-rate-split.mjs
import { api, waitForJob, done } from '../lib/monkeygun.mjs'

// PoolSnapshot — from DefiLlama, your own API, or your warehouse.
const pool = {
  protocol: 'Superform', chain: 'base', pool: 'USDC Vault', asset: 'USDC',
  apyPct: 26.0, apyBasePct: 0.0, apyRewardPct: 26.0,
  tvlUsd: 18400000, tvlChange7dPct: 12.5,
  benchmarkName: 'US savings account average', benchmarkApyPct: 0.45,
  asOf: '2026-09-25T00:00:00Z', source: 'DefiLlama',
}
const asOf = new Date(pool.asOf).toISOString().slice(0, 10)

const r = await api('/v1/videos/from-data', {
  title: `How much of ${pool.pool}'s ${pool.apyPct}% is real?`,
  cta: `Current rates. Not advice. ${pool.protocol.toLowerCase()}.xyz`,
  data: pool,                       // kept on the video as the facts of record
  format: '9:16', targetSeconds: 30, images: 'none', public: true, async: true,
  brand: { pack: 'editorial', accent: '#00E07F', ground: '#07110C', watermark: `${pool.protocol.toLowerCase()}.xyz`, disclaimer: `Current rates as of ${asOf}. Source: ${pool.source}. Not financial advice.`, captionStyle: 'bar' },
  script: {
    title: `How much of this ${pool.apyPct}% is real?`,
    vo: `${pool.pool} on ${pool.chain} shows a ${pool.apyPct} percent yield today. Here is where it comes from. ${pool.apyBasePct} percent is paid by borrowers. The other ${pool.apyRewardPct} percent is paid in rewards. That is ${pool.apyPct} percent against a savings account average of under half a percent. Current rates, not a promise. Data from ${pool.source}.`,
    cta: `Current rates. Not advice. ${pool.protocol.toLowerCase()}.xyz`,
    scenes: [
      { type: 'title', text: `How much of this ${pool.apyPct}% is real?`, duration: 4, motion: 'slam', sfx: 'riser', transition: 'dissolve' },
      { type: 'data', text: `${pool.pool} · ${pool.chain}`, duration: 4, stats: [{ value: `${pool.apyPct}%`, label: 'headline APY' }, { value: `$${(pool.tvlUsd / 1e6).toFixed(1)}M`, label: 'TVL' }, { value: `+${pool.tvlChange7dPct}%`, label: 'TVL 7d' }], transition: 'cut' },
      { type: 'chart', text: 'Where the yield comes from', duration: 7, sfx: 'keys', transition: 'cut',
        chart: { kind: 'bars', series: [{ t: 'borrowers', v: pool.apyBasePct }, { t: 'rewards', v: pool.apyRewardPct }], valueFormat: 'pct', baseline: 0, title: `${pool.source} · as of ${asOf}` } },
      { type: 'data', text: 'Beat your bank?', duration: 5, motion: 'countup', sfx: 'impact', transition: 'wipe', stats: [{ value: `${pool.apyPct}%`, label: 'this pool' }, { value: `${pool.benchmarkApyPct}%`, label: 'savings average' }] },
      { type: 'quote', text: 'Current rates. Not a promise.', duration: 3, transition: 'dissolve' },
      { type: 'cta', text: `Current rates. Not advice. ${pool.protocol.toLowerCase()}.xyz`, duration: 4, sfx: 'tick' },
    ],
  },
})
console.log(`job ${r.jobId} started`)
done(await waitForJob(r.jobId))
