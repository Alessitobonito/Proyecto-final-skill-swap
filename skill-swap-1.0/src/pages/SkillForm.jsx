import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkill, saveSkill } from '../services/api';

const SkillForm = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState({ name: '', description: '', level: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchSkill = async () => {
        const data = await getSkill(id);
        setSkill(data);
      };
      fetchSkill();
    }
  }, [id]);

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSkill(skill);
    navigate('/app/skills');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl mb-4">{id ? 'Edit Skill' : 'Add Skill'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="name">Skill Name</label>
        <input
          type="text"
          name="name"
          value={skill.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          id="name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={skill.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          id="description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="level">Level</label>
        <input
          type="text"
          name="level"
          value={skill.level}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          id="level"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          value={skill.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          id="category"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default SkillForm;