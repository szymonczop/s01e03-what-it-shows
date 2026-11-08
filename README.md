# S01E03 · what it shows

Support ticket #4471 merged 412 reports about dates as one known issue. It is really three problems:

| Issue | Problem | Reports |
|---|---|---|
| [#1](https://github.com/szymonczop/s01e03-what-it-shows/issues/1) | Shared date parser reads day-first dates month first | 374 |
| [#2](https://github.com/szymonczop/s01e03-what-it-shows/issues/2) | `booking-v3` form hint says `MM/DD/YYYY` but the form reads day first | 33 |
| [#3](https://github.com/szymonczop/s01e03-what-it-shows/issues/3) | Bookings move by one day (time zone shift) | 5 |

## The kb page

- Source (.svx): [`support-kb/src/routes/kb/incidents/4471/split/+page.svx`](support-kb/src/routes/kb/incidents/4471/split/+page.svx)
- Its logic: [`support-kb/src/lib/kb/split.ts`](support-kb/src/lib/kb/split.ts) and [`SplitTable.svelte`](support-kb/src/lib/kb/SplitTable.svelte)
- As the desk sees it (rendered HTML): [`rendered/kb/incidents/4471/split.html`](rendered/kb/incidents/4471/split.html)
- Signed with the course ticket from start-challenge (frontmatter `signature`) · desk ref `DR-NEE9-CSNT`

`support-kb/` is the kb export from the course, with the page added. `rendered/` is the whole kb, built with SvelteKit and mdsvex using the files in `render-setup/`. To rebuild: copy `support-kb/src` next to `render-setup/`, put `app.html` in `src/`, put `layout.ts` in `src/routes/` as `+layout.ts`, then run `npm i && npx vite build`.
