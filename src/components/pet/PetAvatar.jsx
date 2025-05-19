import { useState, useEffect } from 'react';

const PetAvatar = ({ hungerLevel, mood, nutritionProgress }) => {
  const [animation, setAnimation] = useState('');
  const [message, setMessage] = useState('');
  
  // Change animation based on mood
  useEffect(() => {
    if (mood === 'happy') {
      setAnimation('animate-bounce');
    } else if (mood === 'sleepy') {
      setAnimation('animate-pulse');
    } else if (mood === 'hungry') {
      setAnimation('animate-wiggle');
    } else {
      setAnimation('');
    }
  }, [mood]);

  // Set message based on nutrition progress
  useEffect(() => {
    if (!nutritionProgress) {
      setMessage('');
      return;
    }

    // Check which nutrient is most lacking
    const nutrients = ['protein', 'carbs', 'fat'];
    const lowestNutrient = nutrients.sort((a, b) => 
      (nutritionProgress[a] || 0) - (nutritionProgress[b] || 0)
    )[0];
    
    if (nutritionProgress.calories < 30) {
      setMessage('Your pet is hungry!');
    } else if (lowestNutrient === 'protein' && nutritionProgress.protein < 60) {
      setMessage('Your pet needs more protein!');
    } else if (lowestNutrient === 'carbs' && nutritionProgress.carbs < 60) {
      setMessage('Your pet needs more energy from carbs!');
    } else if (lowestNutrient === 'fat' && nutritionProgress.fat < 60) {
      setMessage('Your pet needs more healthy fats!');
    } else if (nutritionProgress.calories > 95) {
      setMessage('Your pet is happy and energized!');
    } else {
      setMessage('');
    }
  }, [nutritionProgress]);

  // Get pet emoji based on mood
  const getPetEmoji = () => {
    switch (mood) {
      case 'happy':
        return '😺';
      case 'sleepy':
        return '😾';
      case 'hungry':
        return '🙀';
      default:
        return '🐱';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4 mb-2">
        <div className={`w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-md ${animation}`}>
          <span className="text-2xl">{getPetEmoji()}</span>
        </div>
        <div>
          <p className="font-semibold text-sm text-indigo-900">
            Pet Status: <span className="text-indigo-600 ml-1">{mood}</span>
          </p>
          <p className="text-xs text-indigo-400 mt-1">Your pet reflects your eating habits</p>
        </div>
      </div>
      
      {message && (
        <div className="bg-indigo-50 p-2 rounded-lg text-center">
          <p className="text-indigo-600 text-sm italic">{message}</p>
        </div>
      )}
    </div>
  );
};

export default PetAvatar; 