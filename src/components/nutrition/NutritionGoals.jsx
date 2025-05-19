import { calculateNutritionProgress } from '../../utils/nutrition';
import { useState, useEffect } from 'react';

const NutritionGoals = ({ meals, nutritionGoals }) => {
  const [progress, setProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    remaining: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });

  // Calculate progress when meals or goals change
  useEffect(() => {
    if (nutritionGoals) {
      const updatedProgress = calculateNutritionProgress(meals, nutritionGoals);
      setProgress(updatedProgress);
    }
  }, [meals, nutritionGoals]);

  if (!nutritionGoals) {
    return <div className="text-center text-indigo-500 text-sm py-5">Loading nutrition goals...</div>;
  }

  // Get progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 70) return "bg-emerald-400";
    if (percentage >= 50) return "bg-amber-400";
    if (percentage >= 25) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Get appropriate emoji for each nutrient type
  const getNutrientEmoji = (type) => {
    switch(type) {
      case 'calories': return '🔥'; // Fire for energy/calories
      case 'protein': return '💪'; // Muscle for protein
      case 'carbs': return '🍚'; // Rice for carbs
      case 'fat': return '🥑'; // Avocado for healthy fats
      default: return '';
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-sm mb-3 text-indigo-900 flex items-center">
        <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 via-amber-500 to-rose-500 rounded-full mr-2"></div>
        Daily Nutrition Goals
      </h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {['calories', 'protein', 'carbs', 'fat'].map(nutrient => (
          <div key={nutrient} className="bg-white rounded-lg p-2 shadow-sm text-center relative overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 h-1.5 transition-all duration-500" 
              style={{ 
                width: `${progress[nutrient]}%`, 
                backgroundColor: `${getProgressColor(progress[nutrient])}`
              }}
            ></div>
            <div className="text-xl mb-1">{getNutrientEmoji(nutrient)}</div>
            <div className="text-xs font-medium text-indigo-800 capitalize">{nutrient}</div>
            <div className="text-sm font-bold text-indigo-900">
              {progress[nutrient]}% 
              <span className="text-xs font-medium text-indigo-600">
                ({nutritionGoals[nutrient] - progress.remaining[nutrient]}/{nutritionGoals[nutrient]}
                {nutrient === 'calories' ? '' : 'g'})
              </span>
            </div>
          </div>
        ))}
      </div>
      
      
      {/* Daily Goal Breakdown */}
      <div className="text-center mt-3 bg-indigo-100 p-2 rounded-lg">
        <p className="text-xs text-indigo-700 font-medium">
          Based on your profile: {nutritionGoals.calories} calories • {nutritionGoals.protein}g protein • {nutritionGoals.carbs}g carbs • {nutritionGoals.fat}g fat
        </p>
      </div>
    </div>
  );
};

export default NutritionGoals; 