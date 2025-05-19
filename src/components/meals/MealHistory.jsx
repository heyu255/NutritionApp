const MealHistory = ({ meals, nutritionGoals }) => {
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Calculate total nutrition for today
  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate >= today;
    });
    
    return {
      mealCount: todayMeals.length,
      calories: todayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: todayMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: todayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: todayMeals.reduce((sum, meal) => sum + meal.fat, 0)
    };
  };
  
  const todayStats = getTodayStats();

  // Calculate percentages of goals if goals are available
  const getPercentageOfGoal = (value, goalType) => {
    if (!nutritionGoals || !nutritionGoals[goalType]) return null;
    return Math.min(100, Math.round((value / nutritionGoals[goalType]) * 100));
  };

  return (
    <div className="mt-1">
      {/* Today's Summary */}
      <div className="mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-sm mb-3 text-indigo-900">Today's Summary</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="text-xs text-indigo-500 font-medium">Meals</div>
            <div className="text-lg font-semibold text-indigo-800 mt-1">{todayStats.mealCount}</div>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="text-xs text-indigo-500 font-medium">Calories</div>
            <div className="text-lg font-semibold text-indigo-800 mt-1">{todayStats.calories}</div>
            {nutritionGoals && (
              <div className="text-xs text-indigo-400 mt-1">
                <span className="font-medium">{getPercentageOfGoal(todayStats.calories, 'calories')}%</span> of goal
              </div>
            )}
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="text-xs text-indigo-500 font-medium">Protein</div>
            <div className="text-lg font-semibold text-indigo-800 mt-1">{todayStats.protein}g</div>
            {nutritionGoals && (
              <div className="text-xs text-indigo-400 mt-1">
                <span className="font-medium">{getPercentageOfGoal(todayStats.protein, 'protein')}%</span> of goal
              </div>
            )}
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="text-xs text-indigo-500 font-medium">Carbs</div>
            <div className="text-lg font-semibold text-indigo-800 mt-1">{todayStats.carbs}g</div>
            {nutritionGoals && (
              <div className="text-xs text-indigo-400 mt-1">
                <span className="font-medium">{getPercentageOfGoal(todayStats.carbs, 'carbs')}%</span> of goal
              </div>
            )}
          </div>
        </div>
        
        {nutritionGoals && (
          <div className="mt-3 pt-3 border-t border-indigo-100/50 text-center">
            <p className="text-xs text-indigo-500">
              Daily Goal: <span className="font-medium">{nutritionGoals.calories}</span> cal, 
              <span className="font-medium ml-1">{nutritionGoals.protein}g</span> protein, 
              <span className="font-medium ml-1">{nutritionGoals.carbs}g</span> carbs
            </p>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-sm mb-3 text-indigo-900">Meal History</h3>
      
      {meals.length === 0 ? (
        <div className="bg-indigo-50 text-center py-5 rounded-xl">
          <p className="text-indigo-500 text-sm">No meals logged yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-indigo-100 bg-indigo-50/50 rounded-lg overflow-hidden">
          {meals.map((meal, index) => (
            <li key={index} className="p-3 hover:bg-indigo-100/50 transition-colors">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-sm text-indigo-900">{meal.name}</span>
                <span className="text-xs text-indigo-500">{formatDate(meal.timestamp)}</span>
              </div>
              
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm">
                  {meal.calories} cal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                </span>
                {meal.servingSize && (
                  <span className="text-indigo-400 text-xs self-center">{meal.servingSize}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealHistory; 