import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import axiosClient from '@/api/axiosClient';

interface Education {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
    image_url: string;
    created_at: string;
}

export default function EdukasiScreen() {
    const router = useRouter();
    const [articles, setArticles] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const categories = ['Semua', 'Tips Kesehatan', 'Nutrisi', 'Info Penyakit', 'Edukasi Obat', 'Tips'];

    const fetchArticles = async () => {
        try {
            const response = await axiosClient.get('/api/education');
            if (response.data && response.data.data) {
                setArticles(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching education articles:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchArticles();
    };

    const filteredArticles = selectedCategory === 'Semua' 
        ? articles 
        : articles.filter(article => article.category === selectedCategory);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Edukasi Kesehatan',
                headerStyle: { backgroundColor: '#2E8B57' },
                headerTintColor: '#FFF',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                )
            }} />

            {/* Category Filter */}
            <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat} 
                            style={[
                                styles.categoryBtn, 
                                selectedCategory === cat && styles.categoryBtnActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText, 
                                selectedCategory === cat && styles.categoryTextActive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : filteredArticles.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="book-open-blank-variant" size={80} color="#CCC" />
                        <Text style={styles.emptyText}>Belum ada artikel edukasi</Text>
                    </View>
                ) : (
                    filteredArticles.map((article) => (
                        <TouchableOpacity key={article.id} style={styles.articleCard}>
                            <Image source={{ uri: article.image_url }} style={styles.articleImage} />
                            <View style={styles.articleInfo}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryBadgeText}>{article.category}</Text>
                                </View>
                                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                <Text style={styles.articleSnippet} numberOfLines={3}>{article.content}</Text>
                                <View style={styles.articleFooter}>
                                    <View style={styles.authorBox}>
                                        <Ionicons name="person-circle-outline" size={16} color="#888" />
                                        <Text style={styles.authorText}>{article.author}</Text>
                                    </View>
                                    <Text style={styles.dateText}>{formatDate(article.created_at)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    categoryContainer: { backgroundColor: '#FFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    categoryScroll: { paddingHorizontal: 15 },
    categoryBtn: { 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 20, 
        backgroundColor: '#F0F2F5', 
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    categoryBtnActive: { backgroundColor: '#2E8B57', borderColor: '#2E8B57' },
    categoryText: { fontSize: 13, color: '#666', fontWeight: '500' },
    categoryTextActive: { color: '#FFF' },
    scrollContent: { padding: 16 },
    articleCard: { 
        backgroundColor: '#FFF', 
        borderRadius: 16, 
        marginBottom: 20, 
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    articleImage: { width: '100%', height: 180, backgroundColor: '#EEE' },
    articleInfo: { padding: 16 },
    categoryBadge: { 
        backgroundColor: '#E8F5E9', 
        alignSelf: 'flex-start', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 6,
        marginBottom: 10
    },
    categoryBadgeText: { color: '#2E8B57', fontSize: 11, fontWeight: 'bold' },
    articleTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, lineHeight: 24 },
    articleSnippet: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 15 },
    articleFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    authorBox: { flexDirection: 'row', alignItems: 'center' },
    authorText: { fontSize: 12, color: '#888', marginLeft: 4 },
    dateText: { fontSize: 12, color: '#AAA' },
    emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 20, fontSize: 16, color: '#999' }
});