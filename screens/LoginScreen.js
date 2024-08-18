import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userLogin } from '../src/api/userApi';
import { themeColors } from '../theme';
export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const [password, setPassword] = useState('');
  
  saveStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch(e) {
      // save error
    }
  
  }
  const onLoginDemo = async () => {
    try {
      userLogin({
        email:"demo@mail.com",
        password:"demo"
      }).then((result)=>{
        console.log(result.data)

        if (result.data.success == true) {
         
         saveStorage('token',result.data.token);
        
        saveStorage('data', JSON.stringify(result.data.data)).then(navigation.navigate('Home'))
        
        }
      
        
      })

    
      
    } catch (error) {
      Alert.alert('Login Failed', error.response.data.message);
    }
  };
  const onLogin = async () => {
    try {
      userLogin({
        email:email,
        password:password
      }).then((result)=>{
        console.log(result.data)

        if (result.data.success == true) {
         
         saveStorage('token',result.data.token);
        
        saveStorage('data', JSON.stringify(result.data.data)).then(navigation.navigate('Home'))
        
        } else if(typeof(result.message)== 'string'){
          Alert.alert("Login gagal")

        }else{
          Alert.alert("Login gagal, mohon periksa Email dan Password")

        
        }
      
        
      })
      // await AsyncStorage.setItem('token', token);
      //    await AsyncStorage.setItem('data', userData);
      //      ()=> navigation.navigate('home')
    
      
    } catch (error) {
      Alert.alert('Login Failed', error.response.data.message);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView  className="flex ">
        <View className="flex-row justify-start">
        
        </View>
        <View  className="flex-row justify-center">
          <Image source={require('../assets/images/login.png')} 
          style={{width: 200, height: 200}} />
        </View>
        
        
      </SafeAreaView>
      <ScrollView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="email"
              // value='suluh@mail.com'
              onChangeText={(email) => setEmail(email)}
            />
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              secureTextEntry
              placeholder="password"
              // value='passwd'
              onChangeText={(password) => setPassword(password)}
            
            />
            <TouchableOpacity className="flex items-end">
              <Text className="text-gray-700 mb-5">Forgot Password?</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity 
              className="py-3 bg-yellow-400 rounded-xl" onPress={()=> onLoginDemo()}>
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Login Demo
                </Text>
             </TouchableOpacity> */}
            <TouchableOpacity 
              className="py-3 bg-yellow-400 rounded-xl" onPress={()=> onLogin()}>
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Login
                </Text>
             </TouchableOpacity>
            
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
          <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/google.png')} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/apple.png')} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/facebook.png')} className="w-10 h-10" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-yellow-500"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          
      </View>
      </ScrollView>
    </View>
    
  )
}