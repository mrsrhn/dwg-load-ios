import {makeObservable, observable, action, computed} from 'mobx';
import {RootStore} from './rootStore';
import {Sermon} from '../types/userSessionStoreTypes';

export class PlayerStore {
  root: RootStore;
  sermon: Sermon | undefined = undefined;
  initialPosition: number = 0;
  url: string | undefined = undefined;
  paused: boolean = true;
  isBuffering: boolean = false;
  currentTime: number = 0;
  shouldSeek: boolean = false;
  seekValue: number = 0;

  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      sermon: observable,
      url: observable,
      paused: observable,
      initialPosition: observable,
      isBuffering: observable,
      currentTime: observable,
      shouldSeek: observable,
      seekValue: observable,
      isVideo: computed,
    });
  }

  clearPlayer = action(() => {
    this.sermon = undefined;
    this.url = undefined;
    this.paused = true;
    this.isBuffering = false;
    this.currentTime = 0;
    this.shouldSeek = false;
    this.seekValue = 0;
  });

  seek = action((value: number) => {
    this.shouldSeek = true;
    this.seekValue = value;
  });

  seekSuccess = action((value: number) => {
    this.shouldSeek = false;
    this.currentTime = value;
  });

  updateCurrentTime = action((time: number) => {
    this.currentTime = time;
  });

  updateSermon = action(
    (sermon: Sermon, position: number, alternativePath?: string) => {
      if (this.sermon) {
        this.root.storageStore.addSermonPosition(this.sermon, this.currentTime);
      }
      this.sermon = sermon;
      this.initialPosition = position;
      if (alternativePath) {
        this.updateUrl(alternativePath);
      } else {
        this.updateUrl(sermon.url);
      }
      this.updateCurrentTime(position);
    },
  );

  updateUrl = action((url: string) => {
    this.url = url;
  });

  updatePaused = action((paused: boolean) => {
    this.paused = paused;
    if (paused && this.sermon) {
      this.root.storageStore.addSermonPosition(this.sermon, this.currentTime);
    }
  });

  updateIsBuffering = action((isBuffering: boolean) => {
    this.isBuffering = isBuffering;
  });

  setCurrentTime = action((currentTime: number) => {
    this.currentTime = currentTime;
  });

  get isVideo(): boolean | undefined {
    return this.url?.substr(this.url.length - 3, 3) === 'mp4';
  }
}
