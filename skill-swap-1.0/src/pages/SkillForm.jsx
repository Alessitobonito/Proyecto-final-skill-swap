import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkill, saveSkill } from '../services/api';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext'; 
import { CATEGORIES } from '../utils/categories';

const SkillForm = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState({ 
    name: '', 
    description: '', 
    level: 'beginner', 
    category: '', 
    imageUrl: '',
    userName: '' 
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    if (id && user) {
      const fetchSkill = async () => {
        const data = await getSkill(id, user.uid);
        setSkill(data);
      };
      fetchSkill();
    } else if (user) {
      setSkill(prevSkill => ({
        ...prevSkill,
        userName: user.displayName || user.email 
      }));
    }
  }, [id, user]);

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        let imageUrl = skill.imageUrl;
        if (file) {
          const storageRef = ref(storage, `skill-images/${user.uid}/${file.name}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }
  
        const updatedSkill = {
          ...skill,
          imageUrl,
          category: skill.category === 'Other' ? customCategory : skill.category,
          userName: user.displayName || user.email,
          userId: user.uid 
        };
  
        if (!updatedSkill.category) {
          await Swal.fire({
            icon: 'error',
            title: 'Category Required',
            text: 'Please select a category or enter a custom one.'
          });
          return;
        }
  
        await saveSkill(updatedSkill, user.uid);
        
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Skill saved successfully!',
          timer: 1500,
          showConfirmButton: false
        });
        
        navigate('/app/skills');
      } catch (error) {
        console.error('Error saving skill:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error saving skill. Please try again.'
        });
      }
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'You must be authenticated to save skills.'
      });
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">{id ? 'Edit Skill' : 'Add Skill'}</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Skill Name
          </label>
          <input
            type="text"
            name="name"
            value={skill.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            id="name"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            value={skill.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            id="description"
            rows="4"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="level">
            Level
          </label>
          <select
            name="level"
            value={skill.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            id="level"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category
          </label>
          <select
            name="category"
            value={skill.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            id="category"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
  
        {skill.category === 'Other' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="customCategory">
              Custom Category
            </label>
            <input
              type="text"
              name="customCategory"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              id="customCategory"
              placeholder="Keep it simple, that way it'll be easy to be found!"
              required
            />
          </div>
        )}
  
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="image">
            Image (Something you'd like to share related to your skill)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded"
            id="image"
            accept="image/*"
          />
        </div>
  
        {skill.imageUrl && (
          <div className="mb-4">
            <img
              src={skill.imageUrl}
              alt="Current skill"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          {id ? 'Update Skill' : 'Add Skill'}
        </button>
      </form>
    </div>
  )};

export default SkillForm;