import * as React from 'react';
import {FlatList, View, TouchableHighlight, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {observer} from 'mobx-react-lite';
import {useStores} from '../../../hooks/useStores';

export const Chapters = observer(() => {
  const {userSessionStore, filterStore} = useStores();
  const selectedChapter = filterStore.filteredChapter;
  return (
    <FlatList
      data={userSessionStore.chapters}
      renderItem={({item}) => (
        <TouchableHighlight underlayColor="white">
          <View style={styles.button}>
            <BouncyCheckbox
              size={25}
              fillColor="#8FC664"
              unfillColor="#FFFFFF"
              text={`Kapitel ${item.chapter}`}
              iconStyle={{borderColor: '#8FC664'}}
              textStyle={{
                textDecorationLine: 'none',
              }}
              disableBuiltInState={true}
              isChecked={selectedChapter?.id === item.id}
              onPress={() => {
                const isChecked = selectedChapter?.id === item.id;
                if (isChecked) {
                  filterStore.updateFilteredChapter(undefined);
                } else {
                  filterStore.updateFilteredChapter(item);
                }
              }}
            />
          </View>
        </TouchableHighlight>
      )}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
