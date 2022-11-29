import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Collection} from '../../types/apiStoreTypes';
import {Appearance} from '../../appearance';
import {useStores} from '../../hooks/useStores';

export const CollectionListEntry = (props: {collection: Collection}) => {
  const navigation = useNavigation();
  const {apiStore} = useStores();

  const handleCollectionPress = () => {
    apiStore.updateCollectionTitles(props.collection.id);
    navigation.navigate('CollectionList', {
      collectionId: props.collection.id,
      name: props.collection.name,
    });
  };
  return (
    <TouchableHighlight onPress={handleCollectionPress} underlayColor="white">
      <View style={styles.button}>
        <Text style={styles.collectionName}>{props.collection.name} </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.greyColor,
    backgroundColor: 'white',
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  collectionName: {
    textAlign: 'center',
    color: Appearance.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
