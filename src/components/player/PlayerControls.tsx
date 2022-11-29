import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View, Pressable, ActivityIndicator} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Appearance} from '../../appearance';

interface PlayerControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  onPressPlay: () => void;
  onPressForward: () => void;
  onPressReplay: () => void;
  isDeactivated: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = observer(props => {
  const {
    isPlaying,
    onPressPlay,
    onPressForward,
    onPressReplay,
    isBuffering,
    isDeactivated,
  } = props;

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={onPressReplay}>
          <MaterialIcon
            name="replay-10"
            size={50}
            color={isDeactivated ? Appearance.greyColor : Appearance.darkColor}
          />
        </Pressable>
        <View style={styles.playButton}>
          {isBuffering && (
            <ActivityIndicator size="large" color={Appearance.darkColor} />
          )}
          {!isBuffering && (
            <Pressable style={styles.button} onPress={onPressPlay}>
              {isPlaying ? (
                <MaterialIcon
                  name="pause-circle-outline"
                  size={70}
                  color={
                    isDeactivated ? Appearance.greyColor : Appearance.darkColor
                  }
                />
              ) : (
                <MaterialIcon
                  name="play-circle-outline"
                  size={70}
                  color={
                    isDeactivated ? Appearance.greyColor : Appearance.darkColor
                  }
                />
              )}
            </Pressable>
          )}
        </View>
        <Pressable style={styles.button} onPress={onPressForward}>
          <MaterialIcon
            name="forward-10"
            size={50}
            color={isDeactivated ? Appearance.greyColor : Appearance.darkColor}
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
