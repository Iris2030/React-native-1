import React, { FC, useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
	Animated,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import CommentIcon from "../icons/CommentIcon";
import LocationIcon from "../icons/LocationIcon";
import LikeIcon from "../icons/LikeIcon";
import CommentOrangeIcon from "../icons/CommentOrangeIcon";
import CloseIcon from "../icons/closeIcon";
import LogoutIcon from "../icons/LogOutIcon";
import { RootState } from "../redux/store/store";
import { db } from '../newConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getImageUrl, updateUserInFirestore, uploadImage } from "../utils/firestore";
import { setUserInfo } from "../redux/reducers/useSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const ProfileScreen = () => {
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [buttonRotation, setButtonRotation] = useState(new Animated.Value(0));
	const userInfo = useSelector((state: RootState) => state.user.userInfo);
	const [userName, setUserName] = useState<string>(userInfo?.displayName || '')
	const [userPosts, setUserPosts] = useState([]);
	const userId = userInfo?.uid;
	const dispatch = useDispatch();


	useEffect(() => {
		const loadUserPosts = async () => {
			if (userId) {
				const posts = await fetchUserPosts(userId);
				setUserPosts(posts);
			}
		};

		loadUserPosts();
	}, [userId]);

	const fetchUserPosts = async (userId: string) => {
		const postsCollection = collection(db, "posts");
		const q = query(postsCollection, where("userId", "==", userId));
		const querySnapshot = await getDocs(q);

		const userPosts = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));

		return userPosts;
	};

	// const posts = [
	// 	{
	// 		image: require("../assets/images/sunset.jpeg"),
	// 		likes: 10,
	// 		comments: 0,
	// 		location: 'Ukraine'
	// 	},
	// 	{
	// 		image: require("../assets/images/forest.jpeg"),
	// 		likes: 5,
	// 		comments: 5,
	// 		location: 'Ukraine'
	// 	},
	// 	{
	// 		image: require("../assets/images/sunset.jpeg"),
	// 		likes: 10,
	// 		comments: 0,
	// 		location: 'Ukraine'
	// 	},
	// ];

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	// Завантаження зображення та отримання URL
	const handleImageUpload = async (
		userId: string,
		file: File | Blob,
		fileName: string,
	) => {
		try {
			console.log('FILE', file)
			// Завантажуємо зображення
			const imageRef = await uploadImage(userId, file, fileName);

			// // Отримуємо URL завантаженого зображення
			const imageUrl = await getImageUrl(imageRef);

			console.log('Image URL:', imageUrl);
			return imageUrl;
		} catch (error) {
			console.error('Error uploading image and getting URL:', error);
		}
	};

	const onUserNameChange = async () => {
		if (!userInfo) return;

		try {
			await updateUserInFirestore(userInfo?.uid, {
				displayName: userName,
			});

			dispatch(setUserInfo({ ...userInfo, displayName: userName }))
		} catch (error) {
			console.log(error);
		}
	}

	const selectImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

		if (!result.canceled && result.assets && result.assets.length > 0 && userInfo) {
			const uri = result.assets[0].uri
			setProfileImage(uri);
			rotateButton();

			const response = await fetch(uri);
			const file = await response.blob();

			// // Перетворюємо Blob на File, якщо це необхідно
			const fileName = uri.split('/').pop() || "123"; // Отримуємо ім'я файлу з URI
			const fileType = file.type; // Отримуємо тип файлу

			console.log('FILE NAME', fileName)

			const imageFile = new File([file], fileName, { type: fileType });

			// // Завантажуємо зображення
			const imageUrl = await handleImageUpload(userInfo.uid, imageFile, fileName);

			await updateUserInFirestore(userInfo.uid, { profileImage: imageUrl })

			dispatch(setUserInfo({
				...userInfo,
				profileImage: imageUrl,
			}));
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

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<ScrollView style={{ flex: 1 }}>
				<Image
					source={require("../assets/images/background.jpeg")}
					style={styles.backgroundImage}
				/>

				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<View style={styles.formContainer}>
						<View style={styles.profileImageContainer}>
							{userInfo?.profileImage ? (
								<Image
									source={{ uri: profileImage }}
									style={styles.profileImage}
								/>
							) : (
								<Image
									source={require("../assets/images/avatar.jpg")}
									style={styles.profileImage}
								/>
							)}
							<TouchableOpacity
								style={[
									styles.addButton,
									{
										borderColor: "#E8E8E8"
									},
								]}
								onPress={profileImage ? removeImage : selectImage}
							>
								<CloseIcon />

							</TouchableOpacity>
						</View>
						<LogoutIcon style={styles.logoutBtn} />
						<Text style={styles.profileName}>Natali Romanova</Text>

						{userPosts && userPosts.map((post) => (
							<View key={post.id} style={styles.post}>
								<Text style={styles.postTitle}>{post.name}</Text>
								<Image source={{ uri: post.capturedImage }} style={styles.postImage} />

								<View style={styles.postDetails}>
									<View style={styles.leftContainer}>
										<View style={styles.commentsContainer}>
											{post.comments ? <CommentOrangeIcon /> : <CommentIcon />}
											<Text style={[styles.postComments, {
												color: post.comments ? '#212121' : '#BDBDBD'
											}]}>{post.comments}</Text>
										</View>
										<View style={styles.likesContainer}>
											<LikeIcon />
											<Text style={styles.postComments}>{post.likes}</Text>
										</View>
									</View>
									<View style={styles.commentsContainer}>
										<LocationIcon />
										<Text style={styles.postLocation}>{post.location}</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	backgroundImage: {
		position: "absolute",
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	formContainer: {
		position: "relative",
		marginTop: 285,
		height: "100%",
		width: "100%",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 16,
		alignItems: "center",
	},
	profileImageContainer: {
		position: "absolute",
		top: -60,
		left: "50%",
		transform: [{ translateX: -50 }],
		width: 120,
		height: 120,
		marginBottom: 32,
	},
	profileName: {
		marginTop: 92,
		fontWeight: 500,
		fontSize: 30,
		color: '#212121',
		marginBottom: 33,
	},
	profileImage: {
		height: 120,
		width: 120,
		backgroundColor: "#F6F6F6",
		borderRadius: 20,
	},
	placeholder: {
		height: 120,
		width: 120,
		backgroundColor: "#F6F6F6",
		borderRadius: 20,
		paddingHorizontal: 16,
		alignItems: "center",
	},
	addButton: {
		position: "absolute",
		right: -15,
		bottom: 14,
		width: 30,
		height: 30,
		backgroundColor: "#fff",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#FF6C00",
	},
	logoutBtn: {
		marginLeft: 'auto'
	},
	addButtonText: {
		fontSize: 30,
		position: "absolute",
		top: -6,
		left: 5,
		fontWeight: "100",
	},
	PostContainer: {
		alignItems: "center",
		alignSelf: "flex-start",
		marginBottom: 34,
	},
	postImage: {
		width: SCREEN_WIDTH - 32,
		height: 240,
		borderRadius: 8,
	},
	postDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: "space-between",
		width: SCREEN_WIDTH - 32,
		marginTop: 8,
	},
	postName: {
		alignSelf: 'flex-start',
		fontSize: 16,
		fontWeight: "500",
		marginTop: 8,
	},
	commentsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	likesContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 24
	},
	postComments: {
		color: '#212121',
		fontSize: 16,
		fontWeight: "400",
	},
	postLocation: {
		fontSize: 16,
		fontWeight: "400",
		textDecorationLine: 'underline',
	},
	leftContainer: {
		flexDirection: 'row',
	},
});

export default ProfileScreen;