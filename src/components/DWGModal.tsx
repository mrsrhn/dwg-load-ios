import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../appearance';
import {SafeAreaView} from 'react-native-safe-area-context';

interface DWGModalProps {
  onClose: () => void;
  visible: boolean;
  title?: string;
  children: React.ReactNode;
}
export const DWGModal: React.FC<DWGModalProps> = observer(props => {
  const {onClose, children, visible, title} = props;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={styles.container}
      onRequestClose={onClose}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          paddingTop: 100,
          paddingBottom: 100,
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <View style={styles.closeButton}>
                <Pressable onPress={onClose}>
                  {({pressed}) => (
                    <Ionicons
                      name="close-outline"
                      size={30}
                      color={
                        pressed ? Appearance.baseColor : Appearance.darkColor
                      }
                    />
                  )}
                </Pressable>
              </View>
              {title ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.title}>{title}</Text>
                </View>
              ) : null}
              <View style={{width: 50}} />
            </View>
            <ScrollView>{children}</ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    padding: 10,
    minWidth: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Appearance.baseColor,
  },
});
