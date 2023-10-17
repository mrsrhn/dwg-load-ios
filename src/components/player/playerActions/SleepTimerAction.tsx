import {observer} from 'mobx-react';
import React from 'react';
import {ActionSheetIOS, Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../../appearance';
import {useStores} from '../../../hooks/useStores';
import {strings} from '../../../strings';

const TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 120];

export const SleepTimerAction = observer(() => {
  const {userSessionStore} = useStores();

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

  const SleepTimerView = observer(({pressed}: {pressed: boolean}) => (
    <View style={styles.container}>
      <Ionicons
        name={'timer-outline'}
        size={33}
        color={pressed ? Appearance.baseColor : Appearance.darkColor}
      />
      <Text style={styles.timerText}>
        {userSessionStore.sleepTimerProgress
          ? generateTimeString(userSessionStore.sleepTimerProgress)
          : ''}
      </Text>
    </View>
  ));

  return (
    <Pressable style={styles.button} onPress={onSleepTimer}>
      {({pressed}) => <SleepTimerView pressed={pressed} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {flexDirection: 'column', alignItems: 'flex-end'},
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
