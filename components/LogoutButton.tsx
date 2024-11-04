import { FC } from "react";
import { TouchableOpacity } from "react-native"
import LogoutIcon from "../icons/LogOutIcon";
import { useNavigation, useRoute } from "@react-navigation/native";

type Props = {
  onPress?: () => void;
}

const LogoutButton: FC<Props> = ({ onPress = () => {} }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <TouchableOpacity onPress={onPress}>
      <LogoutIcon />
    </TouchableOpacity>
  );
};

export default LogoutButton;