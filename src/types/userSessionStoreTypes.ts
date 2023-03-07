export interface Sermon {
  id: string;
  title: string;
  artist: Artist | undefined;
  isPartOfAlbum: boolean;
  album: Album;
  url: string;
  filename: string;
  artistId: string;
  albumId: string;
  genreId: string;
  year: string;
  date: string | null;
  track: string;
  playtime: number;
  bitrate: string;
  comment: string;
  tags: string;
  externalUrl: string;
  numPlayed: number;
  numDownloaded: number;
  numRecommended: number;
  recommend: string;
  filedate: string;
  hash: string;
  dateLastDownload: string;
  dateLastPlay: string;
  downloadable: boolean;
  disabled: string;
  createdAt: string;
  updatedAt: string;
  Genres: Genre[] | undefined;
  Passages: Passage[] | undefined;
  passagesString: string;
  downloadUrl: string;
  downloadSeries: string;
  groupalbum: boolean | undefined;
  isVideo: boolean;
}

export interface NoFilter {
  id: 'none';
  name: string;
  numTitles: 0;
}

export interface Passage {
  id: string;
  passageBookId: string;
  chapter: string;
  numTitles: number;
  createdAt: string;
  updatedAt: string;
  PassageBook: PassageBook;
}

export interface PassageBook {
  id: string;
  short: string;
  long: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
  numTitles: number;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  name: string;
  artistName: string;
  numTitles: number;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  numTitles: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumTitles {
  id: string;
  titles: Sermon[];
}

export interface LocalSermonsFileEntry {
  id: string;
}

export interface Book {
  id: string;
  short: string;
  name: string;
  long: string;
  numTitles?: number;
}

export interface Chapter {
  name: string;
  chapter: string;
  id: string;
  numTitles: string;
  count: string;
}

export type SortOption =
  | 'title'
  | 'year'
  | 'playtime'
  | 'g.name'
  | 'a.name'
  | 't.filename'
  | 'listen'
  | 'new';
