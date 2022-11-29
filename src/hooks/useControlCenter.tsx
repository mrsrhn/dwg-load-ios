import MusicControl, {Command} from 'react-native-music-control';
import {Sermon} from '../types/userSessionStoreTypes';
import {Platform} from 'react-native';
import {useStores} from './useStores';

export const useControlCenter = () => {
  const {playerStore} = useStores();
  const init = () => {
    MusicControl.enableBackgroundMode(true);

    if (Platform.OS === 'ios') {
      MusicControl.handleAudioInterruptions(true);
      // Basic Controls
      MusicControl.enableControl('play', true);
      MusicControl.enableControl('pause', true);
      MusicControl.enableControl('stop', true);
      MusicControl.enableControl('togglePlayPause', true);
      MusicControl.enableControl('skipBackward', true, {interval: 10});
      MusicControl.enableControl('skipForward', true, {interval: 10});

      MusicControl.on(Command.play, () => {
        playerStore.updatePaused(false);
      });

      // on iOS this event will also be triggered by audio router change events
      // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
      MusicControl.on(Command.pause, () => {
        playerStore.updatePaused(true);
      });

      MusicControl.on(Command.stop, () => {
        playerStore.updatePaused(true);
      });

      MusicControl.on(Command.togglePlayPause, () => {
        playerStore.updatePaused(!playerStore.paused);
      });

      MusicControl.on(Command.skipForward, () => {
        playerStore.seek(playerStore.currentTime + 10);
      });

      MusicControl.on(Command.skipBackward, () => {
        playerStore.seek(playerStore.currentTime - 10);
      });
    }
  };

  const setNewSermon = (sermon: Sermon) => {
    MusicControl.setNowPlaying({
      title: sermon.title,
      artist: sermon.artist?.name,
      duration: sermon.playtime,
      //description: '', // Android Only
      //color: 0xffffff, // Android Only - Notification Color
      //colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      //date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
      //rating: 84, // Android Only (Boolean or Number depending on the type)
      //notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
      //isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });
  };

  const updatePosition = (position: number) => {
    MusicControl.updatePlayback({
      elapsedTime: position,
    });
  };

  const reset = () => {
    MusicControl.resetNowPlaying();
    MusicControl.stopControl();
  };

  return {
    setNewSermon: setNewSermon,
    init: init,
    updatePosition: updatePosition,
    reset: reset,
  };
};
