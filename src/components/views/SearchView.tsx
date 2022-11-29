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
import SearchBar from 'react-native-search-bar';
import {Appearance} from '../../appearance';
import {ListInfo} from '../ListInfo';
import {strings} from '../../strings';
import {useStores} from '../../hooks/useStores';

export const SearchView = observer(() => {
  const {userSessionStore, apiStore} = useStores();
  const [initiallyLoaded, setInitiallyLoaded] = React.useState(true);
  const searchBar = React.useRef(null);
  const [searchString, setSearchString] = React.useState('');

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = React.useState(true);

  const onSearch = (givenString: string) => {
    setInitiallyLoaded(false);
    apiStore.updateSearchedSermons(givenString, true);
    searchBar.current.unFocus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        ref={searchBar}
        tintColor={Appearance.darkColor}
        cancelButtonText={strings.cancel}
        placeholder={searchString || strings.enterSearchString}
        onChangeText={text => setSearchString(text)}
        onSearchButtonPress={text => onSearch(text)}
        textColor="black"
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
                onSearch(searchString);
              }}
            />
          }
          data={userSessionStore.searchedSermons}
          renderItem={({item}) => {
            return <SingleSermonListEntry key={item.title} sermon={item} />;
          }}
          onEndReachedThreshold={5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              if (!apiStore.isLoadingSearch) {
                setOnEndReachedCalledDuringMomentum(true);
                apiStore.updateSearchedSermons(searchString);
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
});
