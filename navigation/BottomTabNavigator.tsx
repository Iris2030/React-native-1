import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapScreen from "../Screens/MapScreen";
import HomeScreen from "../Screens/HomeScreen";
import CommentsScreen from "../Screens/CommentsScreen";
import CreatePostsScreen from "../Screens/CreatePostsScreen";
import BlocksIcon from "../icons/BlocksIcon";
import UserIcon from "../icons/UserIcon";
import BackButton from "../components/BackButton";
import ProfileScreen from "../Screens/ProfileScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { logoutDB } from "../utils/auth";
import { useDispatch } from "react-redux";
import LogoutButton from "../components/LogoutButton";

type BottomTabParamList = {
	Home: undefined;
	CreatePosts: undefined;
	Profile: undefined;
	Map: undefined;
	Camera: undefined;
	Comments: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
	  const dispatch = useDispatch();

	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ navigation }) => ({
				headerRightContainerStyle: { paddingRight: 16 },
				headerLeftContainerStyle: { paddingLeft: 16 },
				tabBarLabel: "",
				tabBarStyle: { paddingBottom: 9 },
				headerLeft: () => (
					<BackButton
						onPress={() => navigation.goBack()}
					/>
				),
			})}
		>

			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Публікації",
					headerRight: () => (
						<LogoutButton
						onPress={() => logoutDB(dispatch)}
						/>
					),
					headerLeft: () => null, 
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
					tabBarStyle: { display: "none" },
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
				component={ProfileScreen}
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

			<Tab.Screen
				name="Map"
				component={MapScreen}
				options={{
					title: "Map",
					headerShown: false,
					tabBarButton: () => null,
				}}
			/>

			<Tab.Screen
				name="Comments"
				component={CommentsScreen}
				options={({ navigation }) => ({
					title: "Коментарі",
					headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
					tabBarButton: () => null,
				})}
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