import { FC } from "react";
import { TouchableOpacity } from "react-native"

import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import { useNavigation, useRoute } from "@react-navigation/native";

type Props = {
  onPress?: () => void;
}

const BackButton: FC<Props> = ({ onPress = () => {} }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <TouchableOpacity onPress={onPress}>
      <ArrowLeftIcon />
    </TouchableOpacity>
  );
};

export default BackButton;