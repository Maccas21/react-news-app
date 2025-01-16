import React, { useState } from "react";
import {
	TextInput,
	View,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	Text,
} from "react-native";

export default function Index() {
	const [searchQuery, setSearchQuery] = useState("");
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);

	const apiKey = "e73af2c3739d4ebf86bc46a6fe7c4363";

	const fetchNews = async (query) => {
		if (!query) return;
		setLoading(true);

		try {
			const response = await fetch(
				`https://newsapi.org/v2/everything?q=${encodeURIComponent(
					query
				)}&apiKey=${apiKey}`
			);
			const data = await response.json();

			if (data.status === "ok") {
				setArticles(data.articles); // Store articles in state
			} else {
				console.error("Failed to fetch news:", data);
			}
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setLoading(false); // Hide loading indicator
		}
	};

	return (
		<View style={styles.container}>
			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Search for news..."
				value={searchQuery}
				onChangeText={(text) => setSearchQuery(text)}
				onSubmitEditing={() => fetchNews(searchQuery)} // Fetch news when search is submitted
			/>

			{/* Loading Indicator */}
			{loading && <ActivityIndicator size="large" color="#0000ff" />}

			{/* Display News Articles */}
			<FlatList
				data={articles}
				keyExtractor={(item, index) => index.toString()} // Unique key for each article
				renderItem={({ item }) => (
					<View style={styles.article}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.description}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#f5f5f5",
	},
	searchBar: {
		height: 50,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		paddingHorizontal: 10,
		marginBottom: 20,
		backgroundColor: "#fff",
	},
	article: {
		padding: 10,
		marginBottom: 10,
		borderRadius: 8,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
		marginTop: 5,
		color: "#555",
	},
});
