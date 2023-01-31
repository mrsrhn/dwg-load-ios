import {makeObservable, observable, action, computed} from 'mobx';
import {RootStore} from './rootStore';
import {Sermon} from '../types/userSessionStoreTypes';
import TrackPlayer, {
  Track,
  Event,
  PlaybackProgressUpdatedEvent,
} from 'react-native-track-player';

// The player is ready to be used
export class PlayerStore {
  root: RootStore;
  sermon: Sermon | undefined = undefined;
  initialPosition: number = 0;
  url: string | undefined = undefined;
  paused: boolean = true;
  isBuffering: boolean = false;
  position: number = 0;

  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      sermon: observable,
      url: observable,
      paused: observable,
      initialPosition: observable,
      isBuffering: observable,
      position: observable,
      isVideo: computed,
    });

    TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      this.onProgress,
    );

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, this.onEnd);
  }

  private onProgress = (progress: PlaybackProgressUpdatedEvent) => {
    console.log(
      'current position:',
      progress.position,
      ' of ',
      this.sermon?.playtime,
    );
    if (progress.position === 0) return;
    this.updatePosition(progress.position);
  };

  private onEnd = async () => {
    console.log('end');
    if (!this.sermon) {
      throw Error('this.sermon-undefined');
    }

    this.updatePosition(this.sermon?.playtime);
    // is no album - break
    if (!this.sermon?.isPartOfAlbum) {
      this.updatePaused(true);
      return;
    }

    // album titles not defined - break
    if (!this.root.userSessionStore.selectedSermonAlbumTitles) {
      this.updatePaused(true);
      return;
    }

    // is last title orf album - break
    if (
      parseInt(this.sermon.track, 10) ===
      this.root.userSessionStore.selectedSermonAlbumTitles.length
    ) {
      this.updatePaused(true);
      return;
    }

    const nextSermon =
      this.root.userSessionStore.selectedSermonAlbumTitles[
        parseInt(this.sermon.track, 10)
      ];
    // play next title of album
    const viewShouldBeUpdated =
      this.root.userSessionStore.selectedSermon?.id === this.sermon.id;

    if (viewShouldBeUpdated) {
      this.root.userSessionStore.setSelectedSermon(nextSermon);
    }

    await this.updateSermon(
      nextSermon,
      0,
      this.root.userSessionStore.localPathMp3,
    );

    this.updatePaused(false);
    TrackPlayer.play();
    this.root.storageStore.addSermonToHistoryList(this.sermon);
  };

  clearPlayer = action(() => {
    this.sermon = undefined;
    this.url = undefined;
    this.paused = true;
    this.isBuffering = false;
    this.position = 0;
  });

  seek = action(async (value: number) => {
    console.log('seekToPosition:', value);
    await TrackPlayer.seekTo(value);
  });

  seekSuccess = action((value: number) => {
    this.position = value;
  });

  updatePosition = action((time: number) => {
    this.position = time;
  });

  updateSermon = action(
    async (sermon: Sermon, position: number, alternativePath?: string) => {
      if (!sermon) {
        console.error('sermon-not-defined');
        return;
      }

      const track: Track = {
        url: alternativePath ? alternativePath : sermon.url,
        title: sermon.title,
        artist: sermon.artist?.name,
        duration: sermon.playtime,
      };

      await TrackPlayer.add(track);
      await TrackPlayer.skipToNext();
      await TrackPlayer.seekTo(position);

      // Save previous played sermon
      if (this.sermon) {
        this.root.storageStore.addSermonPosition(this.sermon, this.position);
      }
      this.sermon = sermon;
      this.updatePosition(position);

      this.initialPosition = position;
      if (alternativePath) {
        this.updateUrl(alternativePath);
      } else {
        this.updateUrl(sermon.url);
      }
      this.updatePosition(position);
    },
  );

  updateUrl = action((url: string) => {
    this.url = url;
  });

  updatePaused = action((paused: boolean) => {
    if (paused) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
    this.paused = paused;
    if (paused && this.sermon) {
      this.root.storageStore.addSermonPosition(this.sermon, this.position);
    }
  });

  updateIsBuffering = action((isBuffering: boolean) => {
    this.isBuffering = isBuffering;
  });

  setCurrentTime = action((currentTime: number) => {
    this.position = currentTime;
  });

  get isVideo(): boolean | undefined {
    return this.url?.substr(this.url.length - 3, 3) === 'mp4';
  }
}
