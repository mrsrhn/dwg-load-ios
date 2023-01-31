import React, {useRef, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import Sound, {LoadError} from 'react-native-video';
import Toast from 'react-native-simple-toast';
import {strings} from '../strings';
import {useStores} from '../hooks/useStores';

let triggerApiCountTimer: NodeJS.Timeout;

export const SoundComponent = observer(() => {
  let soundRef = useRef(null);
  const {playerStore, storageStore, userSessionStore, apiStore} = useStores();
  const [key, setKey] = React.useState(0);

  const [newSermonInitialized, setNewSermonInitialized] = React.useState(false);

  const {
    setCurrentTime,
    updateIsBuffering,
    paused,
    url,
    shouldSeek,
    seekValue,
    seekSuccess,
    sermon,
    initialPosition,
    updatePaused,
  } = playerStore;

  const isPlayerReady = !!url && typeof url === 'string';

  if (shouldSeek) {
    soundRef.current.seek(seekValue);
  }

  useEffect(() => {
    setNewSermonInitialized(true);
  }, [url]);

  const reload = () => {
    setKey(key + 1);
  };

  const onProgress = (currentTime: number) => {
    if (paused) return;
    if (!sermon) return;
    setCurrentTime(currentTime);

    // start timeout to trigger count api if new sermon has been started
    if (newSermonInitialized) {
      setNewSermonInitialized(false);
      if (triggerApiCountTimer) {
        clearTimeout(triggerApiCountTimer);
      }
      triggerApiCountTimer = setTimeout(() => {
        if (sermon) {
          apiStore.triggerTitleCount(sermon.id);
        }
      }, 60000);
    }
  };

  useEffect(() => {
    if (userSessionStore.sleepTimerProgress === 0) {
      updatePaused(true);
      userSessionStore.setSleepTimer(undefined);
    }
  }, [userSessionStore.sleepTimerProgress, updatePaused, userSessionStore]);

  const onEnd = () => {
    // is no album - break
    if (!playerStore.sermon?.isPartOfAlbum) {
      updatePaused(true);
      return;
    }

    // album titles not defined - break
    if (!userSessionStore.selectedSermonAlbumTitles) {
      updatePaused(true);
      return;
    }

    // is last title of album - break
    if (
      parseInt(playerStore.sermon.track, 10) ===
      userSessionStore.selectedSermonAlbumTitles.length
    ) {
      updatePaused(true);
      return;
    }

    // play next title
    const viewShouldBeUpdated =
      userSessionStore.selectedSermon?.id === playerStore.sermon.id;

    playerStore.updateSermon(
      userSessionStore.selectedSermonAlbumTitles[
        parseInt(playerStore.sermon.track, 10)
      ],
      0,
      userSessionStore.localPathMp3,
    );
    if (viewShouldBeUpdated) {
      userSessionStore.setSelectedSermon(playerStore.sermon);
    }
    updatePaused(false);
    storageStore.addSermonToHistoryList(playerStore.sermon);
  };

  return isPlayerReady && !playerStore.isVideo ? (
    <Sound
      key={`sound_${key}`}
      onProgress={({currentTime}) => onProgress(currentTime)}
      onEnd={onEnd}
      progressUpdateInterval={999}
      onSeek={({currentTime}) => seekSuccess(currentTime)}
      ref={soundRef}
      onLoad={() => {
        updateIsBuffering(false);
        soundRef.current.seek(initialPosition);
      }}
      onLoadStart={() => updateIsBuffering(true)}
      source={{
        uri: url,
      }}
      onError={(e: LoadError) => {
        if (e.error.code === -1009) {
          Toast.showWithGravity(strings.noConnection, 2, Toast.BOTTOM);
        } else {
          Toast.showWithGravity(strings.error, 2, Toast.BOTTOM);
        }
        console.log(e);
        reload();
        updatePaused(true);
        playerStore.clearPlayer();
        updateIsBuffering(false);
      }}
      playInBackground
      paused={paused}
      rate={1.0}
      audioOnly
      ignoreSilentSwitch="ignore"
    />
  ) : null;
});
