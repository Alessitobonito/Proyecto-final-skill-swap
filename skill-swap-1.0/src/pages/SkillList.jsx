import { useState, useEffect } from 'react';
import { getSkills, deleteSkill } from '../services/api';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchSkills(user.uid);
      } else {
        setSkills([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSkills = async (userId) => {
    const data = await getSkills(userId);
    setSkills(data);
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId, user.uid);
        setSkills(skills.filter(skill => skill.id !== skillId));
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Skills</h2>
      {user ? (
        <>
          <ul>
            {skills.map(skill => (
              <li key={skill.id} className="mb-2 flex items-center">
                <span>{skill.name}</span>
                <Link to={`/app/skills/edit/${skill.id}`} className="text-blue-600 ml-2">Edit</Link>
                <button 
                  onClick={() => handleDelete(skill.id)} 
                  className="text-red-600 ml-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <Link to="/app/skills/new" className="text-blue-600 mt-4 block">Add New Skill</Link>
        </>
      ) : (
        <p>Please log in to view your skills.</p>
      )}
    </div>
  );
};

export default SkillList;