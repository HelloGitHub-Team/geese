# Arena leaderboard brand assets

Retrieved from Arena’s official website on 2026-09-20.

- `arena.svg`: https://arena.ai/cms/icons/favicon.svg
- Arena rebrand announcement: https://arena.ai/blog/lmarena-is-now-arena
- Provider SVGs: inline brand icons from https://arena.ai/leaderboard/text, https://arena.ai/leaderboard/text-to-image and https://arena.ai/leaderboard/text-to-video
- `providers.json` maps the displayed organization names to local asset paths.

Only presentation attributes were normalized: the Arena icon uses fixed `#242422` without system theme media queries; provider `currentColor` values use `#242422`, CSS-only black fills use `#242422`, and application classes and inline layout styles were removed. Original paths and brand colors are preserved.

Apply the application’s `dark:invert` class only to the Arena icon. Display provider icons on a white tile in both themes so colored and monochrome logos remain visible.

Brand marks belong to their respective owners and are included to identify leaderboard sources and model providers. No separate brand asset license was published with these pages.
