import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  Animated,
  ActionSheetIOS,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../appearance';
import Share, {ShareOptions} from 'react-native-share';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';
import {SimilarSermonsMenu} from './SimilarSermonsMenu';

const TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 120];

interface PlayerActionsProps {
  isFavorised: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number | undefined;
  download: () => void;
  stopDownload: () => void;
  pause: () => void;
  deactivateSleepTimer: boolean | undefined;
}

export const PlayerActions: React.FC<PlayerActionsProps> = observer(props => {
  const {
    isFavorised,
    isDownloaded,
    isDownloading,
    download,
    stopDownload,
    downloadProgress,
    deactivateSleepTimer,
  } = props;

  const [downloadStarted, setDownloadStarted] = React.useState(isDownloaded);
  const {userSessionStore, storageStore} = useStores();

  const shareOptions: ShareOptions = useMemo(
    () => ({
      message: `${userSessionStore.selectedSermon?.artist?.name ?? ''} - ${
        userSessionStore.selectedSermon?.title
      }`,
      title: userSessionStore.selectedSermon?.title,
      subject: `${userSessionStore.selectedSermon?.artist?.name ?? ''} - ${
        userSessionStore.selectedSermon?.title
      }`,
      url: `${strings.base}play/${userSessionStore.selectedSermon?.id}`,
    }),
    [
      userSessionStore.selectedSermon?.artist?.name,
      userSessionStore.selectedSermon?.id,
      userSessionStore.selectedSermon?.title,
    ],
  );

  const progress = React.useRef(new Animated.Value(0.19)).current;

  useEffect(() => {
    if (downloadProgress) {
      if (!downloadStarted) {
        Animated.timing(progress, {
          toValue: 0.19,
          duration: 0,
          useNativeDriver: true,
        }).start();
        setDownloadStarted(true);
      } else {
        if (downloadProgress === 100) {
          Animated.timing(progress, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          Toast.showWithGravity(strings.downloaded, 2, Toast.BOTTOM);
        } else {
          Animated.timing(progress, {
            toValue: (downloadProgress / 100) * 0.56 + 0.19,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      }
    }
  }, [downloadProgress, downloadStarted, progress]);

  React.useEffect(() => {
    if (!isDownloading && downloadStarted && !isDownloaded) {
      setDownloadStarted(false);
      Animated.timing(progress, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isDownloading, downloadStarted, isDownloaded, progress]);

  const onShare = () => {
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  const onSleepTimer = () => {
    const options = {
      options: [
        strings.off,
        ...TIMER_OPTIONS.map(time => `${time} ${strings.minutes}`),
      ],
      cancelButtonIndex: 0,
      title: strings.sleepTimer,
    };
    const actionSheetCallback = (buttonIndex: number | undefined) => {
      if (buttonIndex === 0) {
        userSessionStore.stopSleepTimer();
      } else if (buttonIndex !== undefined) {
        userSessionStore.activateSleepTimer(TIMER_OPTIONS[buttonIndex - 1]);
      }
    };

    ActionSheetIOS.showActionSheetWithOptions(options, actionSheetCallback);
  };

  const generateTimeString = (seconds: number) => {
    let minutesInt = Math.floor(seconds / 60);
    let minutesString;
    if (minutesInt < 10) {
      minutesString = `0${minutesInt}`;
    } else {
      minutesString = `${minutesInt}`;
    }
    let secondsInt = (seconds % 3600) % 60;
    var secondsString: String;
    if (secondsInt < 10) {
      secondsString = `0${secondsInt}`;
    } else {
      secondsString = `${secondsInt}`;
    }
    return `${minutesString}:${secondsString}`;
  };

  const toggleFavorite = () => {
    if (!userSessionStore.selectedSermon) return;
    if (isFavorised) {
      Toast.showWithGravity(strings.removedSaved, 2, Toast.BOTTOM);

      storageStore.removeFavorisedSermon(userSessionStore.selectedSermon);
    } else {
      Toast.showWithGravity(strings.saved, 2, Toast.BOTTOM);
      storageStore.addSermonToFavorisedSermonsList(
        userSessionStore.selectedSermon,
      );
    }
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Pressable
          disabled={isDownloaded}
          style={styles.button}
          onPress={() => {
            if (isDownloading) {
              stopDownload();
            } else {
              download();
            }
          }}>
          {({pressed}) =>
            !isDownloading && !isDownloaded ? (
              <Ionicons
                name="download-outline"
                size={27}
                color={pressed ? Appearance.baseColor : Appearance.darkColor}
              />
            ) : (
              <View style={{width: 27, height: 27}}>
                <DownloadAnimation
                  progress={progress}
                  isDownloaded={isDownloaded}
                />
              </View>
            )
          }
        </Pressable>
        <Pressable style={styles.button} onPress={toggleFavorite}>
          {({pressed}) => (
            <Ionicons
              name={
                Platform.OS === 'ios'
                  ? isFavorised
                    ? 'ios-star'
                    : 'ios-star-outline'
                  : isFavorised
                  ? 'md-star'
                  : 'md-star-outline'
              }
              size={27}
              color={pressed ? Appearance.baseColor : Appearance.darkColor}
            />
          )}
        </Pressable>
        {!deactivateSleepTimer && (
          <Pressable style={styles.button} onPress={onSleepTimer}>
            {({pressed}) => (
              <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <Ionicons
                  name={'timer-outline'}
                  size={33}
                  color={pressed ? Appearance.baseColor : Appearance.darkColor}
                />
                {
                  <Text style={styles.timerText}>
                    {userSessionStore.sleepTimerProgress
                      ? generateTimeString(userSessionStore.sleepTimerProgress)
                      : ''}
                  </Text>
                }
              </View>
            )}
          </Pressable>
        )}
        <Pressable style={styles.button}>
          <SimilarSermonsMenu />
        </Pressable>
        <Pressable style={styles.button} onPress={onShare}>
          {({pressed}) => (
            <Ionicons
              name={
                Platform.OS === 'ios' ? 'ios-share-outline' : 'md-share-outline'
              }
              size={27}
              color={pressed ? Appearance.baseColor : Appearance.darkColor}
            />
          )}
        </Pressable>
      </View>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  button: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timerText: {
    color: Appearance.greyColor,
    fontSize: 11,
  },
});

interface DownloadAnimationProps {
  isDownloaded: boolean;
  progress: Animated.Value;
}

const DownloadAnimation: React.FC<DownloadAnimationProps> = props => (
  <LottieView
    colorFilters={[
      {keypath: 'Download_Progress 2', color: Appearance.darkColor},
      {keypath: 'Download_Progress', color: Appearance.darkColor},
      {keypath: 'ic_download Outlines', color: Appearance.darkColor},
    ]}
    source={require('../../assets/download.json')}
    loop={false}
    progress={props.isDownloaded ? 1 : props.progress}
  />
);
