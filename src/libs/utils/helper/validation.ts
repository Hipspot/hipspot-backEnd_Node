export const isNumber = (v: string) => {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(v);
};
export const isContactNum = (v: string) => {
  const contactNumRegex = /^[0-9]{2,4}[-]+[0-9]{3,4}[-]+[0-9]{4}$/;
  return contactNumRegex.test(v);
};
