import stringify from './qs-stringify';

export const ITEMS_PER_PAGE = 10;

const LOCAL_API_HOST = 'https://hg-api.lcl101.cn';
// const LOCAL_API_HOST = 'http://127.0.0.1:8001';
const PRODUCTION_API_HOST = 'https://api.hellogithub.com';

export const API_ROOT_PATH = '/v1';

export const API_HOST =
  process.env.NEXT_PUBLIC_ENV === 'development'
    ? LOCAL_API_HOST
    : PRODUCTION_API_HOST;

/**
 * Generates a url to make an api call to our backend
 *
 * @param {string} path the path for the call
 * @param {Record<string, unknown>} parameters optional query params, {a: 1, b: 2} is parsed to "?a=1&b=2"
 * @returns {string}
 */
export const makeUrl = (
  path: string,
  parameters?: Record<string, unknown>
): string => {
  if (!parameters) {
    return `${API_HOST}${API_ROOT_PATH}${path}`;
  }

  // The following section parses the query params for convenience
  // E.g. parses {a: 1, b: 2} to "?a=1&b=2"
  const queryParameters = `?${stringify(parameters)}`;
  return `${API_HOST}${API_ROOT_PATH}${path}${queryParameters}`;
};

export const TOKEN_KEY = 'Authorization';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
