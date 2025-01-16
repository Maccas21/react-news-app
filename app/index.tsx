import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

export default function Index() {
	const [searchQuery, setSearchQuery] = useState("");

	const apiKey = "e73af2c3739d4ebf86bc46a6fe7c4363";

	return (
		<View style={styles.container}>
			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Search here..."
				value={searchQuery}
				onChangeText={(text) => setSearchQuery(text)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	searchBar: {
		height: 50,
		width: "80%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
	},
});
