export const setValueToNestedObj = (
  obj: object = {},
  path: string[],
  value: string | null,
  updateValue = false,
) => {
  if (!Array.isArray(path) || path.length === 0) {
    return;
  }
  if (path.length === 1) {
    if (updateValue === false) {
      if (!obj[path[0]] && value === null) {
        obj[path[0]] = null;
        return;
      } else if (obj[path[0]] === undefined) {
        obj[path[0]] = [value];
        return;
      } else {
        if (!value) return;

        obj[path[0]] = [obj[path[0]], value].flat();
        return;
      }
    }

    if (updateValue === true) {
      obj[path[0]] = value;
      return;
    }
  }
  obj[path[0]] = obj[path[0]] || {};

  return setValueToNestedObj(obj[path[0]], path.slice(1), value, updateValue);
};
