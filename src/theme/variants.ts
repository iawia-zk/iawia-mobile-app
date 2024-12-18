import { TTextVariants } from './theme.types';

import { FONT_FAMILY, FONT_SIZE } from './fonts';

const textVariants: TTextVariants = {
  titleSection: {
    ...FONT_SIZE.titleSection,
    fontFamily: FONT_FAMILY.bold,
  },
  titleSubsection: {
    ...FONT_SIZE.titleSubsection,
    fontFamily: FONT_FAMILY.semiBold,
  },
  textBodyBold: {
    ...FONT_SIZE.textBody,
    fontFamily: FONT_FAMILY.semiBold,
  },
  textBody: {
    ...FONT_SIZE.textBody,
    fontFamily: FONT_FAMILY.regular,
  },
  textBodySubBold: {
    ...FONT_SIZE.textBodySub,
    fontFamily: FONT_FAMILY.semiBold,
  },
  textBodySub: {
    ...FONT_SIZE.textBodySub,
    fontFamily: FONT_FAMILY.regular,
  },
  textBodySmallBold: {
    ...FONT_SIZE.textSmall,
    fontFamily: FONT_FAMILY.semiBold,
  },
  textBodySmall: {
    ...FONT_SIZE.textSmall,
    fontFamily: FONT_FAMILY.regular,
  },
};

export { textVariants };
