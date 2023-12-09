import axios from "axios";
import config from '../../config';
const apiurl = config.API_URL
const ApiManager = axios.create({
    baseURL:apiurl,
    responseType:'json',
    // withCredentials:true

});
export default ApiManager;