import {makeObservable, observable, computed, action} from 'mobx';
import {RootStore} from './rootStore';
import {ApiSermon, Collection} from '../types/apiStoreTypes';
import {
  Sermon,
  AlbumTitles,
  LocalSermonsFileEntry,
  Artist,
  Genre,
  Book,
  Chapter,
  SortOption,
  NoFilter,
} from '../types/userSessionStoreTypes';
import {strings} from '../strings';

export class UserSessionStore {
  root: RootStore;
  selectedSermon: Sermon | undefined = undefined;
  localSermons: LocalSermonsFileEntry[] = [];

  sortParameter: SortOption = 'title';

  playerModalVisible = false;
  artistModalVisible = false;
  commentModalVisible = false;
  infoModalVisible = false;
  infoCollectionModalVisible = false;

  sleepTimerProgress: number | undefined = undefined;
  sleepTimerInterval?: number | NodeJS.Timeout;

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this, {
      localSermons: observable,
      newSermons: computed,
      collections: computed,
      artists: computed,
      genres: computed,
      books: computed,
      chapters: computed,
      allSermons: computed,
      searchedSermons: computed,
      downloadedSermons: computed,
      currentAlbumTitles: computed,
      currentCollectionTitles: computed,
      selectedSermon: observable,
      playerModalVisible: observable,
      artistModalVisible: observable,
      commentModalVisible: observable,
      infoModalVisible: observable,
      infoCollectionModalVisible: observable,
      sleepTimerProgress: observable,
      sortParameter: observable,
      localPathMp3: computed,
      selectedSermonAlbumTitles: computed,
    });
  }

  setSelectedSermon = action((sermon: Sermon) => {
    this.selectedSermon = sermon;
  });

  get selectedSermonIsVideo() {
    return (
      this.selectedSermon?.url.substr(
        this.selectedSermon?.url.length - 3,
        3,
      ) === 'mp4'
    );
  }

  setPlayerModalVisible = action((visible: boolean) => {
    this.playerModalVisible = visible;
  });

  setArtistModalVisible = action((visible: boolean) => {
    this.artistModalVisible = visible;
  });

  setInfoModalVisible = action((visible: boolean) => {
    this.infoModalVisible = visible;
  });

  setCommentModalVisible = action((visible: boolean) => {
    this.commentModalVisible = visible;
  });

  setInfoCollectionModalVisible = action((visible: boolean) => {
    this.infoCollectionModalVisible = visible;
  });

  setSleepTimer = action((value: number | undefined) => {
    this.sleepTimerProgress = value;
  });

  activateSleepTimer = action((durationInMinutes: number) => {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval as NodeJS.Timeout);
      this.sleepTimerProgress = undefined;
    }
    this.setSleepTimer(durationInMinutes * 60);

    const timerCallback = () => {
      if (this.sleepTimerProgress === 0 || !this.sleepTimerProgress) {
        this.setSleepTimer(undefined);
      } else {
        this.setSleepTimer(this.sleepTimerProgress - 1);
      }
    };

    this.sleepTimerInterval = setInterval(timerCallback, 1000);
  });

  stopSleepTimer = action(() => {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval as NodeJS.Timeout);
      this.setSleepTimer(undefined);
    }
  });

  get newSermons(): Sermon[] {
    return this.mapTitles(this.root.apiStore.newSermons);
  }

  get collections(): Collection[] {
    return this.root.apiStore.collections;
  }

  get artists(): (NoFilter | Artist)[] {
    return [
      {id: 'none', name: strings.notFiltered, numTitles: 0},
      ...this.root.apiStore.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        numTitles: Number(artist.num_titles),
        description: artist.description,
        image: artist.image,
        createdAt: artist.created_at,
        updatedAt: artist.updated_at,
      })),
    ];
  }

  get genres(): (NoFilter | Genre)[] {
    return [
      {id: 'none', name: strings.notFiltered, numTitles: 0},
      ...this.root.apiStore.genres.map(genre => ({
        id: genre.id,
        name: genre.name,
        numTitles: Number(genre.num_titles),
        createdAt: genre.created_at,
        updatedAt: genre.updated_at,
      })),
    ];
  }

  get books(): (NoFilter | Book)[] {
    return [
      {id: 'none', name: strings.notFiltered, numTitles: 0},
      ...this.root.apiStore.books.map(book => ({
        id: book.id,
        name: book.long,
        short: book.short,
        long: book.long,
        numTitles: book.num_titles,
      })),
    ];
  }

  get chapters(): (NoFilter | Chapter)[] {
    return [
      {id: 'none', name: strings.notFiltered, numTitles: 0},
      ...this.root.apiStore.chapters.map(chapter => ({
        chapter: chapter.chapter,
        name: chapter.chapter,
        id: chapter.id,
        numTitles: chapter.num_titles,
        count: chapter.count,
      })),
    ];
  }

  get allSermons(): Sermon[] {
    return this.mapTitles(this.root.apiStore.allSermons);
  }

  get downloadedSermons(): Sermon[] {
    return [];
  }

  get searchedSermons(): Sermon[] {
    return this.mapTitles(this.root.apiStore.searchedSermons);
  }

  get currentAlbumTitles(): AlbumTitles[] {
    return this.root.apiStore.albumsWithTitles.map(album => ({
      id: album.id,
      titles: this.mapTitles(album.titles),
    }));
  }

  get selectedSermonAlbumTitles() {
    return this.currentAlbumTitles.find(
      album => album.id === this.selectedSermon?.albumId,
    )?.titles;
  }

  get currentCollectionTitles(): AlbumTitles[] {
    return this.root.apiStore.collectionsWithTitles.map(collection => ({
      id: collection.id,
      titles: this.mapTitles(collection.titles),
    }));
  }

  get localPathMp3(): string | undefined {
    if (!this.selectedSermon) return;
    return this.root.storageStore.sermonsDownloaded.find(
      dlSermon => dlSermon.id === this.selectedSermon?.id,
    )
      ? `${this.root.storageStore.localPathBase}/${this.selectedSermon.id}.mp3`
      : undefined;
  }

  mapTitles = (apiTitles: ApiSermon[]): Sermon[] => {
    return apiTitles.map(sermon => ({
      id: sermon.id,
      title: sermon.title,
      artist: {
        id: sermon.Artist.id,
        name: sermon.Artist.name,
        numTitles: Number(sermon.Artist.num_titles),
        hide: sermon.Artist.hide,
        description: sermon.Artist.description,
        image: `${strings.base}data/redner/${sermon.Artist.image}`.replace(
          /\s/g,
          '%20',
        ),
        createdAt: sermon.Artist.created_at,
        updatedAt: sermon.Artist.updated_at,
      },
      isPartOfAlbum: Number(sermon.Album.num_titles) > 1,
      album: {
        name: sermon.Album.name,
        id: sermon.Album.id,
        artistName: sermon.Album.artist_name,
        numTitles: Number(sermon.Album.num_titles),
        createdAt: sermon.Album.created_at,
        updatedAt: sermon.Album.updated_at,
      },
      url: sermon.external_url ?? sermon.url,
      filename: sermon.filename,
      artistId: sermon.album_id,
      albumId: sermon.album_id,
      genreId: sermon.genre_id,
      year: sermon.year,
      externalUrl: sermon.external_url,
      date: sermon.date,
      track: sermon.track,
      playtime: Number(sermon.playtime) - 2,
      bitrate: sermon.bitrate,
      comment: sermon.comment,
      tags: sermon.tags,
      numPlayed: Number(sermon.num_played),
      numDownloaded: Number(sermon.num_downloaded),
      numRecommended: Number(sermon.num_recommended),
      recommend: sermon.recommend,
      filedate: sermon.filedate,
      hash: sermon.hash,
      dateLastDownload: sermon.date_last_download,
      dateLastPlay: sermon.date_last_play,
      downloadable: sermon.downloadable,
      disabled: sermon.disabled,
      createdAt: sermon.created_at,
      updatedAt: sermon.updated_at,
      Genres: sermon.Genres?.map(genre => ({
        id: genre.id,
        name: genre.name,
        numTitles: Number(genre.num_titles),
        createdAt: genre.created_at,
        updatedAt: genre.updated_at,
      })),
      Passages: sermon.Passages?.map(passage => ({
        id: passage.id,
        passageBookId: passage.passage_book_id,
        chapter: passage.chapter,
        numTitles: Number(passage.num_titles),
        createdAt: passage.created_at,
        updatedAt: passage.updated_at,
        PassageBook: {
          id: passage.PassageBook.id,
          short: passage.PassageBook.short,
          long: passage.PassageBook.long,
          name: passage.PassageBook.long,
        },
      })),
      passagesString: sermon.passages,
      downloadUrl: sermon.download_url,
      downloadSeries: sermon.download_series,
      groupalbum: sermon.groupalbum,
      isVideo: sermon.url?.substr(sermon.url.length - 3, 3) === 'mp4',
    }));
  };

  updateSortParameter = action((sortBy: SortOption) => {
    this.sortParameter = sortBy;
  });
}
