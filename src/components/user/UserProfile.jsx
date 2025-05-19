import { useState, useEffect } from 'react';
import { saveUserProfile, loadUserProfile } from '../../utils/userProfile';
import { calculateDailyNutrition } from '../../utils/nutrition';

const UserProfile = ({ onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    weightKg: 85,
    goal: 'muscle_gain',
    activityLevel: 1.6
  });

  // Load user profile on component mount
  useEffect(() => {
    const userProfile = loadUserProfile();
    setProfile(userProfile);
    
    // Calculate nutrition goals based on profile
    const nutritionGoals = calculateDailyNutrition(
      userProfile.weightKg,
      userProfile.goal,
      userProfile.activityLevel
    );
    
    // Notify parent component about profile update
    onProfileUpdate(userProfile, nutritionGoals);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: name === 'weightKg' || name === 'activityLevel' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save profile to local storage
    saveUserProfile(profile);
    
    // Calculate nutrition goals
    const nutritionGoals = calculateDailyNutrition(
      profile.weightKg,
      profile.goal,
      profile.activityLevel
    );
    
    // Notify parent component
    onProfileUpdate(profile, nutritionGoals);
    
    setIsEditing(false);
  };

  const activityLevels = [
    { value: 1.2, label: 'Sedentary (little or no exercise)' },
    { value: 1.375, label: 'Light activity (1-3 days/week)' },
    { value: 1.55, label: 'Moderate activity (3-5 days/week)' },
    { value: 1.725, label: 'Very active (6-7 days/week)' },
    { value: 1.9, label: 'Extremely active (physical job or 2x training)' }
  ];

  return (
    <div className="mb-6">
      {!isEditing ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 mb-1">User Profile</h3>
            <p className="text-xs text-indigo-600">
              <span className="font-medium">{profile.weightKg}kg</span> • 
              <span className="ml-1">{profile.goal.replace('_', ' ')}</span>
            </p>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 text-xs rounded-lg font-medium transition-colors"
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-indigo-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-indigo-900 mb-3">Update Profile</h3>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-indigo-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              value={profile.weightKg}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
              min="30"
              max="200"
              step="0.1"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-indigo-700 mb-1">Fitness Goal</label>
            <select
              name="goal"
              value={profile.goal}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
              required
            >
              <option value="muscle_gain">Muscle Gain</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-indigo-700 mb-1">Activity Level</label>
            <select
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-sm"
              required
            >
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1 font-medium text-xs"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile; 