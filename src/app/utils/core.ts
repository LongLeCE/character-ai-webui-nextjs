const rangeInner = function* (
  start: number,
  end: number,
  step: number
): Generator<number, void, never> {
  if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
    return;
  }
  yield start;
  yield* rangeInner(start + step, end, step);
};

export const range = function* (
  start: number,
  end?: number,
  step: number = 1
): Generator<number, void, never> {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if ((step > 0 && end > start) || (step < 0 && end < start)) {
    yield* rangeInner(start, end, step);
  }
};
