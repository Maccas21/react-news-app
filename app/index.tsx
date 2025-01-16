import React, { useState } from "react";
import {
	View,
	TextInput,
	FlatList,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	Linking,
} from "react-native";

export default function Index() {
	const [searchQuery, setSearchQuery] = useState("");
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);

	const apiKey = "e73af2c3739d4ebf86bc46a6fe7c4363"; // Replace with your actual API key

	// Fetch data from NewsAPI
	const fetchNews = async (query) => {
		if (!query) return; // Prevent fetching for an empty query
		setLoading(true); // Show loading indicator
		try {
			const response = await fetch(
				`https://newsapi.org/v2/everything?q=${encodeURIComponent(
					query
				)}&apiKey=${apiKey}`
			);
			const data = await response.json();

			if (data.status === "ok") {
				// Filter articles where source.id is not null
				const filteredArticles = data.articles.filter(
					(article) => article.source.id !== null
				);
				setArticles(filteredArticles);
			} else {
				console.error("Failed to fetch news:", data);
			}
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setLoading(false); // Hide loading indicator
		}
	};

	const handlePress = (url) => {
		// Opens the article URL in the default browser
		Linking.openURL(url);
	};

	return (
		<View style={styles.container}>
			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Search for news..."
				value={searchQuery}
				onChangeText={(text) => setSearchQuery(text)}
				onSubmitEditing={() => {
					setArticles([]); // Clear previous results before new search
					fetchNews(searchQuery); // Fetch first batch of results
				}}
			/>

			{/* Loading Indicator */}
			{loading && <ActivityIndicator size="large" color="#0000ff" />}

			{/* Display News Articles */}
			<FlatList
				data={articles}
				keyExtractor={(item, index) => index.toString()} // Unique key for each article
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.article}
						onPress={() => handlePress(item.url)} // Open the article URL on press
					>
						<View style={styles.articleContent}>
							{/* Image */}
							<Image
								source={{ uri: item.urlToImage }}
								style={styles.image}
								resizeMode="cover"
							/>
							{/* Text */}
							<View style={styles.textContent}>
								<Text style={styles.title}>{item.title}</Text>
								<Text style={styles.description}>{item.description}</Text>
							</View>
						</View>
					</TouchableOpacity>
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
		marginBottom: 20,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	articleContent: {
		flexDirection: "row", // Align image and text side by side
		padding: 10,
	},
	image: {
		width: 60, // Small square image
		height: 60,
		borderRadius: 8,
		marginRight: 10, // Space between image and text
	},
	textContent: {
		flex: 1, // Take remaining space next to image
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	description: {
		fontSize: 14,
		color: "#555",
	},
});
