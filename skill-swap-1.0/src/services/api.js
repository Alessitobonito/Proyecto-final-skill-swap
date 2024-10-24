import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const SKILLS_COLLECTION = 'skills';

export const getSkills = async (userId) => {
  const skillsCollection = collection(db, SKILLS_COLLECTION);
  const q = query(skillsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSkill = async (id, userId) => {
  const skillDoc = doc(db, SKILLS_COLLECTION, id);
  const docSnap = await getDoc(skillDoc);
  if (docSnap.exists() && docSnap.data().userId === userId) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Skill not found or unauthorized');
  }
};

export const addSkill = async (skillData, userId) => {
  const skillsCollection = collection(db, SKILLS_COLLECTION);
  const docRef = await addDoc(skillsCollection, { ...skillData, userId });
  return { id: docRef.id, ...skillData, userId };
};

export const updateSkill = async (id, skillData, userId) => {
  const skillDoc = doc(db, SKILLS_COLLECTION, id);
  await updateDoc(skillDoc, { ...skillData, userId });
  return { id, ...skillData, userId };
};

export const deleteSkill = async (id) => {
  const skillDoc = doc(db, SKILLS_COLLECTION, id);
  await deleteDoc(skillDoc);
};

// Función combinada para guardar (añadir o actualizar) una habilidad
export const saveSkill = async (skill, userId) => {
  if (skill.id) {
    return updateSkill(skill.id, skill, userId);
  } else {
    return addSkill(skill, userId);
  }
};