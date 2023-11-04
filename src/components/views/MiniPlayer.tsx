import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Appearance} from '../../appearance';
import LottieView from 'lottie-react-native';
import AutoScrolling from '../../autoscrolling';
import {useStores} from '../../hooks/useStores';
import {State} from 'react-native-track-player';

export const MiniPlayer = observer(() => {
  const {userSessionStore, playerStore} = useStores();
  const {
    paused,
    updatePaused,
    clearPlayer,
    sermon,
    position: currentTime,
    isVideo,
  } = playerStore;

  const isPlaying = [State.Playing].includes(playerStore.state);

  const onPressPlay = () => {
    if (!isVideo) updatePaused(!paused);
    else userSessionStore.setPlayerModalVisible(true);
  };

  const onPressClose = () => {
    clearPlayer();
  };

  const progressStyle = React.useMemo(
    () => ({
      height: 4,
      backgroundColor: Appearance.baseColor,
      width: `${sermon ? (currentTime / sermon?.playtime) * 100 : 0}%`,
    }),
    [currentTime, sermon],
  );

  return userSessionStore.playerModalVisible || !playerStore.sermon ? null : (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.button} onPress={onPressClose}>
          {({pressed}) => (
            <MaterialIcon
              name="close"
              size={30}
              color={pressed ? Appearance.baseColor : Appearance.darkColor}
            />
          )}
        </Pressable>
        <Pressable
          style={styles.strings}
          onPress={() => userSessionStore.setPlayerModalVisible(true)}>
          {playerStore.sermon?.title.length > 30 ? (
            <AutoScrolling delay={2000} isVertical={false}>
              <Text style={styles.title}>{playerStore.sermon?.title}</Text>
            </AutoScrolling>
          ) : (
            <Text style={styles.title}>{playerStore.sermon?.title}</Text>
          )}
          <Text style={styles.artist}>{playerStore.sermon?.artist?.name}</Text>
        </Pressable>
        <View style={styles.animationWrapper}>
          {isPlaying ? <PlayingIndicator /> : null}
        </View>

        <Pressable style={styles.button} onPress={onPressPlay}>
          {({pressed}) =>
            isVideo ? (
              <MaterialIcon
                name="ondemand-video"
                size={30}
                color={pressed ? Appearance.baseColor : Appearance.darkColor}
              />
            ) : isPlaying ? (
              <MaterialIcon
                name="pause-circle-outline"
                size={30}
                color={pressed ? Appearance.baseColor : Appearance.darkColor}
              />
            ) : (
              <MaterialIcon
                name="play-circle-outline"
                size={30}
                color={pressed ? Appearance.baseColor : Appearance.darkColor}
              />
            )
          }
        </Pressable>
      </View>
      <View style={progressStyle} />
    </View>
  );
});

const PlayingIndicator = () => {
  const {playerStore} = useStores();

  const ref = React.createRef<LottieView>();

  React.useEffect(() => {
    if (ref) {
      ref.current?.play();
    }
  });

  return !playerStore.isVideo ? (
    <LottieView
      ref={ref}
      colorFilters={[
        {keypath: 'Calque 5 Silhouettes', color: Appearance.lightColor},
        {keypath: 'Calque 4 Silhouettes', color: Appearance.lightColor},
        {keypath: 'Calque 3 Silhouettes', color: Appearance.lightColor},
        {keypath: 'Calque 2 Silhouettes', color: Appearance.lightColor},
        {keypath: 'Calque 1 Silhouettes', color: Appearance.lightColor},
      ]}
      source={require('../../assets/animation.json')}
      autoPlay={!playerStore.paused}
      speed={0.5}
      loop={!playerStore.paused}
    />
  ) : null;
};

var styles = StyleSheet.create({
  container: {
    height: 55,
    borderTopWidth: 1,
    bottom: 1,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    color: Appearance.baseColor,
    fontWeight: 'bold',
  },
  artist: {
    color: Appearance.greyColor,
    fontWeight: 'normal',
  },
  strings: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  animationWrapper: {
    width: '10%',
  },
});
