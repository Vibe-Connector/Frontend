import client from './client';

// ── Spotify 트랙 검색 응답 ──

export interface SpotifyTrackResponse {
  spotifyId: string;
  trackName: string;
  artists: string[];
  albumName: string | null;
  albumCoverUrl: string | null;
  albumCoverMediumUrl: string | null;
  albumCoverSmallUrl: string | null;
  previewUrl: string | null;
  spotifyUri: string | null;
  spotifyUrl: string | null;
  durationMs: number | null;
  isrc: string | null;
}

// ── API 함수 ──

/** ISRC로 Spotify 트랙 검색 */
export const searchByIsrc = (isrc: string): Promise<SpotifyTrackResponse> =>
  client.get('/spotify/search', { params: { isrc } });

/** MusicBrainz ID로 Spotify 트랙 검색 */
export const searchByMbid = (mbid: string): Promise<SpotifyTrackResponse> =>
  client.get('/spotify/search', { params: { mbid } });

/** 트랙명 + 아티스트로 Spotify 트랙 검색 */
export const searchByQuery = (query: string, artist?: string): Promise<SpotifyTrackResponse> =>
  client.get('/spotify/search', { params: { query, artist } });

/** 아이템의 ISRC 또는 MBID로 Spotify 정보 검색 (범용) */
export const searchSpotifyTrack = (params: {
  isrc?: string | null;
  mbid?: string | null;
  query?: string | null;
  artist?: string | null;
}): Promise<SpotifyTrackResponse> => {
  const cleanParams: Record<string, string> = {};
  if (params.isrc) cleanParams.isrc = params.isrc;
  else if (params.mbid) cleanParams.mbid = params.mbid;
  else if (params.query) {
    cleanParams.query = params.query;
    if (params.artist) cleanParams.artist = params.artist;
  }
  return client.get('/spotify/search', { params: cleanParams });
};
