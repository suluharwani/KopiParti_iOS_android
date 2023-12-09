import axios from "axios";
import config from '../../config';
const UploadCV = async (data) => {
    const apiurl = config.API_URL
  try {
    if (!data || !data.id || !data.formData || !data.token) {
      throw new Error("Data tidak lengkap");
    }
    
    const response = await axios.post(`${apiurl}/users/updatecvuser/${data.id}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${data.token}`,
      },
    });
    
  
    
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Gagal mengunggah CV");
    }
  } catch (error) {
    return error;
  }
};
const fetchPdf = async (data) => {
  const apiurl = config.API_URL;
  
  try {
    const response = await axios.get(`${apiurl}/users/file/${data.id_user}`, {
      responseType: 'arraybuffer', // Menggunakan responseType 'arraybuffer'
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);

    return url;
  
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
};

export { UploadCV, fetchPdf };
