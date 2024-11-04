import React, { FC, useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Keyboard,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	TextInput,
	Button,
	Image
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { colors } from "../styles/global";
import CameraIcon from "../icons/CameraIcon";
import LocationIcon from "../icons/LocationIcon";
import * as Location from 'expo-location';
import TrashIcon from "../icons/TrashIcon";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../newConfig";
import { addPost } from '../redux/reducers/postSlice'
import {createPost} from '../utils/firestore'
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

const CreatePostsScreen: FC = () => {
	const [isActiveBtn, setIsActiveBtn] = useState(false);
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [locationName, setLocationName] = useState("");
	const [location, setLocation] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState("");
	const [address, setAddress] = useState(null);
	const userInfo = useSelector((state: RootState) => state.user.userInfo);

	const camera = useRef();
	const dispatch = useDispatch();  // Initialize Redux dispatch
	const navigation = useNavigation();

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let loc = await Location.getCurrentPositionAsync({});
			setLocation(loc);
		})();
	}, []);

	useEffect(() => {
		return () => {
			setCapturedImage(null)
		}
	}, [])

	useEffect(() => {
		if (name && locationName && capturedImage) {
			setIsActiveBtn(true)
		}
		else {
			setIsActiveBtn(false)
		}
	}, [name, locationName, capturedImage])

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>We need your permission to show the camera</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	const takePhoto = async () => {
		if (!camera) return;
		const image = await camera?.current?.takePictureAsync();
		await MediaLibrary.saveToLibraryAsync(image.uri);
		setCapturedImage(image.uri)
	}

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};
	const handleClear = () => {
		setLocationName("")
		setCapturedImage(null)
		setName("")
		setIsActiveBtn(false)
	}

	const handlePublishAndSavePost = async () => {
		if (location) {
			const { latitude, longitude } = location.coords;
	
			// Reverse geocode to get the address
			let reverseGeocode = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			});
	
			if (reverseGeocode.length > 0) {
				const { city, region, country, street } = reverseGeocode[0];
				const currentLocation = `${street}, ${city}, ${region}, ${country}`;
				setAddress(currentLocation);
	
				// Prepare post data
				const postData = {
					id: Date.now().toString(), // Generates a unique ID for the post
					name,
					locationName,
					capturedImage,
					location: currentLocation,
					latitude,
					longitude,
				};
	
				try {
					// Use createPost to save the post data
					await createPost(userInfo.uid, postData);  
					console.log("Post successfully created!");
	
					// Dispatch the post data to Redux
					dispatch(addPost(postData));  // Make sure the addPost action is imported
	
					// Navigate back to the home screen or a success screen
					navigation.navigate('Home');
				} catch (error) {
					console.error("Error creating post: ", error);
				}
	
			} else {
				console.log("Reverse geocode failed. No address found.");
			}
		} else {
			console.log("Location not available");
		}
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.contentContainer}>
					<View style={styles.profileImageContainer}>
						{capturedImage ? (
							<View>
								<Image
									source={{ uri: capturedImage }}
									style={styles.capturedImage}
								/>
								<View style={styles.photoCircleLight}>
									<CameraIcon fill='#FFF' />
								</View>
							</View>
						) : (
							<CameraView ref={camera} style={styles.camera} facing={facing}>
								<View style={styles.buttonContainer}>
									<TouchableOpacity style={styles.photoCircle}
										onPress={takePhoto}>
										<CameraIcon />
									</TouchableOpacity>
								</View>
							</CameraView>
						)}
					</View>
					<Text style={styles.text}>Завантажте фото</Text>

					<TextInput
						style={styles.input}
						placeholder="Назва..."
						value={name}
						placeholderTextColor="#BDBDBD"
						onChangeText={setName}
					/>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.locationInput}
							placeholder="Місцевість..."
							placeholderTextColor="#BDBDBD"
							value={locationName}
							onChangeText={setLocationName}
						/>
						<LocationIcon style={styles.locationIcon} />
					</View>

					<TouchableOpacity
						onPress={handlePublishAndSavePost}  // Save post when published
						style={[isActiveBtn ? styles.registerButton : styles.registerButtonDisabled]}>
						<Text style={[isActiveBtn ? styles.registerButtonText : styles.registerButtonTextDisabled]}>
							Опублікувати</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleClear} style={styles.trashContainer}>
						<TrashIcon style={styles.trashIcon} />
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
	trashContainer: {
		position: 'relative',
		width: 70,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F6F6F6',
		marginTop: 111,
	},
	trashIcon: {
		position: 'absolute',
		top: 7,
		left: 23
	},
	profileImageContainer: {
		position: 'relative',
	},
	camera: {
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
		backgroundColor: "#FFFFFF",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	photoCircleLight: {
		position: "absolute",
		right: '50%',
		top: '50%',
		transform: [
			{ translateX: 30 },
			{ translateY: -25 },
		],
		width: 60,
		height: 60,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
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
		color: '#BDBDBD',
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
		paddingLeft: 28,
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
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
	},
	button: {
		flex: 1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	capturedImage: {
		width: SCREEN_WIDTH - 32,
		height: 240,
		borderRadius: 8,
	},
});

export default CreatePostsScreen;