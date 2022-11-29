import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {Text} from 'react-native';
import {DWGModal} from '../DWGModal';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const CommentView = observer(() => {
  const {userSessionStore} = useStores();
  const comment = userSessionStore.selectedSermon?.comment;

  return comment ? (
    <DWGModal
      title={strings.content}
      key="artistView-modal"
      visible={userSessionStore.commentModalVisible}
      onClose={() => userSessionStore.setCommentModalVisible(false)}>
      <Text>{`${comment}`}</Text>
    </DWGModal>
  ) : null;
});
