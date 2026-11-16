// Confusion matrix tracking for ear training (pure).

export interface ConfusionMatrix {
  // rows = presented item key, cols = chosen answer key
  rows: Record<string, Record<string, number>>;
}

export function emptyMatrix(): ConfusionMatrix { return { rows: {} }; }

export function record(m: ConfusionMatrix, presented: string, chosen: string): ConfusionMatrix {
  const rows = { ...m.rows };
  if (!rows[presented]) rows[presented] = {};
  rows[presented] = { ...rows[presented], [chosen]: (rows[presented]![chosen] ?? 0) + 1 };
  return { rows };
}

export function accuracyFor(m: ConfusionMatrix, presented: string): number {
  const row = m.rows[presented];
  if (!row) return 0;
  const total = Object.values(row).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return (row[presented] ?? 0) / total;
}

export function mostConfused(m: ConfusionMatrix, presented: string): string | null {
  const row = m.rows[presented];
  if (!row) return null;
  let best: string | null = null;
  let bestN = 0;
  for (const [k, v] of Object.entries(row)) {
    if (k !== presented && v > bestN) { bestN = v; best = k; }
  }
  return best;
}

export function totals(m: ConfusionMatrix): { presented: number; correct: number; total: number } {
  let presented = 0, correct = 0, total = 0;
  for (const [p, row] of Object.entries(m.rows)) {
    presented++;
    for (const [c, n] of Object.entries(row)) {
      total += n;
      if (c === p) correct += n;
    }
  }
  return { presented, correct, total };
}
