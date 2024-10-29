import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkill, saveSkill } from '../services/api';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';

const SkillForm = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState({ name: '', description: '', level: 'beginner', category: '', imageUrl: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id && user) {
      const fetchSkill = async () => {
        const data = await getSkill(id, user.uid);
        setSkill(data);
      };
      fetchSkill();
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

        const updatedSkill = { ...skill, imageUrl };
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
        <select
          name="level"
          value={skill.level}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          id="level"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
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
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border rounded"
          id="image"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default SkillForm;