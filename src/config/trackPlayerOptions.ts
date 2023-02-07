import {Capability, MetadataOptions} from 'react-native-track-player';

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
