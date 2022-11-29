import React from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../appearance';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = observer(props => {
  const {onClose} = props;
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={onClose}>
          {({pressed}) => (
            <Ionicons
              name="chevron-down-outline"
              size={30}
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
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
