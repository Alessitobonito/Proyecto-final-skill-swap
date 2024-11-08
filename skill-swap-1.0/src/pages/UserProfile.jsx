import { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (auth.currentUser) {
        setFormData(prevState => ({
          ...prevState,
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        }));
        setPhotoURL(auth.currentUser.photoURL || '');
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData(prevState => ({
              ...prevState,
              bio: userData.bio || '',
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserProfile();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      let updateData = {
        displayName: formData.displayName
      };

      if (selectedFile) {
        const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        const photoURL = await getDownloadURL(storageRef);
        updateData.photoURL = photoURL;
        setPhotoURL(photoURL);
      }

      await updateProfile(user, updateData);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL: updateData.photoURL || user.photoURL,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout'
      });

      if (result.isConfirmed) {
        await logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'There was an error logging out. Please try again.'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Picture
          </label>
          {photoURL && (
            <img
              src={photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;