export function idGenerator() {
  return Date.now().toString(24) + Math.random().toString(24).slice(2, 6);
}