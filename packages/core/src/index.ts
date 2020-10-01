export const add = (a: number, b: number, c: number): number => a + b + c;

if (require.main == module) {
  console.log(`Adding a + b = `, add(5, 5, 5));
}
