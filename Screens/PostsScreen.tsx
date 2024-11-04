import { FC, useEffect, useState } from "react";
import {
    TouchableOpacity,
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    ScrollView,
} from "react-native";
import { colors } from "../styles/global";
import CommentIcon from "../icons/CommentIcon";
import LocationIcon from "../icons/LocationIcon";
import CommentOrangeIcon from "../icons/CommentOrangeIcon";
import { db } from '../newConfig'; 
import { collection, getDocs } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const PostsScreen: FC = () => {
    const navigation = useNavigation();
    const [posts, setPosts] = useState<any[]>([]);  
    
    const fetchPosts = async () => {
        try {
            const postsCollection = collection(db, "posts");  
            const snapshot = await getDocs(postsCollection);  
            const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
            setPosts(fetchedPosts); 
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
    };

    useEffect(() => {
        fetchPosts();  
    }, []);

    const goToComments = (postId: string, postImage: string) => {
        navigation.navigate('Comments', { postId, postImage });  
    };

    const goToMap = (location: string) => {
        console.log(location, 'location');
        navigation.navigate('Map', { location });
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.profileContainer}>
                    <Image
                        source={require("../assets/images/User.jpg")}
                        style={styles.placeholder}
                    />
                    <View style={styles.profileDetails}>
                        <Text style={styles.name}>Natali Romanova</Text>
                        <Text style={styles.email}>emailtest@gmail.com</Text>
                    </View>
                </View>

                {posts.map((post) => (
                    <View key={post.id} style={styles.PostContainer}>
                        <Image
                            source={{ uri: post.capturedImage }} 
                            style={styles.postImage}
                        />
                        <Text style={styles.postName}>{post.name}</Text>

                        <View style={styles.postDetails}>
                            <TouchableOpacity 
                                style={styles.commentsContainer} 
                                onPress={() => goToComments(post.id, post.capturedImage)}  
                            >
                                {post.comments ? <CommentOrangeIcon /> : <CommentIcon />}
                                <Text style={[styles.postComments, {
                                    color: post.comments ? '#212121' : '#BDBDBD'
                                }]}>{post.comments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.locationContainer} onPress={() => goToMap(post.location)}>
                                <LocationIcon />
                                <Text style={styles.postLocation}>{post.location}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default PostsScreen;

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
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 32,
    },
    placeholder: {
        height: 60,
        width: 60,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
    },
    profileDetails: {
        marginLeft: 16,
        justifyContent: "center",
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
    locationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 300
    },
    postComments: {
        color: '#BDBDBD',
        fontSize: 16,
        fontWeight: "400",
    },
    postLocation: {
        fontSize: 16,
        fontWeight: "400",
    },
    name: {
        fontSize: 13,
        fontWeight: "700",
    },
    email: {
        fontSize: 11,
        fontWeight: "400",
    },
});