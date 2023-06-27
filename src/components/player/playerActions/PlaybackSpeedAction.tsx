import {observer} from 'mobx-react';
import React from 'react';
import {ActionSheetIOS, Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../../appearance';
import {useStores} from '../../../hooks/useStores';
import {strings} from '../../../strings';

const PLAYBACK_SPEED_OPTIONS = [strings.cancel, 1, 1.25, 1.5, 1.75, 2];
export const PlaybackSpeedAction = observer(() => {
  const {playerStore} = useStores();

  const onSpeedometer = () => {
    const options = {
      options: PLAYBACK_SPEED_OPTIONS.map((time, index) =>
        index === 0 ? time : `${time}x`,
      ),
      cancelButtonIndex: 0,
      title: strings.speed,
    };
    const actionSheetCallback = (buttonIndex: number) => {
      if (buttonIndex === 0) {
        return;
      }
      playerStore.setPlaybackSpeed(
        PLAYBACK_SPEED_OPTIONS[buttonIndex] as number,
      );
    };

    ActionSheetIOS.showActionSheetWithOptions(options, actionSheetCallback);
  };
  const SpeedActionIcon = observer((props: {pressed: boolean}) => (
    <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
      <Ionicons
        name="speedometer-outline"
        size={33}
        color={props.pressed ? Appearance.baseColor : Appearance.darkColor}
      />
      {playerStore.playbackSpeed !== 1 ? (
        <Text style={styles.playbackSpeedText}>
          {playerStore.playbackSpeed}x
        </Text>
      ) : null}
    </View>
  ));

  return (
    <Pressable style={styles.button} onPress={onSpeedometer}>
      {({pressed}) => <SpeedActionIcon pressed={pressed} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  playbackSpeedText: {
    color: Appearance.greyColor,
    fontSize: 11,
    textAlign: 'center',
    width: '100%',
  },
});
