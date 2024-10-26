import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapScreen from "../Screens/MapScreen";
import HomeScreen from "@/Screens/HomeScreen";
import CommentsScreen from "@/Screens/CommentsScreen";
import CreatePostsScreen from "@/Screens/CreatePostsScreen";
import LogoutIcon from "@/icons/LogOutIcon";
import BlocksIcon from "@/icons/BlocksIcon";
import UserIcon from "@/icons/UserIcon";
import BackButton from "../components/BackButton";
import PfofileScreen from "@/Screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ navigation }) => ({
				headerRightContainerStyle: { paddingRight: 16 },
				headerLeftContainerStyle: { paddingLeft: 16 },
				tabBarLabel: "",
				tabBarStyle: { paddingBottom: 9 },
			})}
		>

			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Публікації",
					headerRight: () => <LogoutIcon />,
					tabBarIcon: ({ focused }) => (
						<View >
							<BlocksIcon />
						</View>
					),
				}}
			/>

			<Tab.Screen
				name="CreatePosts"
				component={CreatePostsScreen}
				options={({ navigation }) => ({
					title: "Cтворити публікаці",
					headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
					tabBarIcon: ({ focused }) => (
						<View style={styles.activeTabIcon}>
							<Ionicons
								name="add"
								size={24}
								color={"#FFFFFF"}
							/>
						</View>
					),
				})}
			/>

			<Tab.Screen
				name="Profile"
				component={PfofileScreen}
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<UserIcon
							color={focused ? "#FFFFFF" : "black"}
						/>

					),
				}}
			/>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	activeTabIcon: {
		backgroundColor: "#FF6C00",
		borderRadius: 20,
		width: 70,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	active: {
		color: "#FF6C00"
	}
});

export default BottomTabNavigator;