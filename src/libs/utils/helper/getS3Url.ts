export const getS3ImageUrl = ({ cafeId, key = 'store', value }) =>
  `https://hipspot.s3.ap-northeast-2.amazonaws.com/${cafeId}/${key}/${value}`;

export const getThumbNailUrl = (cafeId: string) =>
  `https://hipspot.s3.ap-northeast-2.amazonaws.com/${cafeId}/thumbNail.jpg`;
