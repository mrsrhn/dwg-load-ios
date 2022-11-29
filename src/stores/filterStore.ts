import {computed, observable, makeObservable} from 'mobx';
import {RootStore} from './rootStore';

export class FilterStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {});
  }
}
