const sortAlphabeticalByKey = (key) => (a, b) => {
  const valueA = (a[key] || '').toLowerCase();
  const valueB = (b[key] || '').toLowerCase();
  if (valueA < valueB)
    return -1;
  if (valueA > valueB)
    return 1;
  return 0;
};

const sortNumericallyByKey = (key) => (a, b) => {
  const valueA = a[key];
  const valueB = b[key];
  if (valueA < valueB)
    return -1;
  if (valueA > valueB)
    return 1;
  return 0;
};

export {
  sortAlphabeticalByKey,
  sortNumericallyByKey,
};