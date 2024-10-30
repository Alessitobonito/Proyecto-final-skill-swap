import React, { useState, useEffect } from 'react';
import { getAllSkills } from '../services/api';
import { CATEGORIES } from '../utils/categories';
import { useAuth } from '../contexts/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';

const FindSkills = () => {
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        fetchAllSkills();
      }
    }, [user]);

    useEffect(() => {
      filterSkills();
    }, [searchTerm, selectedCategories, skills]);
  
    const fetchAllSkills = async () => {
      try {
        const fetchedSkills = await getAllSkills(user.uid);
        setSkills(fetchedSkills);
        setFilteredSkills(fetchedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleCategoryToggle = (category) => {
      setSelectedCategories(prev => 
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    };

    const filterSkills = () => {
      let result = skills;

      if (searchTerm) {
        result = result.filter(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategories.length > 0) {
        result = result.filter(skill => {
          if (selectedCategories.includes('Other')) {
            return !CATEGORIES.includes(skill.category) || selectedCategories.includes(skill.category);
          }
          return selectedCategories.includes(skill.category);
        });
      }

      setFilteredSkills(result);
    };

    const getLevelColor = (level) => {
      switch (level.toLowerCase()) {
        case 'beginner':
          return 'bg-green-100 text-green-800';
        case 'intermediate':
          return 'bg-blue-100 text-blue-800';
        case 'advanced':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Find Skills</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search skills by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set([...CATEGORIES, 'Other'])].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div key={skill.id} 
                 className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {skill.imageUrl && (
                <img 
                  src={skill.imageUrl} 
                  alt={skill.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{skill.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{skill.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                    {skill.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    by {skill.userName}
                  </span>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/app/chat/${skill.userId}/${encodeURIComponent(skill.userName)}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                    Chat with {skill.userName}
                  </Link>
                </div>
                <div className='mt-4'>
                  <Link 
                    to={`/app/user/${skill.userId}`} 
                    className="text-blue-500 hover:underline">
                    View {skill.userName}'s Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-gray-500 text-lg">No skills found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    );
};

export default FindSkills;