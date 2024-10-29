import { useState, useEffect } from 'react';
import { getSkills, deleteSkill } from '../services/api';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import Swal from 'sweetalert2';

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

  const handleDelete = async (skillId, skillName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${skillName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteSkill(skillId);
        setSkills(skills.filter(skill => skill.id !== skillId));
        Swal.fire('Deleted!', 'Your skill has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting skill:', error);
        Swal.fire('Error!', 'There was an error deleting the skill.', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Skills</h2>
        <Link
          to="/app/skills/new"
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Add New Skill
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {skill.imageUrl && (
              <img src={skill.imageUrl} alt={skill.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{skill.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {skill.category}
                </span>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Link
                  to={`/app/skills/${skill.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  View Details
                </Link>
                <Link
                  to={`/app/skills/edit/${skill.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(skill.id, skill.name)}
                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-500 text-lg">No skills added yet.</p>
            <p className="text-gray-400 mt-2">Click the button above to add your first skill!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillList;