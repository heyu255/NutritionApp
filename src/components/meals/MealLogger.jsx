import { useState } from 'react';
import FoodSearch from './FoodSearch';

const MealLogger = ({ onMealLogged }) => {
  const [showForm, setShowForm] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const mealData = {
      name: mealName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0, 
      fat: parseInt(fat) || 0,
      timestamp: new Date().toISOString()
    };
    
    onMealLogged(mealData);
    resetForm();
  };

  const handleFoodSelect = (mealData) => {
    onMealLogged(mealData);
    resetForm();
  };

  const resetForm = () => {
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowForm(false);
    setShowManualEntry(false);
  };

  const toggleManualEntry = () => {
    setShowManualEntry(!showManualEntry);
  };

  return (
    <div className="mt-6">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors w-full font-medium text-sm shadow-md flex items-center justify-center"
        >
          <span>Log a Meal</span>
        </button>
      ) : (
        <div className="bg-white p-5 rounded-xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4 border-b pb-3 border-indigo-100">
            <h3 className="font-semibold text-sm text-indigo-900">
              {!showManualEntry ? "What did you eat?" : "Enter Meal Details"}
            </h3>
            <button 
              onClick={resetForm}
              className="text-indigo-400 hover:text-indigo-600 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          {!showManualEntry ? (
            <>
              <FoodSearch onFoodSelect={handleFoodSelect} />
              
              <div className="mt-4 text-center border-t pt-3 border-indigo-50">
                <button
                  type="button"
                  onClick={toggleManualEntry}
                  className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
                >
                  Or enter nutrition details manually
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-indigo-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
                    placeholder="e.g. Oatmeal with Berries"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-indigo-700 mb-1">Calories</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
                      placeholder="kcal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-700 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
                      placeholder="grams"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-700 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
                      placeholder="grams"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-700 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
                      placeholder="grams"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1 font-medium text-sm"
                  >
                    Log Meal
                  </button>
                  <button
                    type="button"
                    onClick={toggleManualEntry}
                    className="px-4 py-2.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm"
                  >
                    Back
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MealLogger; 