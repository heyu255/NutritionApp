import { useState } from 'react';

const FoodSearch = ({ onFoodSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nutritionix API credentials
  const APP_ID = '21be7334';
  const APP_KEY = '98d86b16bfa4885812d829614edeade3';

  const searchFood = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': APP_ID,
          'x-app-key': APP_KEY,
        },
        body: JSON.stringify({
          query: query,
          line_delimited: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data');
      }
      
      const data = await response.json();
      setResults(data.foods || []);
    } catch (err) {
      setError('Error fetching nutrition data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSelect = (food) => {
    // Convert Nutritionix format to our app format
    const mealData = {
      name: food.food_name,
      calories: Math.round(food.nf_calories),
      protein: Math.round(food.nf_protein),
      carbs: Math.round(food.nf_total_carbohydrate),
      fat: Math.round(food.nf_total_fat),
      timestamp: new Date().toISOString(),
      servingSize: food.serving_qty + ' ' + food.serving_unit
    };
    
    // Add the food item but keep the search results
    onFoodSelect(mealData);
    
    // Don't clear the search results or query
    // This allows users to add multiple items from the same search
    
    // Provide feedback that the item was added
    // Create a temporary copy of the food to indicate it was added
    const updatedResults = results.map(item => {
      if (item === food) {
        return { ...item, justAdded: true };
      }
      return item;
    });
    
    setResults(updatedResults);
    
    // Reset the "justAdded" flag after 1 second
    setTimeout(() => {
      const resetResults = results.map(item => ({ ...item, justAdded: false }));
      setResults(resetResults);
    }, 1000);
  };

  // Simplified search for demo (no API call)
  const mockSearch = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock data based on common foods
      let mockResults = [];
      
      if (query.toLowerCase().includes('apple')) {
        mockResults.push({
          food_name: 'Apple',
          nf_calories: 95,
          nf_protein: 0.5,
          nf_total_carbohydrate: 25,
          nf_total_fat: 0.3,
          serving_qty: 1,
          serving_unit: 'medium'
        });
      } else if (query.toLowerCase().includes('bread')) {
        mockResults.push({
          food_name: 'Whole Wheat Bread',
          nf_calories: 69,
          nf_protein: 3.6,
          nf_total_carbohydrate: 12,
          nf_total_fat: 1.1,
          serving_qty: 1,
          serving_unit: 'slice'
        });
      } else if (query.toLowerCase().includes('chicken')) {
        mockResults.push({
          food_name: 'Grilled Chicken Breast',
          nf_calories: 165,
          nf_protein: 31,
          nf_total_carbohydrate: 0,
          nf_total_fat: 3.6,
          serving_qty: 3,
          serving_unit: 'oz'
        });
      } else if (query.toLowerCase().includes('banana')) {
        mockResults.push({
          food_name: 'Banana',
          nf_calories: 105,
          nf_protein: 1.3,
          nf_total_carbohydrate: 27,
          nf_total_fat: 0.4,
          serving_qty: 1,
          serving_unit: 'medium'
        });
      } else if (query.toLowerCase().includes('egg')) {
        mockResults.push({
          food_name: 'Egg',
          nf_calories: 78,
          nf_protein: 6.3,
          nf_total_carbohydrate: 0.6,
          nf_total_fat: 5.3,
          serving_qty: 1,
          serving_unit: 'large'
        });
      } else if (query.toLowerCase().includes('steak')) {
        mockResults.push({
          food_name: 'Beef Steak',
          nf_calories: 250,
          nf_protein: 26,
          nf_total_carbohydrate: 0,
          nf_total_fat: 17,
          serving_qty: 4,
          serving_unit: 'oz'
        });
      } else {
        // Generic result
        mockResults.push({
          food_name: query,
          nf_calories: 100,
          nf_protein: 5,
          nf_total_carbohydrate: 15,
          nf_total_fat: 3,
          serving_qty: 1,
          serving_unit: 'serving'
        });
      }
      
      // Handle multiple food items in one search
      if (query.toLowerCase().includes('banana') && query.toLowerCase().includes('steak')) {
        mockResults = [
          {
            food_name: 'Banana',
            nf_calories: 105,
            nf_protein: 1.3,
            nf_total_carbohydrate: 27,
            nf_total_fat: 0.4,
            serving_qty: 1,
            serving_unit: 'medium'
          },
          {
            food_name: 'Beef Steak',
            nf_calories: 250,
            nf_protein: 26,
            nf_total_carbohydrate: 0,
            nf_total_fat: 17,
            serving_qty: 4,
            serving_unit: 'oz'
          }
        ];
      }
      
      setResults(mockResults);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div>
      <form onSubmit={searchFood} className="mb-4">
        <label className="block text-xs font-semibold text-indigo-700 mb-2">
          Search for food
        </label>
        <div className="flex items-center bg-indigo-50 rounded-lg overflow-hidden pl-4 pr-1 focus-within:ring-2 focus-within:ring-indigo-500/50 shadow-inner">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2.5 bg-transparent border-none focus:outline-none text-sm text-indigo-900 placeholder-indigo-400"
            placeholder="e.g. an apple, 2 slices of bread"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium ml-1 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-1 animate-pulse">
          <p className="text-indigo-500 text-sm">Looking up nutrition info...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-2 bg-red-50 rounded-lg">
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-sm text-indigo-700 mb-2">Results:</h4>
          <ul className="divide-y divide-indigo-100 bg-indigo-50/50 rounded-lg overflow-hidden">
            {results.map((food, index) => (
              <li
                key={index}
                className={`py-3 px-4 hover:bg-indigo-100/50 transition-colors ${food.justAdded ? 'bg-emerald-100/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-900">{food.food_name} <span className="text-indigo-500 text-xs font-normal">({food.serving_qty} {food.serving_unit})</span></p>
                    <p className="text-xs text-indigo-600 mt-1">
                      {Math.round(food.nf_calories)} cal | P: {Math.round(food.nf_protein)}g | C: {Math.round(food.nf_total_carbohydrate)}g | F: {Math.round(food.nf_total_fat)}g
                    </p>
                  </div>
                  <button 
                    className={`px-3 py-1.5 ${food.justAdded ? 'bg-emerald-500' : 'bg-indigo-600'} text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm`}
                    onClick={() => handleFoodSelect(food)}
                  >
                    {food.justAdded ? 'Added' : 'Add'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodSearch; 