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
import { doc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../newConfig';
import UpArrowIcon from "../icons/UpArrowIcon";
import { selectCommentsByPostId } from '../redux/reducers/commentsSlice';

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const CommentsScreen = ({ route }) => {
    const dispatch = useDispatch();
    const { postId, postImage } = route.params;  
    const comments = useSelector(selectCommentsByPostId(postId));
    const [commentText, setCommentText] = useState("");

    const fetchComments = async () => {
        const commentsRef = collection(doc(db, 'posts', postId), 'comments'); 
        const commentsSnapshot = await getDocs(commentsRef); 
        const fetchedComments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dispatch(setComments({ postId, comments: fetchedComments }));
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim() === "") return;
    
        const newComment = {
            text: commentText,
            createdAt: new Date().toISOString(),  
        };
    
        const commentsRef = collection(doc(db, 'posts', postId), 'comments');
    
        await addDoc(commentsRef, newComment);
    
        dispatch(addComment({ postId, comment: newComment }));

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
                        source={{ uri: postImage }}
                        style={styles.postImage}
                    />
                </View>
                <ScrollView>
                    {comments.map(comment => (
                        <View key={`${postId}-${comment.id}`} style={styles.commentContainer}>
                            <Text>{comment.text}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Коментувати..."
                        placeholderTextColor="#BDBDBD"
                        onChangeText={setCommentText}
                        value={commentText}
                    // value={ }
                    />
                    <TouchableOpacity
                        style={styles.photoCircle}
                        onPress={handleCommentSubmit}
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
    },
    commentContainer: {
        width: SCREEN_WIDTH - 32,
    }

});