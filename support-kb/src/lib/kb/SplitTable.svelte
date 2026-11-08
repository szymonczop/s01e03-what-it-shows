<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/split';

  // issues: problem → { title, href } of the ticket filed for it.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Problem, { title: string; href: string }>> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const tags = (t: Record<string, number>) =>
    Object.entries(t)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
  // Reports intake tagged as the other cause. Only parser and hint have a matching tag.
  const mistagged = (p: Problem, t: Record<string, number>) =>
    p === 'parser' || p === 'hint' ? Object.entries(t).filter(([tag]) => tag !== p).reduce((n, [, c]) => n + c, 0) : null;
</script>

<p class="sum">
  <strong>{split.total}</strong> reports merged into #{ticket}
  ({split.exportRows - split.total} export rows were repeats of the same id) ·
  <strong>{split.groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>intake tagged as</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      {@const off = mistagged(g.problem, g.taggedAs)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td><strong>{g.reports.length}</strong></td>
        <td title={g.tenants.join(', ')}>{g.tenants.length}</td>
        <td class="tags">{tags(g.taggedAs)}{#if off}<br /><span class="off">{off} tagged as the other cause</span>{/if}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if issues[g.problem]}<a href={issues[g.problem]?.href}>{issues[g.problem]?.title}</a>{:else}<span class="off">none filed</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .off { color: var(--warn); font-size: 0.85em; }
</style>
