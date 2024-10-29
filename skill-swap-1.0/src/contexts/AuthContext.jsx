import React, { createContext, useState, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', {
        timestamp: new Date().toISOString(),
        user: user ? {
          uid: user.uid,
          email: user.email
        } : null,
        tabId: Math.random().toString(36).substr(2, 9) // ID único para identificar cada pestaña
      });
    });
  
    return () => unsubscribe();
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      });
      navigate('/app');
    } catch (error) {
      console.error("Login error:", error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password.',
      });
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      Toast.fire({
        icon: 'success',
        title: 'Account created successfully'
      });
      navigate('/app');
    } catch (error) {
      console.error("Registration error:", error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Toast.fire({
        icon: 'success',
        title: 'Logged out successfully'
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'There was an error logging out.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);