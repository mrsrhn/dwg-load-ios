import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Pressable, StyleSheet, Animated, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useStores} from '../../../hooks/useStores';
import {strings} from '../../../strings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {Appearance} from '../../../appearance';

export const DownloadAction = observer(() => {
  const {userSessionStore, storageStore} = useStores();

  const [downloadStarted, setDownloadStarted] = React.useState(
    userSessionStore.selectedSermonIsDownloaded,
  );

  const progress = React.useRef(new Animated.Value(0.19)).current;

  useEffect(() => {
    if (userSessionStore.selectedSermonDownloadProgress) {
      if (!downloadStarted) {
        Animated.timing(progress, {
          toValue: 0.19,
          duration: 0,
          useNativeDriver: true,
        }).start();
        setDownloadStarted(true);
      } else {
        if (userSessionStore.selectedSermonDownloadProgress === 100) {
          Animated.timing(progress, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          Toast.showWithGravity(strings.downloaded, 2, Toast.BOTTOM);
        } else {
          Animated.timing(progress, {
            toValue:
              (userSessionStore.selectedSermonDownloadProgress / 100) * 0.56 +
              0.19,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      }
    }
  }, [
    userSessionStore.selectedSermonDownloadProgress,
    downloadStarted,
    progress,
  ]);

  React.useEffect(() => {
    if (
      !userSessionStore.selectedSermonIsDownloading &&
      downloadStarted &&
      !userSessionStore.selectedSermonIsDownloaded
    ) {
      setDownloadStarted(false);
      Animated.timing(progress, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [
    userSessionStore.selectedSermonIsDownloading,
    downloadStarted,
    userSessionStore.selectedSermonIsDownloaded,
    progress,
  ]);

  return (
    <Pressable
      disabled={userSessionStore.selectedSermonIsDownloaded}
      style={styles.button}
      onPress={() => {
        if (!userSessionStore.selectedSermon) return;
        if (userSessionStore.selectedSermonIsDownloading) {
          storageStore.stopDownladSermon(userSessionStore.selectedSermon);
        } else {
          storageStore.downloadSermon(userSessionStore.selectedSermon);
        }
      }}>
      {({pressed}) =>
        !userSessionStore.selectedSermonIsDownloading &&
        !userSessionStore.selectedSermonIsDownloaded ? (
          <Ionicons
            name="download-outline"
            size={27}
            color={pressed ? Appearance.baseColor : Appearance.darkColor}
          />
        ) : (
          <View style={styles.downloadAnimation}>
            <DownloadAnimation
              progress={progress}
              isDownloaded={userSessionStore.selectedSermonIsDownloaded}
            />
          </View>
        )
      }
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  downloadAnimation: {width: 27, height: 27},
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
    source={require('../../../assets/download.json')}
    loop={false}
    progress={props.isDownloaded ? 1 : props.progress}
  />
);
