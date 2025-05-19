// User Profile utility for storing user data

// Local storage keys
const STORAGE_KEYS = {
  USER_WEIGHT: 'nutriPet_userWeight',
  USER_GOAL: 'nutriPet_userGoal',
  USER_ACTIVITY: 'nutriPet_userActivity',
  NUTRITION_GOALS: 'nutriPet_nutritionGoals',
};

/**
 * Save user profile data
 * @param {Object} userData - User profile data
 * @returns {boolean} Success status
 */
export const saveUserProfile = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_WEIGHT, userData.weightKg.toString());
    localStorage.setItem(STORAGE_KEYS.USER_GOAL, userData.goal);
    localStorage.setItem(STORAGE_KEYS.USER_ACTIVITY, userData.activityLevel.toString());
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

/**
 * Load user profile data
 * @returns {Object} User profile data or default values
 */
export const loadUserProfile = () => {
  try {
    const weightKg = parseFloat(localStorage.getItem(STORAGE_KEYS.USER_WEIGHT)) || 85;
    const goal = localStorage.getItem(STORAGE_KEYS.USER_GOAL) || 'muscle_gain';
    const activityLevel = parseFloat(localStorage.getItem(STORAGE_KEYS.USER_ACTIVITY)) || 1.6;
    
    return {
      weightKg,
      goal,
      activityLevel
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    // Return default values for 85kg user focusing on muscle gain
    return {
      weightKg: 85,
      goal: 'muscle_gain',
      activityLevel: 1.6
    };
  }
};

/**
 * Save nutrition goals
 * @param {Object} goals - Nutrition goals object
 * @returns {boolean} Success status
 */
export const saveNutritionGoals = (goals) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_GOALS, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error saving nutrition goals:', error);
    return false;
  }
};

/**
 * Load nutrition goals
 * @returns {Object|null} Nutrition goals or null if not set
 */
export const loadNutritionGoals = () => {
  try {
    const goalsData = localStorage.getItem(STORAGE_KEYS.NUTRITION_GOALS);
    return goalsData ? JSON.parse(goalsData) : null;
  } catch (error) {
    console.error('Error loading nutrition goals:', error);
    return null;
  }
}; 