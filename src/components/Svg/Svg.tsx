import React from 'react';
import Svg from 'react-native-svg';

function SvgWrapper({ children, ...rest }: any) {
  return <Svg {...rest}>{children}</Svg>;
}

SvgWrapper.defaultProps = {
  height: '100%',
  width: '100%',
};

export default SvgWrapper;
