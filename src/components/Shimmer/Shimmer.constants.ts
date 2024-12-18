import { Easing } from 'react-native-reanimated';

import responsiveSize from 'theme/responsiveSize';

export const INITIAL_ANIMATION_WIDTH = 225;

export const SHIMMER_ANIMATION_CONFIG = {
  duration: 1000,
  easing: Easing.linear,
};

export const SHIMMER_STYLE_MAP = {
  line: {
    height: 11,
    width: '25%',
  },
  button: {
    borderRadius: 64,
  },
  rect: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  cardCircle: {
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  card: {
    height: responsiveSize(140),
  },
  input: {
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 56,
  },
};
