const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/api/v0/product';

export async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(`${OPENFOODFACTS_API_URL}/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.product || data.status === 0) {
      throw new Error('Product not found in database');
    }

    const product = data.product;
    
    // Extract nutrition data per 100g
    const nutriments = product.nutriments || {};
    
    // Convert to our standard format
    const nutritionData = {
      food_name: product.product_name || product.product_name_en || 'Unknown Product',
      description: product.generic_name || product.categories || 'Packaged food product',
      calories: Math.round(nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184 || 0),
      protein: `${Math.round(nutriments.proteins_100g || 0)}g`,
      carbohydrates: `${Math.round(nutriments.carbohydrates_100g || 0)}g`,
      fat: `${Math.round(nutriments.fat_100g || 0)}g`,
      serving_info: {
        type: determineServing(product.categories),
        servings: product.serving_size || '100g',
        weight: '100g'
      },
      ingredients: extractIngredients(product.ingredients_text),
      micronutrients: {
        sodium: `${Math.round(nutriments.sodium_100g || 0)} mg`,
        fiber: `${Math.round(nutriments.fiber_100g || 0)} g`,
        sugars: `${Math.round(nutriments.sugars_100g || 0)} g`
      },
      barcode: barcode,
      brand: product.brands || 'Unknown',
      image_url: product.image_url
    };

    return nutritionData;

  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product information. Please try again.');
  }
}

function determineServing(categories) {
  if (!categories) return 'Snack';
  
  const categoryLower = categories.toLowerCase();
  
  if (categoryLower.includes('breakfast') || categoryLower.includes('cereal')) {
    return 'Breakfast';
  } else if (categoryLower.includes('beverage') || categoryLower.includes('drink')) {
    return 'Beverage';
  } else if (categoryLower.includes('dessert') || categoryLower.includes('sweet')) {
    return 'Dessert';
  } else {
    return 'Snack';
  }
}

function extractIngredients(ingredientsText) {
  if (!ingredientsText) return [];
  
  // Split by comma and clean up
  const ingredients = ingredientsText
    .split(',')
    .slice(0, 6) // Limit to first 6 ingredients
    .map(ingredient => {
      const clean = ingredient.trim().replace(/[()%0-9]/g, '');
      return {
        name: clean.charAt(0).toUpperCase() + clean.slice(1),
        amount: 'varies'
      };
    });
    
  return ingredients;
}