// Splits one merged ticket into the problems its reports actually describe.
// causes.ts places a report by tenant and booking form, and counts stay where it files them,
// as on the desk's own CauseTable. The desk's notes (desk-notes.json) mark the reports whose date
// moved by one day: their own problem, shown as a third row, but still counted under their cause.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // true for the one-day row: its reports are also counted in the row of their cause.
  alsoCounted: boolean;
  tenants: string[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};


export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; exportRows: number; groups: ProblemGroup[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const byProblem = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p: Problem = causeOf(r, tenantOf(r)) ?? 'unplaced';
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) byProblem.set('one-day', moved);
  const groups = [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        alsoCounted: problem === 'one-day',
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { total: merged.length, exportRows: all.filter((r) => r.mergedInto === ticket).length, groups };
}
