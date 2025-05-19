// Local storage keys
const STORAGE_KEYS = {
  MEALS: 'nutriPet_meals',
  HUNGER: 'nutriPet_hunger',
  LAST_UPDATED: 'nutriPet_lastUpdated'
};

// Save meals to local storage
export const saveMeals = (meals) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    return true;
  } catch (error) {
    console.error('Error saving meals to local storage:', error);
    return false;
  }
};

// Load meals from local storage
export const loadMeals = () => {
  try {
    const mealsData = localStorage.getItem(STORAGE_KEYS.MEALS);
    return mealsData ? JSON.parse(mealsData) : [];
  } catch (error) {
    console.error('Error loading meals from local storage:', error);
    return [];
  }
};

// Save hunger level to local storage
export const saveHungerLevel = (hungerLevel) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HUNGER, hungerLevel.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving hunger level to local storage:', error);
    return false;
  }
};

// Load hunger level from local storage
export const loadHungerLevel = () => {
  try {
    const hungerLevel = localStorage.getItem(STORAGE_KEYS.HUNGER);
    const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
    
    if (hungerLevel && lastUpdated) {
      // Calculate how much hunger should have decreased since last update
      const lastUpdateTime = new Date(lastUpdated).getTime();
      const currentTime = new Date().getTime();
      const minutesPassed = (currentTime - lastUpdateTime) / (1000 * 60);
      
      // Decrease by 5% every 30 minutes
      const decreaseAmount = Math.floor(minutesPassed / 30) * 5;
      const adjustedHunger = Math.max(0, parseFloat(hungerLevel) - decreaseAmount);
      
      return adjustedHunger;
    }
    
    return 100; // Default hunger level
  } catch (error) {
    console.error('Error loading hunger level from local storage:', error);
    return 100;
  }
}; 