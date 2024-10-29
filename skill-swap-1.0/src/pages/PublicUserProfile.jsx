import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PublicUserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{userProfile.displayName}'s Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {userProfile.photoURL && (
          <img 
            src={userProfile.photoURL} 
            alt={userProfile.displayName} 
            className="w-32 h-32 rounded-full mb-4"
          />
        )}
        <p className="text-gray-600 mb-4">{userProfile.bio}</p>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        {/*listar las habilidades del usuario */}
        <Link 
            to={`/app/chat/${userId}/${encodeURIComponent(userProfile.displayName)}`}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block hover:bg-blue-600 transition duration-300"
            >
            Chat with {userProfile.displayName}
        </Link>
      </div>
      {/*añadir la sección de reseñas cuando la implemente */}
    </div>
  );
};

export default PublicUserProfile;