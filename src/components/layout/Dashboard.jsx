import { useState, useEffect } from 'react';
import PetAvatar from '../pet/PetAvatar';
import HungerMeter from '../pet/HungerMeter';
import MealLogger from '../meals/MealLogger';
import MealHistory from '../meals/MealHistory';
import UserProfile from '../user/UserProfile';
import NutritionGoals from '../nutrition/NutritionGoals';
import { loadMeals, saveMeals, saveHungerLevel } from '../../utils/storage';
import { nutritionToHungerLevel } from '../../utils/nutrition';
import { saveNutritionGoals, loadNutritionGoals } from '../../utils/userProfile';

const Dashboard = () => {
  const [hungerLevel, setHungerLevel] = useState(100);
  const [mood, setMood] = useState('happy');
  const [meals, setMeals] = useState(() => loadMeals());
  const [activeTab, setActiveTab] = useState('status'); // 'status' or 'history'
  const [nutritionGoals, setNutritionGoals] = useState(null);
  const [nutritionProgress, setNutritionProgress] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load nutrition goals on component mount
  useEffect(() => {
    const savedGoals = loadNutritionGoals();
    if (savedGoals) {
      setNutritionGoals(savedGoals);
    }
  }, []);

  // Update mood based on hunger level
  useEffect(() => {
    if (hungerLevel > 70) {
      setMood('happy');
    } else if (hungerLevel > 30) {
      setMood('sleepy');
    } else {
      setMood('hungry');
    }
    
    // Save hunger level to local storage
    saveHungerLevel(hungerLevel);
  }, [hungerLevel]);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    saveMeals(meals);
    
    // Update hunger level based on nutrition progress
    if (nutritionGoals && meals.length > 0) {
      import('../../utils/nutrition').then(module => {
        const { calculateNutritionProgress, nutritionToHungerLevel } = module;
        const progress = calculateNutritionProgress(meals, nutritionGoals);
        setNutritionProgress(progress);
        
        // Calculate hunger level based on nutrition progress
        const newHungerLevel = nutritionToHungerLevel(progress);
        setHungerLevel(newHungerLevel);
      });
    }
  }, [meals, nutritionGoals]);

  // Handle meal logging
  const handleMealLogged = (mealData) => {
    // Add the meal to history
    setMeals(prevMeals => [mealData, ...prevMeals]);
    
    // Set mood to happy after eating
    setMood('happy');
  };

  // Handle profile updates
  const handleProfileUpdate = (profile, goals) => {
    setUserProfile(profile);
    setNutritionGoals(goals);
    saveNutritionGoals(goals);
  };

  return (
    <main className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
      {/* Tabs */}
      <div className="flex">
        <button 
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            activeTab === 'status' 
              ? 'text-indigo-700 border-b-2 border-indigo-500 bg-indigo-50/50' 
              : 'text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30'
          }`}
          onClick={() => setActiveTab('status')}
        >
          Pet Status
        </button>
        <button 
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            activeTab === 'history' 
              ? 'text-indigo-700 border-b-2 border-indigo-500 bg-indigo-50/50' 
              : 'text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Meal History
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'status' ? (
          <div className="space-y-5">
            <UserProfile onProfileUpdate={handleProfileUpdate} />
            
            <PetAvatar 
              hungerLevel={hungerLevel} 
              mood={mood} 
              nutritionProgress={nutritionProgress}
            />
            <HungerMeter 
              hungerLevel={hungerLevel} 
              nutritionGoals={nutritionGoals} 
              nutritionProgress={nutritionProgress} 
            />
            
            {nutritionGoals && (
              <NutritionGoals meals={meals} nutritionGoals={nutritionGoals} />
            )}
            
            <MealLogger onMealLogged={handleMealLogged} />
          </div>
        ) : (
          <MealHistory meals={meals} nutritionGoals={nutritionGoals} />
        )}
      </div>
    </main>
  );
};

export default Dashboard; 