import React from 'react';
import Svg from 'react-native-svg';

function SvgWrapper({ children, height = '100%', width = '100%', ...rest }: any) {
  return (
    <Svg height={height} width={width} {...rest}>
      {children}
    </Svg>
  );
}

export default SvgWrapper;
