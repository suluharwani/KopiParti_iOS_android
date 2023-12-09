import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userSignUp } from '../src/api/userApiSignup';
import { themeColors } from '../theme';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [LevelValue, setValue] = useState(null);
  const [level, setLevel] = useState([
    { label: 'Pencari Kerja', value: '1' },
    { label: 'Penyedia Lowongan', value: '2' },
  ]);

  const handleSignUp = () => {
    userSignUp({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      level: LevelValue,
    })
      .then((response) => {
        // Handle successful sign up
        console.log('Sign up successful!', response);
        if (response.data.success) {
          Alert.alert('Login Berhasil, silakan login dengan akun yang anda buat');
        } else {
          const errorJSON = response.data.message;
          let pesan = '';
          for (const key in errorJSON) {
            if (errorJSON.hasOwnProperty(key)) {
              const errorMessage = errorJSON[key];
              pesan += `*${errorMessage} \n`;
            }
            Alert.alert(pesan);
          }
        }
      })
      .catch((error) => {
        // Handle sign up error
        console.error('Error signing up:', error);
      });
  };

  return (
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
        
        </View>
        <View className="flex-row justify-center">
          <Image
            source={require('../assets/images/signup.png')}
            style={{width: 165, height: 110}}
          />
        </View>
      </SafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingHorizontal: 8,
          paddingTop: 8,
        }}
        data={['placeholder']}
        keyExtractor={(item) => item}
        renderItem={() => (
          <View style={{ flex: 1, backgroundColor: 'white', padding: 8, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
            <View style={{ marginBottom: 10 }}>
              <Text className="text-gray-700 ml-4">Nama Depan</Text>
              <TextInput
               className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nama Depan"
                onChangeText={(firstname) => setFirstName(firstname)}
              />
              <Text className="text-gray-700 ml-4">Nama Belakang</Text>
              <TextInput
               className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nama Belakang"
                onChangeText={(lastname) => setLastName(lastname)}
              />
              <Text className="text-gray-700 ml-4">Tipe User</Text>
              <DropDownPicker
                open={open}
                value={LevelValue}
                items={level}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setLevel}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                onChangeItem={(item) => {
                  setValue(item.value);
                }}
              />
              <Text className="text-gray-700 ml-4">Email Address</Text>
              <TextInput
               className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
              />
              <Text className="text-gray-700 ml-4">Password</Text>
              <TextInput
               className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                secureTextEntry
                placeholder="Enter Password"
                onChangeText={(password) => setPassword(password)}
              />
              <TouchableOpacity 
              className="py-3 bg-yellow-400 rounded-xl" onPress={()=> handleSignUp()}>
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Sign Up
                </Text>
             </TouchableOpacity>

            </View>
            <Text style={{ fontSize: 20, color: '#dedede', fontWeight: 'bold', textAlign: 'center', paddingVertical: 5 }}>
              Or
            </Text>
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 7 }}>
              <Text style={{ color: 'black', fontWeight: '600' }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="font-semibold text-yellow-500"> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
