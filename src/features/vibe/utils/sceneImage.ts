const S3_BASE =
  'https://vibeconnector1.s3.ap-northeast-2.amazonaws.com/vibe-scenes';

export function getSceneImageUrl(
  placeKey: string,
  companionKey: string,
): string {
  return `${S3_BASE}/${placeKey}_${companionKey}.png`;
}
