import {observer} from 'mobx-react';
import React from 'react';
import {NativeScrollEvent, ScrollView, StyleSheet} from 'react-native';
import {Appearance} from '../../appearance';
import {useStores} from '../../hooks/useStores';
import {strings} from '../../strings';
import {DWGButton} from '../DWGButton';

interface AlbumTitlesProps {
  activateCloseGesture: (isOnTop: boolean) => void;
}

export const AlbumTitles: React.FC<AlbumTitlesProps> = observer(props => {
  const {userSessionStore, playerStore} = useStores();

  if (!userSessionStore.selectedSermonAlbumTitles?.length) return null;
  if (userSessionStore.selectedSermonAlbumTitles?.length < 2) return null;

  const isCloseToTop = ({contentOffset}: NativeScrollEvent) => {
    return contentOffset.y <= 0;
  };

  return (
    <ScrollView
      onScrollBeginDrag={({nativeEvent}) =>
        props.activateCloseGesture(isCloseToTop(nativeEvent))
      }
      onScrollEndDrag={() => props.activateCloseGesture(true)}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}>
      {userSessionStore.selectedSermonAlbumTitles.length > 1 ? (
        <React.Fragment>
          {userSessionStore.selectedSermonAlbumTitles.map(title => (
            <DWGButton
              icon={
                title.id === playerStore.sermon?.id
                  ? 'volume-medium-outline'
                  : undefined
              }
              style="secondary"
              key={`${userSessionStore.selectedSermon?.id}_${title.id}_button`}
              selected={title.id === userSessionStore.selectedSermon?.id}
              onPress={() => userSessionStore.setSelectedSermon(title)}
              title={`${strings.part} ${title.track}: ${title.title}`}
              subtitle={
                title.Passages?.length
                  ? `${title.Passages[0].PassageBook.long} ${title.Passages[0].chapter}`
                  : undefined
              }
            />
          ))}
        </React.Fragment>
      ) : null}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    minWidth: '100%',
    borderTopColor: Appearance.baseColor,
    borderTopWidth: 1,
    marginTop: 10,
  },
});
