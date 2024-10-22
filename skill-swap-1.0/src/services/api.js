import axios from 'axios';

const API_URL = 'https://67171fea3fcb11b265d48a23.mockapi.io/api/v1/Skills';
export const getSkills = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getSkill = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const saveSkill = async (skill) => {
  if (skill.id) {
    // Editar una habilidad existente
    const response = await axios.put(`${API_URL}/${skill.id}`, skill);
    return response.data;
  } else {
    // Crear una nueva habilidad
    const response = await axios.post(API_URL, skill);
    return response.data;
  }
};
