export function getProps(source, fields) {
  return fields.reduce((query, key) => {
    if (source[key] !== undefined)
      query[key] = source[key];
    return query;
  }, {});
}
