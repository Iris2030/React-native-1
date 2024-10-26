import { FC, useCallback, useEffect, useState } from "react";
import {
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
import CommentIcon from "@/icons/CommentIcon";
import LocationIcon from "@/icons/LocationIcon";
import CommentOrangeIcon from "@/icons/CommentOrangeIcon";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const posts = [
    {
        image: require("../assets/images/sunset.jpeg"),
        likes: 10,
        comments: 0,
        location: "Ivano-Frankivs'k Region, Ukraine"
    },
    {
        image: require("../assets/images/forest.jpeg"),
        likes: 5,
        comments: 5,
        location: "Ivano-Frankivs'k Region, Ukraine"
    },
];

const PostsScreen = () => {
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

                {posts.map((post, index) => (
                    <View key={index} style={styles.PostContainer}>
                        <Image
                            source={post.image}
                            style={styles.postImage}
                        />
                        <Text style={styles.postName}>Захід сонця</Text>

                        <View style={styles.postDetails}>
                            <View style={styles.commentsContainer}>
                                {post.comments ? <CommentOrangeIcon /> : <CommentIcon />}
                                <Text style={[styles.postComments, {
                                    color: post.comments ? '#212121' : '#BDBDBD'
                                }]}>{post.comments}</Text>
                            </View>
                            <View style={styles.commentsContainer}>
                                <LocationIcon />
                                <Text style={styles.postLocation}>{post.location}</Text>
                            </View>
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