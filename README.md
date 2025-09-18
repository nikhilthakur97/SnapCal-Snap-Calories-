# SnapCal - Snap Calories

A React Native (Expo) app that uses AI to analyze food photos and barcode scanning to provide nutritional information.

## Features

- 📸 **Camera Capture**: Take photos of food using the device camera
- 📊 **Barcode Scanning**: Scan product barcodes for instant nutrition data
- 🤖 **AI Analysis**: Uses Google Gemini API to analyze food photos and extract nutritional data
- 🗄️ **Food Database**: Integrates with OpenFoodFacts for barcode product information
- 📋 **Nutrition Display**: Shows calories, macronutrients, ingredients, and micronutrients
- 🎨 **Beautiful UI**: Clean, modern interface with tab navigation

## Setup

1. **Navigate to the app directory:**
   ```bash
   cd PhotoCalTracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Gemini API:**
   - Get your API key from [Google AI Studio](https://aistudio.google.com/)
   - Open `PhotoCalTracker/services/geminiService.js`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
     ```javascript
     const GEMINI_API_KEY = 'your-actual-api-key-here';
     ```

4. **Run the app:**
   ```bash
   npm start
   # or for specific platforms:
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Tech Stack

- **React Native** with Expo
- **Expo Camera** for photo capture  
- **Expo Barcode Scanner** for barcode scanning
- **React Navigation** for screen and tab navigation
- **Google Gemini API** for AI food analysis
- **OpenFoodFacts API** for barcode product lookup

## Usage

### Photo Analysis
1. Launch the app - you'll see the camera tab
2. Point camera at food and tap the capture button
3. The app will analyze the food using AI and show detailed nutrition information

### Barcode Scanning
1. Switch to the "Barcode" tab
2. Point camera at a product barcode
3. The app will look up the product in OpenFoodFacts database
4. View detailed nutrition information instantly

Both methods show the same detailed nutrition display with calories, macronutrients, ingredients, and micronutrients.

## API Configuration

The app calls the Gemini API directly from the frontend with this structure:

```javascript
{
  "food_name": "Pizza slice",
  "calories": 285,
  "protein": "12g",
  "carbohydrates": "36g",
  "fat": "10g",
  "serving_info": {...},
  "ingredients": [...],
  "micronutrients": {...}
}
```

## Important Notes

- **API Key Security**: Make sure to replace the placeholder API key in `PhotoCalTracker/services/geminiService.js` with your actual Gemini API key before running the app
- **Permissions**: The app requires camera permissions to function properly
- **Platform Support**: Works on iOS, Android, and web browsers through Expo