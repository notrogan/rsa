export function generateShortUUID() {
  const result = Math.random().toString(36).substring(2,10);
  // console.log(result);
  return result;
}
