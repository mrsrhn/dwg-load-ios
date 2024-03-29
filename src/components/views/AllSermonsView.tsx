import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {AlbumListEntry} from '../lists/albumListEntry';
import {Appearance} from '../../appearance';

import Toast from 'react-native-simple-toast';
import {strings} from '../../strings';
import {useNetInfo} from '@react-native-community/netinfo';
import {ListInfo} from '../ListInfo';
import {useStores} from '../../hooks/useStores';
import {wait} from '../../common/wait';

export const AllSermonsView = observer(() => {
  const {userSessionStore, apiStore, filterStore} = useStores();
  const [refreshing, setRefreshing] = React.useState(false);
  const netInfo = useNetInfo();

  const activeFilters = [
    filterStore.filteredArtist,
    filterStore.filteredGenre,
    filterStore.filteredBook,
    filterStore.filteredChapter,
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
        {apiStore.isLoadingAllSermons ? (
          <ActivityIndicator style={{paddingTop: 20}} size="large" />
        ) : (
          <FlatList
            ListEmptyComponent={
              !netInfo.isInternetReachable ? (
                <ListInfo info={strings.noConnection} />
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
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
                    Toast.showWithGravity(
                      strings.noConnection,
                      2,
                      Toast.BOTTOM,
                    );
                  }
                }}
              />
            }
            data={userSessionStore.allSermons}
            renderItem={({item}) => {
              return item.groupalbum ? (
                <AlbumListEntry
                  key={`all_album-list-entry_${item.id}_${item.artistId}`}
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
                  key={`all_sermon-list-entry_${item.id}_${item.artistId}`}
                  sermon={item}
                />
              );
            }}
            onEndReachedThreshold={5}
            onEndReached={() => {
              if (!apiStore.isLoadingAllSermons) {
                apiStore.updateAllSermons(true);
              }
            }}
          />
        )}
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
