import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { getSkills } from '../services/api'; // Asegúrate de importar la función para obtener habilidades

const PublicUserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [skills, setSkills] = useState([]); // Estado para habilidades
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    };

    const fetchReviews = async () => {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('receiverId', '==', userId)
      );
 const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsList = await Promise.all(reviewsSnapshot.docs.map(async (reviewDoc) => {
        const data = reviewDoc.data();
        const reviewerDoc = await getDoc(doc(db, 'users', data.reviewerId));
        const reviewerData = reviewerDoc.data();
        return {
          id: reviewDoc.id,
          ...data,
          reviewerName: reviewerData?.displayName || 'Anonymous',
          reviewerPhoto: reviewerData?.photoURL
        };
      }));
      setReviews(reviewsList);
    };

    const fetchSkills = async () => {
      const userSkills = await getSkills(userId); // Obtener habilidades del usuario
      setSkills(userSkills);
    };

    fetchUserProfile();
    fetchReviews();
    fetchSkills(); // Llama a la función para obtener habilidades
  }, [userId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to leave a review'
      });
      return;
    }

    if (user.uid === userId) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Action',
        text: 'You cannot review your own profile'
      });
      return;
    }

    setIsLoading(true);

    try {
      const reviewData = {
        receiverId: userId,
        reviewerId: user.uid,
        rating: Number(newReview.rating),
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      setNewReview({ rating: 5, comment: '' });
      
      Swal.fire({
        icon: 'success',
        title: 'Review Posted',
        text: 'Your review has been successfully posted'
      });

      // Recargar las reseñas
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('receiverId', '==', userId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const updatedReviews = await Promise.all(reviewsSnapshot.docs.map(async (reviewDoc) => {
        const data = reviewDoc.data();
        const reviewerDoc = await getDoc(doc(db, 'users', data.reviewerId));
        const reviewerData = reviewerDoc.data();
        return {
          id: reviewDoc.id,
          ...data,
          reviewerName: reviewerData?.displayName || 'Anonymous',
          reviewerPhoto: reviewerData?.photoURL
        };
      }));
      setReviews(updatedReviews);

    } catch (error) {
      console.error('Error posting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to post review. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <ul className="list-disc list-inside mb-4">
          {skills.length > 0 ? (
            skills.map(skill => (
              <li key={skill.id} className="text-gray-800">{skill.name} - {skill.level}</li>
            ))
          ) : (
            <li className="text-gray-500">No skills listed.</li>
          )}
        </ul>

        <Link 
          to={`/app/chat/${userId}/${encodeURIComponent(userProfile.displayName)}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block hover:bg-blue-600 transition duration-300"
        >
          Chat with {userProfile.displayName}
        </Link>
      </div>

      {/* Sección de Reseñas */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {/* Formulario de nueva reseña */}
        {user && user.uid !== userId && (
          <form onSubmit={handleReviewSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Star' : 'Stars'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                rows="4"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Lista de reseñas */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  {review.reviewerPhoto && <img
                      src={review.reviewerPhoto}
                      alt={review.reviewerName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  }
                  <span className="font-semibold">{review.reviewerName}</span>
                  <span className="ml-2 text-gray-500">({review.rating} Stars)</span>
                </div>
                <p>{review.comment}</p>
                <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;