import {
  Pressable,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {Appearance} from '../appearance';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DWGButtonProps {
  style: 'primary' | 'secondary';
  id?: string;
  onPress: () => void;
  title: string;
  subtitle?: string;
  selected?: boolean;
  disabled?: boolean;
  icon?: string;
  isLoading?: boolean;
  loadableText?: string;
}

export const DWGButton: React.FC<DWGButtonProps> = props => {
  return (
    <Pressable
      style={({pressed}) =>
        props.disabled
          ? [styles.button, styles.disabled]
          : props.selected
          ? [styles.button, styles[props.style], styles.selected]
          : pressed
          ? [styles.button, styles[props.style], styles.pressed]
          : [styles.button, styles[props.style]]
      }
      onPress={props.onPress}>
      {({pressed}) => {
        const icon = props.icon ? (
          <View style={{justifyContent: 'center'}}>
            <Ionicons
              name={props.icon}
              style={{marginRight: 10}}
              size={20}
              color={
                props.disabled
                  ? 'lightgrey'
                  : props.selected
                  ? 'white'
                  : pressed
                  ? 'white'
                  : props.style === 'primary'
                  ? 'white'
                  : Appearance.baseColor
              }
            />
          </View>
        ) : null;
        return (
          <View style={styles.buttonContainer}>
            {props.icon ? (
              <View style={styles.iconContainer}>{icon}</View>
            ) : null}
            <View style={styles.textContainer}>
              <Text
                style={
                  props.disabled
                    ? [styles.buttonText, styles.disabled]
                    : props.selected
                    ? [styles.buttonText, styles[props.style], styles.selected]
                    : pressed
                    ? [styles.buttonText, styles[props.style], styles.pressed]
                    : [styles.buttonText, styles[props.style]]
                }>
                {props.title}
                {
                  <Text>
                    {props.isLoading ? (
                      <ActivityIndicator />
                    ) : props.loadableText ? (
                      <Text>{props.loadableText}</Text>
                    ) : null}
                  </Text>
                }
              </Text>
              {props.subtitle ? (
                <Text
                  style={
                    props.disabled
                      ? [styles.buttonSubTitle, styles.disabled]
                      : props.selected
                      ? [
                          styles.buttonSubTitle,
                          styles[props.style],
                          styles.selected,
                        ]
                      : pressed
                      ? [
                          styles.buttonSubTitle,
                          styles[props.style],
                          styles.pressed,
                        ]
                      : [styles.buttonSubTitle, styles[props.style]]
                  }>
                  {props.subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 100,
    margin: 5,
    borderColor: Appearance.baseColor,
    color: Appearance.baseColor,
    borderWidth: 2,
    flex: 1,
  },
  primary: {backgroundColor: Appearance.baseColor, color: 'white'},
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 10,
    flexDirection: 'column',
    minHeight: 17,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    flex: 2,
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
  },
  buttonSubTitle: {
    textAlign: 'center',
    color: Appearance.baseColor,
  },
  selected: {
    backgroundColor: Appearance.baseColor,
    color: 'white',
  },
  pressed: {
    backgroundColor: Appearance.darkColor,
    color: 'white',
  },
  disabled: {
    borderColor: 'lightgrey',
    color: 'lightgrey',
  },
});
