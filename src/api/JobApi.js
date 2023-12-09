import ApiManager from "./ApiManager";
const GetJobPage = async data=>{
    try {
    
            var s = (typeof data.s === "undefined" ? "" : data.s);
             const result = await ApiManager(`/job/page?page=${data.page}&size=7&s=${s}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json"
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
const GetJobDetail = async id=>{
    try {
             const result = await ApiManager(`/job/${id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json"
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
const ApplyJob = async data=>{
    try {
        
        const result = await ApiManager('/apply',{
            method:"POST",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            },
            data:data
        })
        return result
    } catch (error) {
        return error.response.data
    }
}
const CheckApply = async data=>{
    try {

            const result = await ApiManager(`/apply/check/${data.id_user}/${data.id_job}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
const Dilamar = async data=>{
    try {
             const result = await ApiManager(`/applyuser/${data.id_user}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
export { ApplyJob, CheckApply, Dilamar, GetJobDetail, GetJobPage };

