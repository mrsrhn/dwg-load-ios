import {observable, makeObservable, action} from 'mobx';
import {
  Artist,
  Book,
  Chapter,
  Genre,
  NoFilter,
} from '../types/userSessionStoreTypes';
import {RootStore} from './rootStore';

export class FilterStore {
  root: RootStore;
  // Filter states
  filterModalVisible: boolean | NoFilter = false;
  filteredArtist?: Artist | NoFilter = undefined;
  filteredGenre?: Genre | NoFilter = undefined;
  filteredBook?: Book | NoFilter = undefined;
  filteredChapter?: Chapter | NoFilter = undefined;
  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      filterModalVisible: observable,
      filteredArtist: observable,
      filteredGenre: observable,
      filteredBook: observable,
      filteredChapter: observable,
    });
  }

  setFilterViewVisible = action((visible: boolean) => {
    this.filterModalVisible = visible;
  });

  updateFilteredArtist = action((artist: Artist | NoFilter | undefined) => {
    this.filteredArtist = artist;
  });

  updateFilteredGenre = action((genre: Genre | NoFilter | undefined) => {
    this.filteredGenre = genre;
  });

  updateFilteredBook = action((book: Book | NoFilter | undefined) => {
    this.filteredBook = book;
  });

  updateFilteredChapter = action((chapter: Chapter | NoFilter | undefined) => {
    this.filteredChapter = chapter;
  });

  resetFilter = action(() => {
    this.filteredGenre = undefined;
    this.filteredArtist = undefined;
    this.filteredBook = undefined;
    this.filteredChapter = undefined;
  });
}
