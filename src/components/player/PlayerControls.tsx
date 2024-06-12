import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View, Pressable, ActivityIndicator} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Appearance} from '../../appearance';
import {useStores} from '../../hooks/useStores';
import {State} from 'react-native-track-player';

interface PlayerControlsProps {
  onPressPlay: () => void;
  onPressForward: () => void;
  onPressReplay: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = observer(props => {
  const {onPressPlay, onPressForward, onPressReplay} = props;

  const {playerStore, userSessionStore} = useStores();
  const {selectedSermonIsCurrentlyPlaying} = userSessionStore;

  const isBuffering = [State.Buffering, State.Connecting].includes(
    playerStore.state,
  );

  const isPlaying = [State.Playing].includes(playerStore.state);

  console.log('playerStore.state: ' + playerStore.state);
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={onPressReplay}>
          <MaterialIcon
            name="replay-10"
            size={50}
            color={Appearance.darkColor}
          />
        </Pressable>
        <View style={styles.playButton}>
          {isBuffering ? (
            <ActivityIndicator size="large" color={Appearance.darkColor} />
          ) : (
            <Pressable style={styles.button} onPress={onPressPlay}>
              {selectedSermonIsCurrentlyPlaying && isPlaying ? (
                <MaterialIcon
                  name="pause-circle-outline"
                  size={70}
                  color={Appearance.darkColor}
                />
              ) : (
                <MaterialIcon
                  name="play-circle-outline"
                  size={70}
                  color={Appearance.darkColor}
                />
              )}
            </Pressable>
          )}
        </View>
        <Pressable style={styles.button} onPress={onPressForward}>
          <MaterialIcon
            name="forward-10"
            size={50}
            color={Appearance.darkColor}
          />
        </Pressable>
      </View>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  playButton: {
    width: 100,
    minHeight: 70,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
