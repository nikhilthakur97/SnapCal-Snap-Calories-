import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { analyzeFood } from '../services/geminiService';
import { Ionicons } from '@expo/vector-icons';

export default function NutritionInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri, base64, nutritionData: passedData, source } = route.params;
  
  const [nutritionData, setNutritionData] = useState(passedData || null);
  const [loading, setLoading] = useState(!passedData);

  useEffect(() => {
    if (!passedData && base64) {
      analyzeFoodImage();
    }
  }, []);

  const analyzeFoodImage = async () => {
    try {
      setLoading(true);
      const data = await analyzeFood(base64);
      setNutritionData(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>Analyzing food...</Text>
      </View>
    );
  }

  if (!nutritionData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to analyze food</Text>
        <TouchableOpacity style={styles.retryButton} onPress={analyzeFoodImage}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Food Image with Calories Overlay */}
        <View style={styles.imageContainer}>
          {(imageUri || nutritionData.image_url) ? (
            <Image 
              source={{ uri: imageUri || nutritionData.image_url }} 
              style={styles.foodImage} 
            />
          ) : (
            <View style={[styles.foodImage, styles.placeholderImage]}>
              <Ionicons name="nutrition" size={60} color="#ccc" />
              <Text style={styles.placeholderText}>Product from barcode</Text>
            </View>
          )}
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesText}>{nutritionData.calories} cal</Text>
          </View>
        </View>

        {/* Food Name and Description */}
        <View style={styles.infoSection}>
          <Text style={styles.foodName}>{nutritionData.food_name}</Text>
          <Text style={styles.foodDescription}>{nutritionData.description}</Text>
          
          {/* Serving Info */}
          <View style={styles.servingRow}>
            <View style={styles.servingItem}>
              <Ionicons name="restaurant" size={16} color="#666" />
              <Text style={styles.servingText}>{nutritionData.serving_info?.type || 'Meal'}</Text>
            </View>
            <View style={styles.servingItem}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.servingText}>{nutritionData.serving_info?.servings || '1 serving'}</Text>
            </View>
            <View style={styles.servingItem}>
              <Ionicons name="scale" size={16} color="#666" />
              <Text style={styles.servingText}>{nutritionData.serving_info?.weight || '150g'}</Text>
            </View>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <Text style={styles.sectionDescription}>{nutritionData.description}</Text>
          
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionData.protein}</Text>
              <Text style={styles.macroLabel}>protein</Text>
              <Text style={styles.macroPercent}>35% DV</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionData.carbohydrates}</Text>
              <Text style={styles.macroLabel}>carbs</Text>
              <Text style={styles.macroPercent}>35% DV</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionData.fat}</Text>
              <Text style={styles.macroLabel}>fats</Text>
              <Text style={styles.macroPercent}>35% DV</Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        {nutritionData.ingredients && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {nutritionData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Micronutrients */}
        {nutritionData.micronutrients && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Micronutrients</Text>
            {Object.entries(nutritionData.micronutrients).map(([key, value]) => (
              <View key={key} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>
                  {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
                <Text style={styles.ingredientAmount}>{value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleScanAgain}>
          <Text style={styles.addButtonText}>
            {source === 'barcode' ? 'Scan Another Barcode' : 'Take Another Photo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  placeholderImage: {
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  caloriesBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  caloriesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  servingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  servingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  macroPercent: {
    fontSize: 12,
    color: '#999',
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
  },
  ingredientAmount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});