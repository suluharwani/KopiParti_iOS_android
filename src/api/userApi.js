import ApiManager from "./ApiManager";
export const userLogin = async data=>{
    try {
        
        const result = await ApiManager('/users/token',{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            data:data
        })
        return result
    } catch (error) {
        return error.response.data
    }
}
