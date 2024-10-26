import React, { FC, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
	Animated,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../styles/global";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { StackParamList } from "../navigation/StackNavigator";
import CameraIcon from "@/icons/CameraIcon";
import LocationIcon from "@/icons/LocationIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
type HomeScreenProps = NativeStackScreenProps<StackParamList, 'Signup'>;

const CreatePostsScreen: FC<HomeScreenProps> = ({ navigation, route }) => {
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [buttonRotation, setButtonRotation] = useState(new Animated.Value(0));
	const [isActiveBtn, setIsActiveBtn] = useState(false);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const selectImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setProfileImage(result.assets[0].uri);
			rotateButton();
		}
	};

	const rotateButton = () => {
		Animated.timing(buttonRotation, {
			toValue: 43,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const removeImage = () => {
		setProfileImage(null);
		setButtonRotation(new Animated.Value(0));
	};

	const interpolatedRotation = buttonRotation.interpolate({
		inputRange: [0, 43],
		outputRange: ["0deg", "43deg"],
	});

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard} >

			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.contentContainer}>
					<View style={styles.profileImageContainer}>
						{profileImage ? (
							<Image
								source={{ uri: profileImage }}
								style={styles.profileImage}
							/>
						) : (
							<View style={styles.placeholder} />
						)}
						<TouchableOpacity
							style={styles.photoCircle}
							onPress={profileImage ? removeImage : selectImage}
						>
							<CameraIcon />
						</TouchableOpacity>
						<Text style={styles.text}>Завантажте фото</Text>
					</View>

					<TextInput
						style={styles.input}
						placeholder="Назва..."
						placeholderTextColor="#BDBDBD"
					// value={ }
					/>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.locationInput}
							placeholder="Місцевість..."
							placeholderTextColor="#BDBDBD"
						// value={ }
						/>
						<LocationIcon style={styles.locationIcon} />
					</View>

					<TouchableOpacity
						style={[isActiveBtn ? styles.registerButton : styles.registerButtonDisabled]}>
						<Text style={[isActiveBtn ? styles.registerButtonText : styles.registerButtonTextDisabled]}>
							Опублікувати</Text>
					</TouchableOpacity>
				</View>

			</KeyboardAvoidingView>

		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	contentContainer: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 32,
	},
	profileImageContainer: {
		position: 'relative',
		marginBottom: 32,
	},
	profileImage: {
		height: 120,
		width: 120,
		backgroundColor: "#F6F6F6",
		borderRadius: 20,
		padding: 16,
		alignItems: "center",
	},
	placeholder: {
		width: SCREEN_WIDTH - 32,
		height: 240,
		borderRadius: 8,
		backgroundColor: "#F6F6F6",
		alignSelf: "center",
		marginTop: 32,
		borderWidth: 1,
		borderColor: "#E8E8E8",
	},
	photoCircle: {
		position: "absolute",
		right: '50%',
		top: '50%',
		transform: [
			{ translateX: 30 },
			{ translateY: -25 },
		],
		width: 60,
		height: 60,
		backgroundColor: "#fff",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	addButtonText: {
		fontSize: 30,
		position: "absolute",
		top: -6,
		left: 5,
		fontWeight: "100",
	},
	registerButton: {
		width: "100%",
		height: 50,
		backgroundColor: "#ff7f00",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 100,
		marginBottom: 16,
		marginTop: 32,
	},
	registerButtonDisabled: {
		width: "100%",
		height: 50,
		backgroundColor: "#F6F6F6",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 100,
		marginBottom: 16,
		marginTop: 32,
	},
	registerButtonText: {
		fontFamily: "Roboto-Regular",
		color: "white",
		fontSize: 16,
	},
	registerButtonTextDisabled: {
		fontFamily: "Roboto-Regular",
		color: '#BDBDBD',
		fontSize: 16,
	},
	text: {
		alignSelf: 'flex-start',
		fontSize: 16,
		fontWeight: "400",
		marginTop: 8,
		color: '#BDBDBD'
	},
	inputContainer: {
		width: SCREEN_WIDTH - 32,
		position: 'relative',
	},
	input: {
		width: "100%",
		height: 50,
		backgroundColor: "#ffffff",
		borderColor: "#E8E8E8",
		borderBottomWidth: 1,
		marginBottom: 16,
		fontSize: 16,
		fontWeight: 500,
	},
	locationInput: {
		width: "100%",
		height: 50,
		backgroundColor: "#ffffff",
		borderColor: "#E8E8E8",
		borderBottomWidth: 1,
		marginBottom: 16,
		fontSize: 16,
		fontWeight: 500,
		paddingLeft: 28
	},
	locationIcon: {
		position: "absolute",
		left: 0,
		top: 13,
		backgroundColor: "#fff",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default CreatePostsScreen;
