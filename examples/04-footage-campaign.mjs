// 04 · Your existing footage → indexed → cut into videos
// Upload what you already shot (a URL is enough), let Monkeygun index it once
// (scene cuts, a description of every scene, the speech), then cut as many videos
// from it as you like. Footage that has no speech is scanned for highlights instead.
//
//   node examples/04-footage-campaign.mjs [https://…/your-clip.mp4]
import { api, tool, waitForVideo, done } from '../lib/monkeygun.mjs'

const footageUrl = process.argv[2] ?? 'https://monkeygun.com/deck/v-catking.mp4'   // any public mp4, or an X / YouTube / TikTok / Instagram post

// 1. into your library (250 MB max per file; base64 `data` also accepted)
const up = await api('/v1/library/upload', { url: footageUrl, filename: 'footage-01.mp4' })
console.log(`uploaded → assetId ${up.assetId}`)

// 2. index it once (20 credits per minute of footage). quoteOnly:true prices it first.
const idx = await tool('index_footage', { assetIds: [up.assetId] })
console.log(`indexed: ${idx.scenes?.length ?? idx.indexed ?? ''} scenes, ${idx.charged ?? 0} credits`)

// 2b. no speech? find the moments (loudness peaks, cuts) for clipRef cuts. 5 credits per minute.
const hl = await tool('find_highlights', { assetId: up.assetId }).catch(e => ({ error: e.message }))
if (!hl.error) console.log(`highlights: ${(hl.moments ?? hl.highlights ?? []).length} moments`)

// 3. cut a 15-second ad from it. images:"library" places your files, not stills or generated images.
const r = await api('/v1/videos/from-data', {
  title: 'Cut from your own footage',
  brief: 'A 15-second teaser built from the uploaded footage: pick the most energetic moments, one line of copy per beat, end on the CTA.',
  cta: 'Book at yourvenue.com',
  libraryAssetIds: [up.assetId], images: 'library',
  format: '9:16', targetSeconds: 15, public: true,
  brand: { pack: 'bold', accent: '#FF2D78', ground: '#0B0C0F', watermark: 'yourvenue.com' },
})
console.log(`created ${r.videoId} (${r.charged} credits)`)
done(await waitForVideo(r.videoId))

// A campaign is one indexing plus N calls with different briefs. The index is reused.
