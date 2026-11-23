// Tech stacks are sometimes saved as one comma-separated string; normalise to a flat list.
export function techList(stack) {
  return (stack ?? [])
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean);
}
