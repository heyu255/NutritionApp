// Nutrition Calculator Utility

// Constants for nutrition calculations
const PROTEIN_PER_KG_MUSCLE_GAIN = 2.0; // 2g of protein per kg of body weight
const CALORIES_PER_KG_MUSCLE_GAIN = 35; // 35 calories per kg for muscle gain
const CARBS_PERCENTAGE = 0.45; // 45% of calories from carbs
const FAT_PERCENTAGE = 0.25; // 25% of calories from fat
const CALORIES_PER_G_PROTEIN = 4;
const CALORIES_PER_G_CARBS = 4;
const CALORIES_PER_G_FAT = 9;

/**
 * Calculate daily nutrition requirements for muscle gain
 * @param {number} weightKg - Weight in kilograms
 * @param {string} goal - Fitness goal ('muscle_gain', 'maintenance', 'fat_loss')
 * @param {number} activityLevel - Activity multiplier (1.2-1.9)
 * @returns {Object} Daily nutrition requirements
 */
export const calculateDailyNutrition = (weightKg, goal = 'muscle_gain', activityLevel = 1.6) => {
  // Calculate base requirements
  let proteinG, caloriesDaily, carbsG, fatG;
  
  switch(goal) {
    case 'muscle_gain':
      proteinG = weightKg * PROTEIN_PER_KG_MUSCLE_GAIN;
      caloriesDaily = weightKg * CALORIES_PER_KG_MUSCLE_GAIN * activityLevel;
      break;
    case 'fat_loss':
      proteinG = weightKg * 2.2;
      caloriesDaily = weightKg * 30 * activityLevel * 0.8; // 20% deficit
      break;
    case 'maintenance':
    default:
      proteinG = weightKg * 1.8;
      caloriesDaily = weightKg * 32 * activityLevel;
  }
  
  // Calculate remaining macros
  const proteinCalories = proteinG * CALORIES_PER_G_PROTEIN;
  const carbsCalories = caloriesDaily * CARBS_PERCENTAGE;
  const fatCalories = caloriesDaily * FAT_PERCENTAGE;
  
  carbsG = Math.round(carbsCalories / CALORIES_PER_G_CARBS);
  fatG = Math.round(fatCalories / CALORIES_PER_G_FAT);
  
  return {
    calories: Math.round(caloriesDaily),
    protein: Math.round(proteinG),
    carbs: carbsG,
    fat: fatG
  };
};

/**
 * Calculate nutrition progress for the day
 * @param {Array} meals - Array of meal objects with nutrition data
 * @param {Object} dailyGoals - Daily nutrition goals
 * @returns {Object} Progress percentages and remaining amounts
 */
export const calculateNutritionProgress = (meals, dailyGoals) => {
  // Sum nutrition from all meals today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayMeals = meals.filter(meal => {
    const mealDate = new Date(meal.timestamp);
    return mealDate >= today;
  });
  
  const consumed = {
    calories: todayMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: todayMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: todayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: todayMeals.reduce((sum, meal) => sum + meal.fat, 0)
  };
  
  // Calculate percentages
  const progress = {
    calories: Math.min(100, Math.round((consumed.calories / dailyGoals.calories) * 100)),
    protein: Math.min(100, Math.round((consumed.protein / dailyGoals.protein) * 100)),
    carbs: Math.min(100, Math.round((consumed.carbs / dailyGoals.carbs) * 100)),
    fat: Math.min(100, Math.round((consumed.fat / dailyGoals.fat) * 100)),
    remaining: {
      calories: Math.max(0, dailyGoals.calories - consumed.calories),
      protein: Math.max(0, dailyGoals.protein - consumed.protein),
      carbs: Math.max(0, dailyGoals.carbs - consumed.carbs),
      fat: Math.max(0, dailyGoals.fat - consumed.fat)
    }
  };
  
  return progress;
};

// Helper function to convert nutrition progress to hunger level
export const nutritionToHungerLevel = (progress) => {
  // Weight the macros differently for hunger calculation
  // Protein has more impact on satiety than carbs or fat
  const weightedProgress = 
    (progress.protein * 0.4) + 
    (progress.calories * 0.3) + 
    (progress.carbs * 0.15) + 
    (progress.fat * 0.15);
  
  return Math.min(100, weightedProgress);
}; 