import { useState, useEffect } from 'react';
import { getSkills } from '../services/api';
import { Link } from 'react-router-dom';

const SkillList = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await getSkills();
      setSkills(data);
    };
    fetchSkills();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Skills</h2>
      <ul>
        {skills.map(skill => (
          <li key={skill.id} className="mb-2">
            {skill.name}
            <Link to={`/app/skills/edit/${skill.id}`} className="text-blue-600 ml-2">Edit</Link>
          </li>
        ))}
      </ul>
      <Link to="/app/skills/new" className="text-blue-600 mt-4 block">Add New Skill</Link>
    </div>
  );
};

export default SkillList;
