const environments = {
    development: {
      API_URL: 'http://10.0.2.2/api',
      DEBUG_MODE: true,
    },
    staging: {
      API_URL: 'https://api.cendratama.co.id/api',
      DEBUG_MODE: true,
    },
    production: {
      API_URL: 'https://api.habumishop.com/api',
      DEBUG_MODE: false,
    },
  };
  
  const getEnvironment = () => {
    
    return environments.production; 
  };
  
  const currentEnvironment = getEnvironment();
  
  export default currentEnvironment;
  