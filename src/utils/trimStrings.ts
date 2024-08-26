export const trimStrings = (obj: any): any => {
  if (typeof obj === 'string') {
    return obj.trim();
  } else if (Array.isArray(obj)) {
    return obj.map(trimStrings);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = trimStrings(obj[key]);
      return acc;
    }, {} as any);
  } else {
    return obj;
  }
};