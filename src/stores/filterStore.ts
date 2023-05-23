import {observable, makeObservable, action, computed} from 'mobx';
import {strings} from '../strings';
import {
  Artist,
  Book,
  Chapter,
  Genre,
  NoFilter,
} from '../types/userSessionStoreTypes';
import {RootStore} from './rootStore';

export const NOFILTERVALUE: NoFilter = {
  id: 'none',
  name: strings.notFiltered,
  numTitles: 0,
};

export class FilterStore {
  root: RootStore;
  // Filter states
  filteredArtist?: Artist | NoFilter = undefined;
  filteredGenre?: Genre | NoFilter = undefined;
  filteredBook?: Book | NoFilter = undefined;
  filteredChapter?: Chapter | NoFilter = undefined;

  filterViewFilteredArtist?: Artist | NoFilter = undefined;
  filterViewFilteredGenre?: Genre | NoFilter = undefined;
  filterViewFilteredBook?: Book | NoFilter = undefined;
  filterViewFilteredChapter?: Chapter | NoFilter = undefined;

  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      filteredArtist: observable,
      filteredGenre: observable,
      filteredBook: observable,
      filteredChapter: observable,
      filterViewFilteredArtist: observable,
      filterViewFilteredGenre: observable,
      filterViewFilteredBook: observable,
      filterViewFilteredChapter: observable,
      genres: computed,
      books: computed,
      chapters: computed,
      artists: computed,
      sermonsCountForCurrentFilter: computed,
    });
  }

  get sermonsCountForCurrentFilter() {
    if (this.filterViewFilteredBook) {
      return this.books.find(
        book => book.id === this.filterViewFilteredBook?.id,
      )?.numTitles;
    }
    if (this.filterViewFilteredGenre) {
      return this.genres.find(
        genre => genre.id === this.filterViewFilteredBook?.id,
      )?.numTitles;
    }
    if (this.filterViewFilteredArtist) {
      return this.artists.find(
        artist => artist.id === this.filterViewFilteredArtist?.id,
      )?.numTitles;
    }
  }

  get artists(): (NoFilter | Artist)[] {
    return [
      NOFILTERVALUE,
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
      NOFILTERVALUE,
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
      NOFILTERVALUE,
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
      NOFILTERVALUE,
      ...this.root.apiStore.chapters.map(chapter => ({
        chapter: chapter.chapter,
        name: chapter.chapter,
        id: chapter.id,
        numTitles: chapter.num_titles,
        count: chapter.count,
      })),
    ];
  }

  updateFilteredArtist = action(() => {
    this.filteredArtist = this.filterViewFilteredArtist;
  });

  updateFilteredGenre = action(() => {
    this.filteredGenre = this.filterViewFilteredGenre;
  });

  updateFilteredBook = action(() => {
    this.filteredBook = this.filterViewFilteredBook;
  });

  updateFilteredChapter = action(() => {
    this.filteredChapter = this.filterViewFilteredChapter;
  });

  filterViewUpdateFilteredArtist = action(
    (artist: Artist | NoFilter | undefined) => {
      this.root.apiStore.updateFilterData(
        artist,
        this.filterViewFilteredGenre,
        this.filterViewFilteredBook,
      );
      this.filterViewFilteredArtist =
        artist?.id === 'none' ? undefined : artist;
    },
  );

  filterViewUpdateFilteredGenre = action(
    (genre: Genre | NoFilter | undefined) => {
      this.root.apiStore.updateFilterData(
        this.filterViewFilteredArtist,
        genre,
        this.filterViewFilteredBook,
      );
      this.filterViewFilteredGenre = genre?.id === 'none' ? undefined : genre;
    },
  );

  filterViewUpdateFilteredBook = action((book: Book | NoFilter | undefined) => {
    this.root.apiStore.updateFilterData(
      this.filterViewFilteredArtist,
      this.filterViewFilteredGenre,
      book,
    );
    this.filterViewFilteredChapter = undefined;
    this.filterViewFilteredBook = book?.id === 'none' ? undefined : book;
  });

  filterViewUpdateFilteredChapter = action(
    (chapter: Chapter | NoFilter | undefined) => {
      this.filterViewFilteredChapter =
        chapter?.id === 'none' ? undefined : chapter;
    },
  );

  resetFilter = action(() => {
    this.filteredGenre = undefined;
    this.filteredArtist = undefined;
    this.filteredBook = undefined;
    this.filteredChapter = undefined;

    this.filterViewFilteredArtist = undefined;
    this.filterViewFilteredGenre = undefined;
    this.filterViewFilteredBook = undefined;
    this.filterViewFilteredChapter = undefined;
  });
}
