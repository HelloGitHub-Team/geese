# Regional image hosting

The mainland and overseas frontends use separate builds. `NEXT_PUBLIC_IMAGE_BASE_URL` selects image routing at **build time**, independently of page language, browser state and API host. The overseas origin is a custom domain connected directly to the R2 bucket; no Cloudflare Worker is required for uploads or reads.

## Regional builds

Mainland: leave the setting empty, including in `.env*` files. Images continue to use `https://img.hellogithub.com`.

```sh
yarn build:mainland
```

Overseas: the production R2 custom domain is `https://img.cheatsheet.store`. Build for this origin **after** original migration, derivative generation, verification and cache configuration are complete.

```sh
yarn build:overseas
```

Build in separate checkouts/CI jobs and deploy each build's SSR output and browser assets together. Changing `next start` or container runtime environment does not update the compiled origin. Do not mix mainland and overseas `.next` artifacts.

Docker passes the setting before `yarn build`:

```sh
docker build --build-arg NEXT_PUBLIC_IMAGE_BASE_URL= -t geese:mainland .
docker build --build-arg NEXT_PUBLIC_IMAGE_BASE_URL=https://img.cheatsheet.store -t geese:overseas .
```

Use the repository's Node 24 runtime. The installed ECharts version misidentifies Node's global `navigator` as a browser; builds and server processes need `NODE_OPTIONS=--no-experimental-global-navigator`. The regional build scripts, Docker and PM2 include this setting; set it explicitly when calling the generic build command:

```sh
NODE_OPTIONS=--no-experimental-global-navigator \
  NEXT_PUBLIC_IMAGE_BASE_URL=https://img.cheatsheet.store \
  yarn build
```

`yarn build` still defaults to mainland image routing when `NEXT_PUBLIC_IMAGE_BASE_URL` is unset. The regional build scripts explicitly select either mainland routing or `https://img.cheatsheet.store`; they also run the existing `postbuild` sitemap step. Docker selects the origin with its build argument.

## URL contract

`src/utils/image.ts` rewrites only the exact original HTTPS origin `https://img.hellogithub.com`, including host case variants and default port `:443`. Original objects and the precomputed named variants `small`, `headimage` and `gif` retain their raw path and fragment:

```text
https://img.hellogithub.com/article/a.png!headimage
→ https://img.cheatsheet.store/article/a.png!headimage
```

R2 stores that entire path as an object key. It does not transform images at request time. For this reason, query-bearing URLs (including an empty `?`), unknown named variants and inline Upyun `!` processing directives remain on Upyun. Passing their processing or signature queries to R2 could silently serve an unprocessed object. A fragment-only `?` is not a query and remains unchanged during routing. Add precomputed mappings before moving any additional processing formats overseas.

Third-party/lookalike hosts, userinfo URLs, local/relative/data/blob URLs, HTTP original URLs and protocol-relative originals remain unchanged. API payloads, stored HTML and Markdown are never mutated. Routing applies at native image, preview, Markdown/embedded image, notification HTML, CSS logo and SEO rendering boundaries. Other raw Markdown HTML remains escaped; embedded image attributes are allowlisted.

An optional delivery prefix remains supported by the utility for other services, but a direct R2 custom domain must use its origin without an extra prefix unless object keys actually include that prefix.

## New images and failures

`HostedImage` tries the original Upyun `src`/`srcset` once if an overseas read fails, preserving native props, refs and error callbacks. This covers shared images, avatars, previews and Markdown images during a short asynchronous synchronization window. It does not introduce Worker traffic or an endless retry loop. Upyun fallback can still fail when overseas access is blocked.

CSS backgrounds, SEO crawlers and images injected through the existing raw notification HTML boundary do not receive a React image error fallback. Direct R2 missing objects return 404. Historical completeness checks and monitoring the backend queue remain required; guaranteed availability for brand-new objects additionally needs publication to wait until all required variants have synchronized. The current asynchronous queue does not enforce that publication gate.

## Backend and cache prerequisites

The backend implementation lives in the adjacent `pangu` repository; see `doc/image_mirror.md` there.

1. Super Slurper migrates historical originals from Upyun's S3-compatible endpoint without deleting source objects.
2. The backend obtains Upyun's existing processed `!small`, `!headimage` and one-frame `!gif` results and uploads them directly using bucket-scoped R2 S3 credentials. New images use the same background queue.
3. Connect the production image domain to R2 and configure explicit cache eligibility for all images, including avatars and named suffixes, with bounded TTLs and no negative caching. The owner confirmed that all images change infrequently; the templates use a 1-day edge TTL and a 1-hour browser TTL, with only nonempty query strings bypassing the edge cache and only error responses receiving `no-store`. Both revised rulesets were deployed as version 2 at 15:49Z on 2026-10-28 with the owner's approval. Live default-avatar original and `!small` requests returned 200, CDN `HIT` and `public, max-age=3600`; query requests remained `DYNAMIC` and missing images returned 404, `BYPASS` and `no-store`. Upyun's old cache metadata can survive migration; override response cache headers as well. R2 overwrites do not invalidate edge or browser copies automatically: purge original and derivative URLs for urgent changes, and allow existing browser copies to expire or use a new filename. Adding a query string routes the frontend image back to Upyun, so it is not an R2 versioning mechanism.
4. Verify originals and processed objects before enabling the overseas build setting. Use original dimensions and GIF frame counts, not only successful HTTP status or a transport hash.

The pangu deployment includes `deploy/image-cache-rules.json` and `deploy/image-response-headers.json` templates already configured for `img.cheatsheet.store`. Merge changes with the existing zone rules. Do not blindly replace rules for other services.

## Local verification

```sh
NEXT_PUBLIC_IMAGE_BASE_URL= yarn test --runInBand
NEXT_PUBLIC_IMAGE_BASE_URL=https://img.cheatsheet.store yarn test --runInBand
yarn typecheck
```

Tests cover origin boundaries, named variants, dynamic query preservation, `srcset`, HTML attributes, browser fallback, native behavior, Markdown/preview/GIF behavior and SSR/SEO output. Existing Arena regressions run with the same suite.

On real deployments verify an original, article head image, GIF cover and animated preview, mutable avatar, Markdown image, logo and `og:image`. Switch language to confirm the origin still follows deployment. After deploying the revised cache rules, confirm edge cache hits on ordinary images and avatars, a 1-hour browser TTL, query-string bypass, correct MIME types and 404s that do not persist after upload. Direct R2 responses do not contain the former Worker's `X-Image-Source` header.

At 16:15Z, derivative generation finished with `article=2844 done` and `other=75163 done`, with no pending or failed rows. Increasing direct recovery concurrency from 4 to 16 sustained approximately 160 sources per minute; the last two persistent 405 GIFs were recovered from checksum-verified R2 originals, with conditional writes and derivative read-back checks. Historical originals were not re-uploaded. Independent read-back ran in parallel and had reached 62,926 sources / 66,389 derivative objects without failures; these are intermediate counts pending final coverage and live reconciliation. The seven official-original migration exceptions remain unresolved, and the overseas frontend has not switched. The older snapshots below describe earlier stages.

As of 2026-10-28 the original Upyun backup is complete (77,950 objects, 4,756,439,154 bytes, all hashes verified). The user authorized credential submission and official Cloudflare Super Slurper migration, with existing objects skipped and the source preserved. The first full-bucket job reported success despite leaving most originals missing. Official selected-object repair through eight Super Slurper batches and a retry has now completed: independent R2 pagination finds 78,009 of the 78,016 frozen source objects, with every present original matching source size. The seven remaining exceptions are four SVGs, two HTML files and one zero-byte source object. At 10:15Z, all 78,009 present originals passed read-back content verification against the backup or authenticated source checksum, with no content mismatches; the seven missing objects remain explicitly pending. Article processing is complete for all 2,844 supported source objects. Seventeen GIF failures required a temporary local first-frame recovery, with generated derivatives checked for hashes, MIME, dimensions and single-frame output. The backend now includes a portable Pillow recovery for GIF derivative 5xx responses, verified against all 17 historical cases and by regression tests; its UCloud backend rollout completed at 15:56Z, with API/avatar processes restarted, the dedicated image worker and hourly reconciliation installed, and a real default-avatar queue job read-back verified. All 67 backend tests and dependency checks passed on the server; a genuine new upload and a production GIF 5xx recovery were not artificially triggered. The other-directory batch contains 75,163 supported objects. At 15:09Z, its saved state was 72,495 done, 27 failed and 2,641 pending; the remaining 2,668 objects were handed to the direct-connection recovery process using the updated GIF fallback. The earlier four 404 responses recovered during read-only checks; persistent GIF 503 responses and one GIF's 405 processing responses remain tracked for recovery and final verification. The first independent read-back pass finished at 10:46Z, covering 31,026 sources including all articles and 34,427 derivative objects, with no unresolved failures; 83 source-confirmed preset canvas/format exceptions are recorded separately. A fresh source listing at 10:21–10:25Z found 78,031 objects: 15 new avatars, no changed or removed frozen objects. All 15 additions and their small variants were synchronized and read-back verified at 10:33Z. Remaining derivative coverage and a final live-source reconciliation are still required. Missing `svg/404.svg` and `svg/500.svg` are confirmed dependencies of the error pages, so the seven original exceptions cannot all be treated as unused legacy files. Final migration acceptance has not been reached. Bucket-scoped R2 S3 credentials are saved outside the repositories and real read/write checks passed. Default-avatar test objects are repaired: the original is 610×610 and `!small` is 40×40, both with verified read-back hashes. An earlier experimental Worker still exists and must not be used as the final overseas origin. The chosen image hostname `img.cheatsheet.store` now has an active Cloudflare zone, active R2 custom-domain certificate and deployed cache/response-header rules. The initial browser checks covered original/derivative reads, ordinary-image hits and avatar/query/404 bypass. After the approved cache update at 15:49Z, avatars also hit the CDN with a 1-hour browser TTL; only query-bearing requests and errors bypass the edge cache. Production frontend deployment remains pending. The authoritative DNS for `hellogithub.com` remains on AliDNS. Complete original reconciliation, historical derivative generation and full verification are required before enabling the overseas origin.

Rollback: rebuild and deploy the overseas frontend with an empty image setting. Domestic routing and database URLs do not require changes.
