import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SingleSermonListEntry} from '../lists/singleSermonListEntry';
import {ListInfo} from '../ListInfo';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';
import {Appearance} from '../../appearance';
import SearchBar from 'react-native-dynamic-search-bar';
import {useDebouncedValue} from '../../hooks/useDebouncedValue';

export const SearchView = observer(() => {
  const {userSessionStore, apiStore} = useStores();
  const [initiallyLoaded, setInitiallyLoaded] = React.useState(true);
  const [debouncedValue, setDebouncedValue] = useDebouncedValue('', 1000);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(true);

  const search = React.useCallback(() => {
    setInitiallyLoaded(false);
    apiStore.updateSearchedSermons(debouncedValue, true);
  }, [debouncedValue]);

  React.useEffect(() => {
    search();
  }, [search]);

  const handleOnChangeText = (text: string) => {
    setDebouncedValue(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        style={styles.searchBar}
        searchIconImageStyle={{tintColor: Appearance.greyColor}}
        clearIconImageStyle={{tintColor: Appearance.baseColor}}
        placeholderTextColor={Appearance.greyColor}
        placeholder={strings.search}
        onChangeText={handleOnChangeText}
      />
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={
            initiallyLoaded || apiStore.isLoadingSearch ? null : (
              <ListInfo info={strings.noEntriesFound} />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={apiStore.isLoadingSearch}
              onRefresh={async () => {
                search();
              }}
            />
          }
          data={userSessionStore.searchedSermons}
          renderItem={({item}) => {
            return (
              <SingleSermonListEntry
                key={`singleSermonListEntry_${item.id}`}
                sermon={item}
              />
            );
          }}
          onEndReachedThreshold={5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              if (!apiStore.isLoadingSearch) {
                setOnEndReachedCalledDuringMomentum(true);
                apiStore.updateSearchedSermons(debouncedValue);
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    width: '100%',
    borderRadius: 0,
    borderBottomColor: Appearance.greyColor,
    borderBottomWidth: 1,
  },
});
