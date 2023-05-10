export const parseQueries = (url: string) => {
  const params = {} as { [key: string]: string };
  const queryString = url.split('?')[1];
  if (queryString) {
    const keyValuePairs = queryString.split('&');
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return params;
};
