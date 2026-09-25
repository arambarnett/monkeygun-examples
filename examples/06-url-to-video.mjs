// 06 · URL to video
// Point it at a page. Facts, stills and the page's own colors come out of the page; the
// script can only say what the page says. Here: the Pokémon card artist Mitsuhiro Arita.
//
//   node examples/06-url-to-video.mjs [https://any.page]
import { api, waitForVideo, done } from '../lib/monkeygun.mjs'

const url = process.argv[2] ?? 'https://en.wikipedia.org/wiki/Mitsuhiro_Arita'

// 1. read the page → source pack (free). A page that did not load is refused, so nothing is invented from a 404.
const pack = await api('/v1/sources', { url })
console.log(`source ${pack.sourcePackId}: "${pack.title}" · ${pack.facts?.length ?? 0} facts · ${pack.stills?.length ?? 0} stills`)

// 2. create from the pack with the page's stills, 3. render
const v = await api('/v1/videos', {
  brief: 'A 30-second portrait of the artist for card collectors. Open on the most famous card, three facts from the page, end on where to see more.',
  sourcePackId: pack.sourcePackId,
  format: '9:16', targetSeconds: 30, images: 'source', captions: true, public: true,
})
console.log(`created ${v.videoId} (${v.charged} credits)`)
await api(`/v1/videos/${v.videoId}/render`, {})
done(await waitForVideo(v.videoId))
