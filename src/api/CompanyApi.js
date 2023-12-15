import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from "./ApiManager";
const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };

const getProvinces = async data=>{
    try {
        
        const result = await ApiManager('/provinces',{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
            },
            data:data
        })
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const getCities = async data=>{
    
    try {
        
        const result = await ApiManager(`/cities/${data}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
            },
            data:undefined
        })
        return result.data
    } catch (error) {
        console.log(error)
        console.log(ApiManager(`/cities/${data}`))
        
        return 0
    }
}
const postJob = async data=>{
    try {
        console.log(data)
        const result = await ApiManager(`/job`,{
            method:"POST",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            },
            data:data
        })
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const getJob = async data=>{
    try {
        console.log(data)
        const result = await ApiManager(`/jobcompany/${data.id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            },
            data:undefined
        })
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const GetCompanyData = async data=>{
    try {
        console.log(data)
        const result = await ApiManager(`/company/${data.id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            },
            
            data:data
        })
        // console.log(result)
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const GetApplicant = async data=>{
    try {
        const token = await getToken();
        
        
        const result = await ApiManager(`/applicant/${data.id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${token}`
            },
            data:undefined
            
       
        })
        // console.log(result)
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const GetApplicantDet = async data=>{
    try {
        const token = await getToken();
        
        
        const result = await ApiManager(`/applyuser/${data.id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${token}`
            },
            data:undefined
            
       
        })
        return result.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}
const updateStatus = async data=>{
    try {
        const token = await getToken();
        
        
        const result = await ApiManager(`/updatestatus`,{
            method:"POST",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${token}`
            },
            data:data
            
       
        })
        console.log(data)
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const deleteJob = async data=>{
    try {
        const token = await getToken();
        console.log(data.id)
        
        const result = await ApiManager(`/job/${data.id}`,{
            method:"DELETE",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${token}`
            },
            data:data
            
       
        })
        console.log(result.data)
        return result.data
    } catch (error) {
        return error.response.data
    }
}
export { GetApplicant, GetApplicantDet, GetCompanyData, deleteJob, getCities, getJob, getProvinces, postJob, updateStatus };

