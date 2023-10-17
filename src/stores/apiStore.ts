import axios from 'axios';
import {makeObservable, observable, action, runInAction} from 'mobx';
import {RootStore} from './rootStore';
import {
  ApiSermon,
  ApiAlbumTitles,
  Collection,
  ApiCollectionTitles,
  ApiArtist,
  ApiGenre,
  ApiBook,
  ApiChapter,
} from '../types/apiStoreTypes';
import {Artist, Book, Genre, NoFilter} from '../types/userSessionStoreTypes';
import {strings} from '../strings';
export enum Endpoints {
  title = 'title',
  all = 'all',
  collection = 'collection',
  artist = 'artist',
  genre = 'genre',
  book = 'book',
  Chapter = 'chapter',
  CountApi = 'count',
}

enum Parameter {
  paramNew = 'n',
  paramAlbum = 'c',
  paramCollection = 'u',
  paramSearch = 'q',
  paramPage = 'p',
  paramGenre = 'g',
  paramArtist = 'a',
  paramBook = 'b',
  paramChapter = 'k',
}

interface ApiResponse {
  titles: ApiSermon[];
  paging: {total: number; titles_per_page: number; page: number};
}

export class ApiStore {
  root: RootStore;
  baseURL: string = strings.url;
  isLoading: boolean = false;
  isLoadingAllSermons: boolean = false;
  isLoadingNewSermons: boolean = false;
  isLoadingSearch: boolean = false;
  isLoadingFilterData: boolean = false;
  newSermons: ApiSermon[] = [];
  newSermonsLoadedPages: number = 0;
  collections: Collection[] = [];
  artists: ApiArtist[] = [];
  genres: ApiGenre[] = [];
  books: ApiBook[] = [];
  chapters: ApiChapter[] = [];
  allSermons: ApiSermon[] = [];
  allSermonsSearchUrl = `${this.baseURL}${Endpoints.all}?`;
  searchedSermons: ApiSermon[] = [];
  allSermonsLoadedPages: number = 0;
  allSermonsTotal?: number = undefined;
  newSermonsTotal?: number = undefined;
  searchedSermonsLoadedPages: number = 0;
  albumsWithTitles: ApiAlbumTitles[] = [];
  collectionsWithTitles: ApiCollectionTitles[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this, {
      isLoading: observable,
      isLoadingNewSermons: observable,
      isLoadingAllSermons: observable,
      isLoadingSearch: observable,
      isLoadingFilterData: observable,
      newSermons: observable,
      collections: observable,
      artists: observable,
      genres: observable,
      books: observable,
      chapters: observable,
      allSermons: observable,
      searchedSermons: observable,
      albumsWithTitles: observable,
      collectionsWithTitles: observable,
      newSermonsTotal: observable,
      allSermonsTotal: observable,
    });
  }

  private fetchNewSermons = async (page: number) => {
    const titles = await this.fetchTitles(
      `${this.baseURL}${Endpoints.title}?${Parameter.paramNew}=1&${Parameter.paramPage}=${page}`,
    );
    return titles.titles;
  };

  private fetchCollections = async () => {
    let collections: Collection[] = [];
    collections = await this.fetchData(
      `${this.baseURL}${Endpoints.collection}`,
    );
    return collections;
  };

  private fetchAllSermons = async (page: number) => {
    const titles = await this.fetchTitles(
      `${this.allSermonsSearchUrl}${Parameter.paramPage}=${page}`,
    );
    return titles.titles;
  };

  private fetchSearchedSermons = async (page: number, searchString: string) => {
    const titles = await this.fetchTitles(
      `${this.baseURL}${Endpoints.title}?${Parameter.paramSearch}=${searchString}&&${Parameter.paramPage}=${page}`,
    );
    return titles.titles;
  };

  private fetchAlbumTitles = async (
    albumId: string,
    page?: number,
  ): Promise<ApiResponse> => {
    const titles = await this.fetchTitles(
      `${this.baseURL}${Endpoints.title}?${Parameter.paramAlbum}=${albumId}&p=${
        page ? page : 1
      }`,
    );
    return titles;
  };

  private fetchCollectionTitles = async (
    collectionId: string,
  ): Promise<ApiSermon[]> => {
    let titles = await this.fetchTitles(
      `${this.baseURL}${Endpoints.title}?${Parameter.paramCollection}=${collectionId}`,
    );
    return titles.titles;
  };

  private fetchTitles = async (url: string): Promise<ApiResponse> => {
    console.log(url);
    const response = await this.fetchData(url);
    return {titles: response.titles, paging: response.paging};
  };

  private fetchData = action(async (url: string): Promise<any> => {
    let data: any[] = [];
    this.isLoading = true;
    data = await axios.get(url).then(response => response.data);
    runInAction(() => {
      this.isLoading = false;
    });
    return data;
  });

  updateNewSermons = action(async () => {
    runInAction(() => (this.isLoadingNewSermons = true));
    if (
      this.newSermonsTotal !== undefined &&
      this.newSermons.length < this.newSermonsTotal
    ) {
      const titles = await this.fetchNewSermons(this.newSermonsLoadedPages + 1);
      runInAction(() => {
        this.newSermonsLoadedPages = this.newSermonsLoadedPages + 1;
        this.newSermons = this.newSermons.concat(
          titles.filter(
            // This filter is needed because we sometimes have duplicates on 2. page - api error
            title => !this.newSermons.some(sermon => sermon.id === title.id),
          ),
        );
      });
    }
    runInAction(() => (this.isLoadingNewSermons = false));
  });

  updateCollections = action(async () => {
    const collections = await this.fetchCollections();
    runInAction(() => {
      this.collections = collections;
    });
  });

  clearAllSermons = action(() => {
    this.allSermons = [];
    this.allSermonsLoadedPages = 0;
    this.allSermonsTotal = undefined;
    this.updateAllSermonsSearchUrl();
  });

  resetAllSermons = action(async () => {
    this.clearAllSermons();
    await this.updateAllSermonsTotal();
  });

  resetNewSermons = action(async () => {
    this.newSermons = [];
    this.newSermonsLoadedPages = 0;
    this.newSermonsTotal = undefined;
    await this.updateNewSermonsTotal();
  });

  updateAllSermonsSearchUrl = action(() => {
    let parameterString = '';
    if (
      !this.root.filterStore.filteredArtist &&
      !this.root.filterStore.filteredGenre &&
      !this.root.filterStore.filteredBook
    ) {
      this.allSermonsSearchUrl = `${this.baseURL}${Endpoints.all}?s=${this.root.userSessionStore.sortParameter}&`;
      return;
    }
    if (this.root.filterStore.filteredArtist) {
      parameterString =
        parameterString +
        `${Parameter.paramArtist}=${this.root.filterStore.filteredArtist.id}&`;
    }
    if (this.root.filterStore.filteredBook) {
      parameterString =
        parameterString +
        `${Parameter.paramBook}=${this.root.filterStore.filteredBook.id}&`;
    }
    if (this.root.filterStore.filteredGenre) {
      parameterString =
        parameterString +
        `${Parameter.paramGenre}=${this.root.filterStore.filteredGenre.id}&`;
    }
    if (this.root.filterStore.filteredChapter) {
      parameterString =
        parameterString +
        `${Parameter.paramChapter}=${this.root.filterStore.filteredChapter.id}&`;
    }
    this.allSermonsSearchUrl = `${this.baseURL}${Endpoints.title}?${parameterString}s=${this.root.userSessionStore.sortParameter}&`;
  });

  updateAllSermons = action(async (paging = false) => {
    if (!paging) {
      runInAction(() => (this.isLoadingAllSermons = true));
    }

    if (
      this.allSermonsTotal !== undefined &&
      this.allSermons.length < this.allSermonsTotal
    ) {
      const titles = await this.fetchAllSermons(this.allSermonsLoadedPages + 1);
      runInAction(() => {
        this.allSermonsLoadedPages = this.allSermonsLoadedPages + 1;
        this.allSermons = this.allSermons.concat(titles);
      });
    }
    if (!paging) {
      runInAction(() => (this.isLoadingAllSermons = false));
    }
  });

  updateSearchedSermons = action(
    async (searchString: string, newSearch?: boolean) => {
      runInAction(() => {
        this.isLoadingSearch = true;
      });
      const titles = await this.fetchSearchedSermons(
        newSearch ? 1 : this.searchedSermonsLoadedPages + 1,
        searchString,
      );
      runInAction(() => {
        this.searchedSermonsLoadedPages = this.searchedSermonsLoadedPages + 1;
        this.searchedSermons = newSearch
          ? titles
          : this.searchedSermons.concat(titles);
        this.isLoadingSearch = false;
      });
    },
  );

  updateAlbumTitles = action(async (albumId: string) => {
    if (!this.albumsWithTitles.find(album => album.id === albumId)) {
      const update = (titles: ApiSermon[]) => {
        runInAction(() => {
          this.albumsWithTitles = this.albumsWithTitles.concat([
            {
              id: albumId,
              titles: titles,
            },
          ]);
        });
      };

      const response = await this.fetchAlbumTitles(albumId);
      if (response.paging.titles_per_page >= response.paging.total) {
        update(response.titles);
      } else {
        let titles: ApiSermon[] = response.titles;
        let page = 1;
        const totalPages = Math.ceil(
          response.paging.total / response.paging.titles_per_page,
        );
        while (page < totalPages) {
          page = page + 1;
          const pagedResponse = await this.fetchAlbumTitles(albumId, page);
          titles = titles.concat(pagedResponse.titles);
        }
        update(titles);
      }
    }
  });

  updateCollectionTitles = action(async (collectionId: string) => {
    if (
      !this.collectionsWithTitles.find(
        collection => collection.id === collectionId,
      )
    ) {
      const titles = await this.fetchCollectionTitles(collectionId);
      runInAction(() => {
        this.collectionsWithTitles = this.collectionsWithTitles.concat([
          {
            id: collectionId,
            titles: titles,
          },
        ]);
      });
    }
  });

  updateAllSermonsTotal = action(async () => {
    runInAction(() => (this.isLoadingAllSermons = true));
    const data = await this.fetchData(this.allSermonsSearchUrl);
    runInAction(() => {
      this.allSermonsTotal = data.paging.total;
    });
    runInAction(() => (this.isLoadingAllSermons = false));
  });

  updateNewSermonsTotal = action(async () => {
    const data = await this.fetchData(
      `${this.baseURL}${Endpoints.title}?${Parameter.paramNew}=1`,
    );
    runInAction(() => {
      this.newSermonsTotal = data.paging.total;
    });
  });

  triggerTitleCount = (id: string) => {
    axios.get(`${this.baseURL}${Endpoints.CountApi}/${id}`);
  };

  getFilterData = action(
    async (
      endpoint: string,
      parameter?: {name: string; value: string | undefined}[],
    ) => {
      let url = `${this.baseURL}${endpoint}`;
      if (parameter && parameter.length) {
        url = url + '?';
        parameter.forEach(par => {
          if (par.value) {
            url = url + `${par.name}=${par.value}&`;
          }
        });
      }
      return this.fetchData(url);
    },
  );

  updateFilterData = action(
    async (
      artist: Artist | NoFilter | undefined,
      genre: Genre | NoFilter | undefined,
      book: Book | NoFilter | undefined,
    ) => {
      runInAction(() => {
        this.isLoadingFilterData = true;
      });
      const artistParameter = artist?.id === 'none' ? undefined : artist?.id;
      const genreParameter = genre?.id === 'none' ? undefined : genre?.id;
      const bookParameter = book?.id === 'none' ? undefined : book?.id;

      await Promise.all([
        this.getFilterData(Endpoints.artist, [
          {name: Parameter.paramGenre, value: genreParameter},
          {name: Parameter.paramBook, value: bookParameter},
        ]),
        this.getFilterData(Endpoints.genre, [
          {name: Parameter.paramArtist, value: artistParameter},
          {name: Parameter.paramBook, value: bookParameter},
        ]),
        this.getFilterData(Endpoints.book, [
          {name: Parameter.paramArtist, value: artistParameter},
          {name: Parameter.paramGenre, value: genreParameter},
        ]),
        this.getFilterData(Endpoints.Chapter, [
          {name: Parameter.paramArtist, value: artistParameter},
          {name: Parameter.paramGenre, value: genreParameter},
          {name: Parameter.paramBook, value: bookParameter},
        ]),
      ]).then(data => {
        runInAction(() => {
          this.artists = data[0];
          this.genres = data[1];
          this.books = data[2];
          this.chapters = data[3];
        });
      });

      runInAction(() => {
        this.isLoadingFilterData = false;
      });
    },
  );
}
