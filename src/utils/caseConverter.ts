import _ from 'lodash';

export const convertToCamelCase = (obj: { [key: string]: unknown }) => {
  return _.mapKeys(obj, (value, key: string) => _.camelCase(key));
};

export const convertToSnakeCase = (obj: { [key: string]: unknown }) => {
  return _.mapKeys(obj, (value, key: string) => _.snakeCase(key));
};