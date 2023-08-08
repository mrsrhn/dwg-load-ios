import {
  Capability,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  MetadataOptions,
} from 'react-native-track-player';

export const trackPlayerOptions: MetadataOptions = {
  forwardJumpInterval: 10,
  backwardJumpInterval: 10,
  progressUpdateEventInterval: 1,
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpBackward,
    Capability.JumpForward,
    Capability.SeekTo,
  ],
};

export const setupOptions = {
  iosCategory: IOSCategory.Playback,
  iosCategoryMode: IOSCategoryMode.SpokenAudio,
  iosCategoryOptions: [
    IOSCategoryOptions.AllowAirPlay,
    IOSCategoryOptions.AllowBluetooth,
    IOSCategoryOptions.AllowBluetoothA2DP,
  ],
};
