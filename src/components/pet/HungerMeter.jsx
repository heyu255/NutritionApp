const HungerMeter = ({ hungerLevel, nutritionGoals, nutritionProgress }) => {
  // Determine color based on hunger level
  const getColorClass = () => {
    if (hungerLevel > 70) return 'bg-emerald-500';
    if (hungerLevel > 30) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Get hunger level description
  const getHungerDescription = () => {
    if (hungerLevel > 80) return 'Very Satisfied';
    if (hungerLevel > 60) return 'Satisfied';
    if (hungerLevel > 40) return 'A Bit Hungry';
    if (hungerLevel > 20) return 'Hungry';
    return 'Starving';
  };
  
  // Get nutrition insight message
  const getNutritionInsight = () => {
    if (!nutritionProgress) return null;
    
    let message = '';
    
    // Determine which macronutrient is most lacking
    const lowestMacro = ['protein', 'carbs', 'fat']
      .sort((a, b) => (nutritionProgress[a] || 0) - (nutritionProgress[b] || 0))[0];
      
    const proteinPercentage = nutritionProgress.protein || 0;
    const caloriesPercentage = nutritionProgress.calories || 0;
    
    if (caloriesPercentage < 25) {
      message = 'Your pet is hungry! Time to eat something.';
    } else if (proteinPercentage < 30 && lowestMacro === 'protein') {
      message = 'Your pet needs more protein to build muscle!';
    } else if (lowestMacro === 'carbs' && nutritionProgress.carbs < 30) {
      message = 'Your pet needs more energy from carbs!';
    } else if (lowestMacro === 'fat' && nutritionProgress.fat < 30) {
      message = 'Your pet needs healthy fats for hormone balance!';
    } else if (caloriesPercentage > 90) {
      message = 'Your pet is fully satisfied for now!';
    } else {
      message = 'Your pet is doing well with nutrition!';
    }
    
    return message;
  };

  return (
    <div className="my-6">
      <div className="flex justify-between mb-2">
        <p className="text-sm font-semibold text-indigo-900">Satiety Level</p>
        <span className="text-sm font-medium text-indigo-600">
          {getHungerDescription()} ({Math.round(hungerLevel)}%)
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`${getColorClass()} h-3 rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${hungerLevel}%` }}
        ></div>
      </div>
      
      {nutritionProgress && nutritionGoals && (
        <p className="text-xs text-indigo-500 mt-2 text-center italic">
          {getNutritionInsight()}
        </p>
      )}
    </div>
  );
};

export default HungerMeter; 