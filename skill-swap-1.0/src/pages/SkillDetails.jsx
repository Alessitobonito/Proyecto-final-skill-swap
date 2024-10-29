import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSkill } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SkillDetails = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const skillData = await getSkill(id, user.uid);
        setSkill(skillData);
      } catch (error) {
        console.error('Error fetching skill:', error);
      }
    };

    if (user) {
      fetchSkill();
    }
  }, [id, user]);

  if (!skill) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{skill.name}</h1>
      {skill.imageUrl && (
        <img src={skill.imageUrl} alt={skill.name} className="w-full max-w-md mb-4 rounded-lg shadow-lg" />
      )}
      <p className="text-xl mb-2"><strong>Level:</strong> {skill.level}</p>
      <p className="text-xl mb-2"><strong>Category:</strong> {skill.category}</p>
      <p className="text-lg mb-4">{skill.description}</p>
    </div>
  );
};

export default SkillDetails;