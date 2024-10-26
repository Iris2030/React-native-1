import { FC, useCallback, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
} from "react-native";
import { colors } from "../styles/global";
import PostsScreen from "./PostsScreen";

const HomeScreen = () => {
	return (
		<View style={styles.container}>
			<PostsScreen />
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
});