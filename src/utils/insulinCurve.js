export function makeInsulin({ start, peak, end }, dose) {
  const tp = peak - start;
  const td = end - start;
  if (!(tp > 0 && tp < td / 2)) {
    throw new Error('Нужно: пик − начало < (конец − начало) / 2');
  }
  const tau = (tp * (1 - tp / td)) / (1 - (2 * tp) / td);
  const a = (2 * tau) / td;
  const S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

  const at = (t) => {
    const x = t - start;
    if (x <= 0 || x >= td) return 0;
    return dose * (S / tau ** 2) * x * (1 - x / td) * Math.exp(-x / tau);
  };

  const points = [];
  for (let t = 0; t <= end + 30; t += 5) points.push([t, at(t)]);
  return { points, peakY: at(peak) };
}