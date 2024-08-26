export const normalizeQuery = (query: string) => {
  const normalizedQuery = query
    .replace(/I/g, '\u04CF') // Replace 'I' with U+04CF
    .replace(/l/g, '\u04CF') // Replace 'l' with U+04CF
    .replace(/1/g, '\u04CF'); // Replace '1' with U+04CF

  return normalizedQuery;
}