import {RootStore} from './rootStore';
import {makeObservable, observable, action, runInAction} from 'mobx';
import RNFS, {DownloadProgressCallbackResult} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Sermon} from '../types/userSessionStoreTypes';
import {LocalDate} from '@js-joda/core';

export interface LocalSermon extends Sermon {
  path: string;
}

export interface DownloadingItem {
  id: string;
  jobId: number;
  progress: number;
}

export interface FavorisedSermon {
  sermon: Sermon;
}

export interface HistorySermon {
  sermon: Sermon;
  date: LocalDate;
}

export class StorageStore {
  root: RootStore;
  sermonsSavedStorageKey: string = '@DWGLoadRN:SermonsSaved';
  sermonsFavorisedStorageKey: string = '@DWGLoadRN:SermonsFavorised';
  sermonsPositionsStoregeKey: string = '@DWGLoadRN:SermonsPositions';
  sermonsHistoryStorageKey: string = '@DWGLoadRN:SermonsHistory';
  localPathBase: string = RNFS.DocumentDirectoryPath;
  sermonsDownloaded: LocalSermon[] = [];
  sermonsFavorised: FavorisedSermon[] = [];
  sermonsHistory: HistorySermon[] = [];
  sermonsPositions: {id: string; position: number}[] = [];
  currentlyDownloading: DownloadingItem[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this, {
      sermonsDownloaded: observable,
      sermonsFavorised: observable,
      sermonsPositions: observable,
      sermonsHistory: observable,
      currentlyDownloading: observable,
    });
  }

  stopDownladSermon = action((sermon: Sermon) => {
    const job = this.currentlyDownloading.find(cd => cd.id === sermon.id);
    if (job) {
      RNFS.stopDownload(job.jobId);
      const path = `${RNFS.DocumentDirectoryPath}/${job.id}${
        sermon.isVideo ? '.mp4' : '.mp3'
      }`;
      RNFS.unlink(path);
      runInAction(() => {
        this.currentlyDownloading = this.currentlyDownloading.filter(
          cd => cd.id !== job.id,
        );
        this.setSermonsDownloadedList();
      });
    }
  });

  deleteSermon = async (sermon: Sermon) => {
    const path = `${RNFS.DocumentDirectoryPath}/${sermon.id}${
      sermon.isVideo ? '.mp4' : '.mp3'
    }`;
    await RNFS.unlink(path);
    this.setSermonsDownloadedList();
  };

  deleteAllSermons = async () => {
    let error = false;
    this.sermonsDownloaded.forEach(async sermon => {
      try {
        await this.deleteSermon(sermon);
      } catch {
        error = true;
      }
    });
    return !error;
  };

  downloadSermon = action(async (sermon: Sermon) => {
    try {
      const {id} = sermon;

      const filePath = `${RNFS.DocumentDirectoryPath}/${id}${
        sermon.isVideo ? '.mp4' : '.mp3'
      }`;

      const {jobId, promise} = RNFS.downloadFile({
        fromUrl: sermon.downloadUrl,
        toFile: filePath,
        discretionary: true,
        background: true,
        progressInterval: 1000,
        begin: () => {
          runInAction(() => {
            this.currentlyDownloading.push({
              id: sermon.id,
              jobId: jobId,
              progress: 0,
            });
          });
        },
        progress: (res: DownloadProgressCallbackResult) => {
          let progressPercent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
          const object = this.currentlyDownloading.find(
            item => item.jobId === jobId,
          );
          if (object) {
            runInAction(() => {
              object.progress = progressPercent;
            });
          }
        },
      });
      const {statusCode} = await promise;

      const sermonWithLocalURI = this.handleDownloadSermonResult(
        statusCode,
        filePath,
        sermon,
      );

      return sermonWithLocalURI;
    } catch (err) {
      throw err;
    }
  });

  private handleDownloadSermonResult = action(
    (statusCode: number, path: string, sermon: Sermon) => {
      if (statusCode === 200) {
        const sermonWithLocalURI: LocalSermon = {
          ...sermon,
          path,
        };

        this.addSermonToSavedSermonsList(sermonWithLocalURI);

        this.currentlyDownloading = this.currentlyDownloading.filter(
          item => item.id !== sermonWithLocalURI.id,
        );

        this.sermonsDownloaded.push(sermonWithLocalURI);

        return sermonWithLocalURI;
      }
      throw new Error(
        'Something goes wrong when trying to Download the Sermon',
      );
    },
  );

  private addSermonToSavedSermonsList = action(
    async (sermonToSave: LocalSermon) => {
      try {
        const isSermonSaved =
          this.sermonsDownloaded.findIndex(
            sermonSaved => sermonSaved.id === sermonToSave.id,
          ) >= 0;

        if (!isSermonSaved) {
          await this.persistItemInStorage(this.sermonsSavedStorageKey, [
            ...this.sermonsDownloaded,
            sermonToSave,
          ]);
          this.setSermonsDownloadedList();
        }
      } catch (err) {
        console.log(err);
      }
    },
  );

  private persistItemInStorage = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  private getSermonsSaved = async () => {
    const rawSermonsSaved = await this.getItemFromStorage(
      this.sermonsSavedStorageKey,
      [],
    );

    const sermonsSaved =
      typeof rawSermonsSaved === 'string'
        ? JSON.parse(rawSermonsSaved)
        : rawSermonsSaved;

    return sermonsSaved;
  };

  private getSermonsFavorised = async () => {
    const rawSermonsFavorised = await this.getItemFromStorage(
      this.sermonsFavorisedStorageKey,
      [],
    );

    const sermonsFavorised =
      typeof rawSermonsFavorised === 'string'
        ? JSON.parse(rawSermonsFavorised)
        : rawSermonsFavorised;

    return sermonsFavorised;
  };

  private getSermonsHistory = async () => {
    const rawSermonsHistory = await this.getItemFromStorage(
      this.sermonsHistoryStorageKey,
      [],
    );

    const sermonsHistory =
      typeof rawSermonsHistory === 'string'
        ? JSON.parse(rawSermonsHistory)
        : rawSermonsHistory;

    return sermonsHistory;
  };

  private getSermonsPositions = async () => {
    const rawSermonsPositions = await this.getItemFromStorage(
      this.sermonsPositionsStoregeKey,
      [],
    );

    const sermonsPositions =
      typeof rawSermonsPositions === 'string'
        ? JSON.parse(rawSermonsPositions)
        : rawSermonsPositions;

    return sermonsPositions;
  };

  private getItemFromStorage = async (key: string, defaultValue: any) => {
    try {
      const valueFromStorage = await AsyncStorage.getItem(key);

      return valueFromStorage || defaultValue;
    } catch (error) {
      console.log(error);
    }

    return defaultValue;
  };

  setSermonsFavorisedList = action(async () => {
    try {
      const sermonsFromFS = await this.getSermonsFavorised();

      runInAction(() => {
        this.sermonsFavorised = sermonsFromFS;
      });
    } catch (err) {
      console.log(err);
    }
  });

  setSermonsHistoryList = action(async () => {
    try {
      const sermonsFromFS = await this.getSermonsHistory();

      runInAction(() => {
        this.sermonsHistory = sermonsFromFS;
      });
    } catch (err) {
      console.log(err);
    }
  });

  deleteSermonsHistory = async () => {
    try {
      await this.persistItemInStorage(this.sermonsHistoryStorageKey, []);
      this.setSermonsHistoryList();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  setSermonsPositionsList = action(async () => {
    try {
      const sermonsFromFS = await this.getSermonsPositions();

      runInAction(() => {
        this.sermonsPositions = sermonsFromFS;
      });
    } catch (err) {
      console.log(err);
    }
  });

  setSermonsDownloadedList = action(async () => {
    try {
      const sermonsFromFS = await this.getSermonsSaved();

      const sermonsDownloaded = await this.getSermonsDownloadedFromFS(
        sermonsFromFS,
      );

      this.persistItemInStorage(this.sermonsSavedStorageKey, sermonsDownloaded);
      runInAction(() => {
        this.sermonsDownloaded = sermonsDownloaded;
      });
    } catch (err) {
      console.log(err);
    }
  });

  private getSermonsDownloadedFromFS = async sermonsFromFS => {
    try {
      const directoryContent = await RNFS.readDir(RNFS.DocumentDirectoryPath);

      const directoryFiles = directoryContent.filter(directoryItem =>
        directoryItem.isFile(),
      );

      const sermonsDownloaded = sermonsFromFS.filter(sermonFromFS => {
        const sermonFilename = `${sermonFromFS.id}.`;

        const isSermonsStillDownloaded = directoryFiles.some(file =>
          file.name.startsWith(sermonFilename),
        );

        return isSermonsStillDownloaded;
      });

      return sermonsDownloaded;
    } catch (err) {
      throw err;
    }
  };

  addSermonToFavorisedSermonsList = action(async (sermon: Sermon) => {
    try {
      const isSermonSaved =
        this.sermonsFavorised.findIndex(
          sermonFavorised =>
            sermonFavorised.sermon !== undefined &&
            sermonFavorised.sermon.id === sermon.id,
        ) >= 0;

      if (!isSermonSaved) {
        await this.persistItemInStorage(this.sermonsFavorisedStorageKey, [
          ...this.sermonsFavorised,
          {sermon: sermon},
        ]);
        this.setSermonsFavorisedList();
      }
    } catch (err) {
      console.log(err);
    }
  });

  addSermonToHistoryList = action(async (sermon: Sermon) => {
    console.log('add sermon to history: ', sermon.title, sermon.id);
    try {
      const cleanedSermonHistory = this.sermonsHistory.filter(
        sermonInHistory =>
          sermonInHistory.sermon.id !== sermon.id ||
          (sermonInHistory.sermon.id === sermon.id &&
            sermonInHistory.date !== LocalDate.now().toString()),
      );

      await this.persistItemInStorage(this.sermonsHistoryStorageKey, [
        ...cleanedSermonHistory,
        {sermon: sermon, date: LocalDate.now()},
      ]);
      this.setSermonsHistoryList();
    } catch (err) {
      console.log(err);
    }
  });

  removeFavorisedSermon = action(async (sermon: Sermon) => {
    try {
      const isSermonSaved =
        this.sermonsFavorised.findIndex(
          sermonSaved => sermonSaved.sermon.id === sermon.id,
        ) >= 0;

      if (isSermonSaved) {
        await this.persistItemInStorage(
          this.sermonsFavorisedStorageKey,
          this.sermonsFavorised.filter(
            sermonFavorised => sermonFavorised.sermon.id !== sermon.id,
          ),
        );
        this.setSermonsFavorisedList();
      }
    } catch (err) {
      console.log(err);
    }
  });

  removeAllFavorisedSermons = async () => {
    try {
      await this.persistItemInStorage(this.sermonsFavorisedStorageKey, []);
      this.setSermonsFavorisedList();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  addSermonPosition = action(async (sermon: Sermon, position: number) => {
    console.log('save position: ', sermon.title, sermon.id, position);
    try {
      const isSermonsPositionSaved =
        this.sermonsPositions.findIndex(
          sermonSaved => sermonSaved.id === sermon.id,
        ) >= 0;
      if (!isSermonsPositionSaved) {
        await this.persistItemInStorage(this.sermonsPositionsStoregeKey, [
          ...this.sermonsPositions,
          {id: sermon.id, position: position},
        ]);
      } else {
        await this.persistItemInStorage(this.sermonsPositionsStoregeKey, [
          ...this.sermonsPositions.filter(
            sermonSaved => sermon.id !== sermonSaved.id,
          ),
          {id: sermon.id, position: position},
        ]);
      }
      this.setSermonsPositionsList();
    } catch (err) {
      console.log(err);
    }
  });
}
