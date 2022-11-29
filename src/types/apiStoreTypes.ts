export interface ApiAlbum {
  id: string;
  name: string;
  artist_name: string;
  num_titles: string;
  created_at: string;
  updated_at: string;
}

export interface ApiArtist {
  id: string;
  name: string;
  num_titles: string;
  hide: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface ApiGenre {
  id: string;
  name: string;
  num_titles: string;
  created_at: string;
  updated_at: string;
}

export interface ApiPassage {
  id: string;
  passage_book_id: string;
  chapter: string;
  num_titles: string;
  created_at: string;
  updated_at: string;
  PassageBook: ApiPassageBook;
}

export interface ApiPassageBook {
  id: string;
  short: string;
  long: string;
}

export interface ApiSermon {
  id: string;
  title: string;
  filename: string;
  filename_ogg: null;
  artist_id: string;
  album_id: string;
  genre_id: string;
  year: string;
  date: string;
  track: string;
  playtime: string;
  bitrate: string;
  external_url: string;
  comment: string;
  tags: string;
  num_played: string;
  num_downloaded: string;
  num_recommended: string;
  recommend: string;
  filedate: string;
  hash: string;
  date_last_download: string;
  date_last_play: string;
  downloadable: boolean;
  disabled: string;
  created_at: string;
  updated_at: string;
  Album: ApiAlbum;
  Artist: ApiArtist;
  Genres: ApiGenre[];
  Passages: ApiPassage[];
  _year: string;
  genres: string;
  passages: string;
  url: string;
  groupalbum: boolean | undefined;
  download_url: string;
  download_series: string;
}

export interface ApiAlbumTitles {
  id: string;
  titles: ApiSermon[];
}

export interface ApiCollectionTitles {
  id: string;
  titles: ApiSermon[];
}

export interface Collection {
  id: string;
  pos: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiBook {
  id: string;
  short: string;
  long: string;
  num_titles: number;
}

export interface ApiChapter {
  chapter: string;
  id: string;
  num_titles: string;
  count: string;
}
