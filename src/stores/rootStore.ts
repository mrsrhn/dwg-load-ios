import {ApiStore} from './apiStore';
import {UserSessionStore} from './userSessionStore';
import {PlayerStore} from './playerStore';
import {StorageStore} from './storageStore';
import {FilterStore} from './filterStore';

export class RootStore {
  apiStore: ApiStore;
  userSessionStore: UserSessionStore;
  playerStore: PlayerStore;
  storageStore: StorageStore;
  filterStore: FilterStore;

  constructor() {
    this.apiStore = new ApiStore(this);
    this.storageStore = new StorageStore(this);
    this.userSessionStore = new UserSessionStore(this);
    this.playerStore = new PlayerStore(this);
    this.filterStore = new FilterStore(this);
  }
}
