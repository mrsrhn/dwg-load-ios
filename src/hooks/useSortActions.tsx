import React from 'react';
import {ActionSheetIOS} from 'react-native';
import {SortOption} from '../types/userSessionStoreTypes';
import {strings} from '../strings';
import {useStores} from './useStores';

const sortOptions: {name: string; shortName: string; id: SortOption}[] = [
  {
    name: strings.sortOptionName,
    shortName: strings.sortOptionNameShort,
    id: 'title',
  },
  {
    name: strings.sortOptionDate,
    shortName: strings.sortOptionDateShort,
    id: 'year',
  },
  {
    name: strings.sortOptionDuration,
    shortName: strings.sortOptionDurationShort,
    id: 'playtime',
  },
  {
    name: strings.sortOptionMostHeared,
    shortName: strings.sortOptionMostHearedShort,
    id: 'listen',
  },
  {
    name: strings.sortOptionNew,
    shortName: strings.sortOptionNewShort,
    id: 'new',
  },
];

export const useSortActions = () => {
  const {userSessionStore, apiStore} = useStores();

  const [selectedOption, setSelectedOption] = React.useState(sortOptions[0]);

  const openSortActions = () => {
    const options = {
      options: [
        strings.cancel,
        ...Array.from(sortOptions, option => option.name),
      ],
      cancelButtonIndex: 0,
      title: strings.sortBy,
    };
    const actionSheetCallback = async (buttonIndex: number | undefined) => {
      if (buttonIndex === 0 || buttonIndex === undefined) return;
      const option =
        sortOptions.find((_, index) => index === buttonIndex - 1) ||
        sortOptions[0];
      userSessionStore.updateSortParameter(option.id);
      setSelectedOption(option);
      await apiStore.resetAllSermons();
      apiStore.updateAllSermons();
    };
    ActionSheetIOS.showActionSheetWithOptions(options, actionSheetCallback);
  };

  return {openSortActions: openSortActions, selectedOption: selectedOption};
};
