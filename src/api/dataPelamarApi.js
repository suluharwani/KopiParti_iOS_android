import ApiManager from "./ApiManager";

const PostPendidikan = async data=>{
    try {
        
        const result = await ApiManager('/pendidikan',{
            method:"POST",
            headers:{
                'Content-Type':"application/json",
                'Authorization': `Bearer ${data.token}`
            },
            data:data
        })
        console.log('result')
        return result.data
    } catch (error) {
        return error.response.data
    }
}
const PostDataPelamar = async data=>{
    try {
        console.log(data)
        const result = await ApiManager('/datapelamar',{
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

const GetPendidikan = async id=>{
    
    try {
             const result = await ApiManager(`/pendidikan/${id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
const DeletePendidikan = async data=>{
    
    try {
             const result = await ApiManager(`/pendidikan/${data.id}`,{
            method:"DELETE",
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

const GetDataPelamar = async id=>{
    
    try {
             const result = await ApiManager(`/datapelamar/${id}`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
            },
        })
        return result.data
    
    } catch (error) {
        return error.response.data
    }
}
export { DeletePendidikan, GetDataPelamar, GetPendidikan, PostDataPelamar, PostPendidikan };

