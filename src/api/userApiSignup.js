import ApiManager from "./ApiManager";

export const userSignUp = async data=>{
    try {
        const result = await ApiManager('/users',{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            data:data
        })
        console.log(result)
        
        return result
    } catch (error) {
        return error.response.data
    }
}