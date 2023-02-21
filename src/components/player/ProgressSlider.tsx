import React from 'react';
import {observer} from 'mobx-react-lite';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {StyleSheet, Text, View} from 'react-native';
import {Appearance} from '../../appearance';
import {useStores} from '../../hooks/useStores';
import {useProgress} from 'react-native-track-player';
export interface SliderProps {
  enabled: boolean;
  duration: number;
  initialProgress: number | undefined;
  seekTo: Function;
}

const formatDurationString = (duration: number, negative = false) => {
  if (duration < 0) return '-00:00';
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);

  return `${negative ? '-' : ''}${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
};

const CustomLabel = (props: any) => (
  <Text
    style={{
      textAlign: 'center',
      color: props.oneMarkerPressed ? Appearance.greyColor : 'white',
      maxWidth: '100%',
    }}>
    {props.content}
  </Text>
);

export const ProgressSlider = observer((props: SliderProps) => {
  const {duration} = props;
  const {playerStore} = useStores();

  const progress = useProgress();

  const currentPosition = props.enabled
    ? progress.position
    : props.initialProgress ?? 0;
  return (
    <View style={styles.container}>
      <MultiSlider
        selectedStyle={{backgroundColor: Appearance.baseColor}}
        min={0}
        values={[props.initialProgress ?? progress.position]}
        max={props.duration}
        onValuesChangeFinish={values => props.seekTo(values[0])}
        enableLabel
        customLabel={p => {
          return typeof p.oneMarkerValue === 'number' ? (
            <CustomLabel
              {...p}
              duration={duration}
              content={formatDurationString(p.oneMarkerValue)}
            />
          ) : null;
        }}
      />
      <View style={styles.indicators}>
        <Text style={styles.indicatorText}>
          {formatDurationString(currentPosition)}
        </Text>
        <Text style={styles.indicatorText}>
          {formatDurationString(props.duration - currentPosition, true)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginLeft: 17,
    marginBottom: 10,
    marginRight: 17,
    alignSelf: 'center',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorText: {
    color: 'grey',
  },
});
