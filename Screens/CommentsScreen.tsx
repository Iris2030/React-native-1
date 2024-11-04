import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
} from "react-native";
import { colors } from "../styles/global";
import { useDispatch, useSelector } from 'react-redux';
import { addComment, setComments } from '../redux/reducers/commentsSlice';  
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { db } from '../newConfig'; 
import UpArrowIcon from "../icons/UpArrowIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const CommentsScreen = ({ route }) => {
    const dispatch = useDispatch();
    const { postId } = route.params; // Get postId from route params
    const comments = useSelector((state) => state.comments[postId] || []);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            // Get the comments collection for the specific post
            const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
            const commentsSnapshot = await getDocs(commentsCollectionRef);
            const fetchedComments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dispatch(setComments({ postId, comments: fetchedComments }));
        };

        fetchComments();
    }, [postId, dispatch]);

    const handleCommentSubmit = async () => {
        if (commentText.trim() === "") return;

        const newComment = {
            text: commentText,
            createdAt: new Date(),
        };

        // Save comment to Firestore
        const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
        await addDoc(commentsCollectionRef, newComment);

        // Dispatch the action to update Redux state
        dispatch(addComment({ postId, comment: newComment }));

        // Clear input field
        setCommentText("");
    };
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >

                <View style={styles.PostContainer}>
                    <Image
                        source={require("../assets/images/forest.jpeg")}
                        style={styles.postImage}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Коментувати..."
                        placeholderTextColor="#BDBDBD"
                    // value={ }
                    />
                    <TouchableOpacity
                        style={styles.photoCircle}
                    >
                        <UpArrowIcon />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default CommentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    contentContainer: {
        height: '100%',
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    placeholder: {
        height: 60,
        width: 60,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
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
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F6F6F6",
        borderColor: "#E8E8E8",
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    photoCircle: {
        position: "absolute",
        right: 8,
        top: 8,
        width: 34,
        height: 34,
        backgroundColor: "#FF6C00",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        width: SCREEN_WIDTH - 32,
        position: 'absolute',
        bottom: 0,
        left: 16,
    }

});