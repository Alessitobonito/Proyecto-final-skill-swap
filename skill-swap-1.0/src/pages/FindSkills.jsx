import React, { useState, useEffect } from 'react';
import { getAllSkills } from '../services/api';
import { CATEGORIES } from '../utils/categories';
import { useAuth } from '../contexts/AuthContext'; 

const FindSkills = () => {
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const { user } = useAuth();
  
    useEffect(() => {
      if (user) {
        fetchAllSkills();
      }
    }, [user]);
  
    const fetchAllSkills = async () => {
      const fetchedSkills = await getAllSkills(user.uid);
      setSkills(fetchedSkills);
      setFilteredSkills(fetchedSkills);
    };

  const filterSkills = () => {
    let result = skills;

    if (searchTerm) {
      result = result.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(skill => skill.category === selectedCategory);
    }

    setFilteredSkills(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Find Skills</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{skill.name}</h2>
            <p className="text-gray-600">{skill.description}</p>
            <p className="mt-2">Level: {skill.level}</p>
            <p>Category: {skill.category}</p>
            <p>Offered by: {skill.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindSkills;