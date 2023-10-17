import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Pressable, StyleSheet, Text} from 'react-native';
import {DWGModal} from '../DWGModal';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../../appearance';

export const CommentIcon = observer(() => {
  const {userSessionStore} = useStores();
  const comment = userSessionStore.selectedSermon?.comment;

  return comment ? (
    <>
      {userSessionStore.selectedSermon?.comment?.length ? (
        <Pressable
          onPress={() => userSessionStore.setCommentModalVisible(true)}>
          <Ionicons
            size={25}
            style={styles.icon}
            color={Appearance.baseColor}
            name="information-circle-outline"
          />
        </Pressable>
      ) : null}
      <DWGModal
        title={strings.content}
        key="artistView-modal"
        visible={userSessionStore.commentModalVisible}
        onClose={() => userSessionStore.setCommentModalVisible(false)}>
        <Text>{`${comment}`}</Text>
      </DWGModal>
    </>
  ) : null;
});

const styles = StyleSheet.create({
  icon: {marginLeft: 5},
});
