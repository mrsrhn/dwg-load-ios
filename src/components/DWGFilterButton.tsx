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
import {observer} from 'mobx-react-lite';

interface DWGFilterButtonProps {
  id?: string;
  onPress: () => void;
  title: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const DWGFilterButton: React.FC<DWGFilterButtonProps> = observer(
  props => {
    return (
      <Pressable
        disabled={props.disabled ?? false}
        style={({pressed}) =>
          props.disabled
            ? [styles.button, styles.disabled]
            : props.selected || pressed
            ? [styles.button, styles.selected]
            : styles.button
        }
        onPress={props.onPress}>
        {({pressed}) => (
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {props.loading && <ActivityIndicator />}
            <Text
              style={
                props.disabled
                  ? [styles.buttonTitle, styles.disabled]
                  : props.selected || pressed
                  ? [styles.buttonTitle, styles.selected]
                  : styles.buttonTitle
              }>
              {props.title}
            </Text>
            <Text
              style={
                props.disabled
                  ? [styles.buttonValue, styles.disabled]
                  : props.selected || pressed
                  ? [styles.buttonValue, styles.selected]
                  : styles.buttonValue
              }>
              {props.value}
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={
                props.disabled
                  ? 'lightgrey'
                  : pressed
                  ? 'white'
                  : Appearance.greyColor
              }
            />
          </View>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    margin: 5,
    borderColor: Appearance.baseColor,
    color: Appearance.baseColor,
    borderWidth: 2,
    flex: 1,
  },
  buttonTitle: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: Appearance.baseColor,
    fontWeight: 'bold',
  },
  buttonValue: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'right',
    color: Appearance.greyColor,
    marginLeft: 'auto',
  },
  selected: {
    backgroundColor: Appearance.baseColor,
    color: 'white',
  },
  disabled: {
    borderColor: 'lightgrey',
    color: 'lightgrey',
  },
});
