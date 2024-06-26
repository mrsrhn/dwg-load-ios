import {makeObservable, observable, action, computed, runInAction} from 'mobx';
import {RootStore} from './rootStore';
import {Sermon} from '../types/userSessionStoreTypes';
import TrackPlayer, {
  Track,
  Event,
  PlaybackProgressUpdatedEvent,
  State,
} from 'react-native-track-player';
import {setupOptions, trackPlayerOptions} from '../config/trackPlayerOptions';

export class PlayerStore {
  root: RootStore;
  sermon: Sermon | undefined = undefined;
  initialPosition: number = 0;
  url: string | undefined = undefined;
  paused: boolean = true;
  isBuffering: boolean = false;
  state = State.None;
  position: number = 0;
  playbackSpeed: number = 1;

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
      playbackSpeed: observable,
    });

    TrackPlayer.setupPlayer(setupOptions);
    TrackPlayer.updateOptions(trackPlayerOptions);
    this.registerEvents();
  }

  private onProgress = (progress: PlaybackProgressUpdatedEvent) => {
    if (progress.position === 0) return;
    this.updatePosition(progress.position);
  };

  private onEnd = async () => {
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

    // is last title of album - break
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

  setPaused = action((paused: boolean) => {
    this.paused = paused;
  });

  setState = action((state: State) => {
    this.state = state;
  });

  clearPlayer = action(() => {
    if (!this.sermon) return;
    this.root.storageStore.addSermonPosition(this.sermon, this.position);
    this.sermon = undefined;
    this.url = undefined;
    this.updatePaused(true);
    this.isBuffering = false;
    this.position = 0;
  });

  setPlaybackSpeed = action(async (speed: number) => {
    runInAction(() => {
      this.playbackSpeed = speed;
    });
    await TrackPlayer.setRate(speed);
  });

  seek = action(async (value: number) => {
    await TrackPlayer.seekTo(value);
    console.log('seekToPosition:', value);
  });

  updatePosition = action((time: number) => {
    this.position = time;
  });

  updateSermon = action(
    async (sermon: Sermon, position: number, alternativePath?: string) => {
      if (!sermon) return;

      const track: Track = {
        url: alternativePath ? alternativePath : sermon.url,
        title: sermon.title,
        artist: sermon.artist?.name,
        duration: sermon.playtime,
      };

      await TrackPlayer.add(track);

      try {
        await TrackPlayer.skipToNext();
      } catch {
        console.log('no tracks left');
      }

      await TrackPlayer.seekTo(position);

      // Save previous played sermon
      if (this.sermon) {
        this.root.storageStore.addSermonPosition(this.sermon, this.position);
      }

      runInAction(() => {
        this.sermon = sermon;
      });
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

  private registerEvents = () => {
    TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      this.onProgress,
    );
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, this.onEnd);
    TrackPlayer.addEventListener(Event.RemotePlay, () =>
      this.updatePaused(false),
    );
    TrackPlayer.addEventListener(Event.RemotePause, () => {
      this.updatePaused(true);
    });
    TrackPlayer.addEventListener(Event.RemoteJumpForward, () =>
      this.seek(this.position + 10),
    );
    TrackPlayer.addEventListener(Event.RemoteJumpBackward, () =>
      this.seek(this.position - 10),
    );
    TrackPlayer.addEventListener(Event.RemoteSeek, e => this.seek(e.position));
    TrackPlayer.addEventListener(Event.RemoteDuck, e => {
      if (e.paused) return;
      TrackPlayer.play();
    });
    TrackPlayer.addEventListener(Event.PlaybackError, e => {
      console.log('PlaybackError: ' + e);
      runInAction(() => {
        this.sermon = undefined;
        this.state = State.Paused;
      });
    });
    TrackPlayer.addEventListener(Event.PlaybackState, e => {
      this.setState(e.state);

      switch (e.state) {
        case State.Stopped:
        case State.Paused:
          this.setPaused(true);
          break;
        case State.Playing:
          this.setPaused(false);
          break;
      }
    });
  };

  get isVideo(): boolean | undefined {
    return this.url?.slice(this.url?.length - 3) === 'mp4';
  }
}
