import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const ArrowLeftIcon = (props: SvgProps) => (
  <Svg
    {...props}
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.8}
      d="M20 12H4M10 18l-6-6 6-6"
    />
  </Svg>
)
export default ArrowLeftIcon;