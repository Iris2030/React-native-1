import React from 'react';
import Svg, { Path ,SvgProps } from 'react-native-svg';

const CloseIcon = (props: SvgProps) => (
  <Svg width={11} height={11} viewBox="0 0 11 11" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25736 0.550253L0.550258 1.25736L4.7929 5.5L0.550258 9.74264L1.25736 10.4497L5.50001 6.20711L9.74265 10.4497L10.4498 9.74264L6.20711 5.5L10.4498 1.25736L9.74265 0.550253L5.50001 4.79289L1.25736 0.550253Z"
      fill="#BDBDBD"
    />
  </Svg>
);

export default CloseIcon;