import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Modal,
  Text,
  RefreshControl,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {AlbumListEntry} from '../lists/albumListEntry';
import {FilterView} from './filter/FilterView';
import {Appearance} from '../../appearance';
import GestureRecognizer from 'react-native-swipe-gestures';
import {wait} from './NewSermonsView';
import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';
import {useNetInfo} from '@react-native-community/netinfo';
import {ListInfo} from '../ListInfo';
import {useStores} from '../../hooks/useStores';

export const AllSermonsView = observer(() => {
  const {userSessionStore, apiStore} = useStores();
  const [refreshing, setRefreshing] = React.useState(false);
  const netInfo = useNetInfo();

  const [gestureRecognizerActive, setGestureRecognizerActive] =
    React.useState(true);

  const activeFilters = [
    userSessionStore.filteredArtist,
    userSessionStore.filteredGenre,
    userSessionStore.filteredBook,
    userSessionStore.filteredChapter,
  ].filter(f => f !== undefined);
  const numberOfActiveFilters = activeFilters.filter(
    filter => filter !== undefined,
  ).length;

  const filtersActive = activeFilters.some(filter => filter);

  return (
    <SafeAreaView style={styles.container}>
      {filtersActive && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterInfoText}>
            {activeFilters.map((filter, index) =>
              filter
                ? `${filter.name} ${
                    index !== numberOfActiveFilters - 1 ? '| ' : ''
                  }`
                : '',
            )}
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={
            !netInfo.isInternetReachable ? (
              <ListInfo info={strings.noConnection} />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={apiStore.isLoadingAllSermons || refreshing}
              onRefresh={async () => {
                if (netInfo.isInternetReachable) {
                  setRefreshing(true);
                  wait(1000)
                    .then(async () => {
                      await apiStore.resetAllSermons();
                      apiStore.updateAllSermons();
                    })
                    .then(() => setRefreshing(false));
                } else {
                  Toast.showWithGravity(strings.noConnection, 2, Toast.BOTTOM);
                }
              }}
            />
          }
          data={userSessionStore.allSermons}
          renderItem={({item}) => {
            return item.groupalbum ? (
              <AlbumListEntry
                key={`album-list-entry_${item.id}_${item.artistId}`}
                album={item.album}
                artist={item.artist?.name}
                genre={
                  item.Genres && item.Genres.length
                    ? item.Genres[0].name ?? undefined
                    : undefined
                }
              />
            ) : (
              <SingleSermonListEntry
                key={`sermon-list-entry_${item.id}_${item.artistId}`}
                sermon={item}
              />
            );
          }}
          onEndReachedThreshold={5}
          onEndReached={() => {
            if (!apiStore.isLoadingAllSermons) {
              apiStore.updateAllSermons();
            }
          }}
        />
        <GestureRecognizer
          onSwipeDown={() => {
            if (!gestureRecognizerActive) return;
            userSessionStore.setFilterViewVisible(false);
          }}>
          <Modal
            visible={userSessionStore.filterModalVisible}
            animationType="slide"
            presentationStyle="fullScreen">
            <FilterView
              setGestureRecognizerActive={setGestureRecognizerActive}
            />
          </Modal>
        </GestureRecognizer>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterInfo: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  filterInfoText: {margin: 5, color: Appearance.greyColor, fontSize: 11},
});
