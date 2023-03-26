export const calcRating = (star: number, review: number) =>
  star + Math.log(review) / Math.log(10);
