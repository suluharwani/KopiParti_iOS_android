import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { themeColors } from '../theme';
import Header from './header';
export default function BautLamaran() {
  const navigation = useNavigation();
  const [Usertoken, setUserToken] = useState(null);
  const title = "Profile"
  AsyncStorage.getItem('token').then((token) => {
    setUserToken(token)
    })
    return (
      <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
       <Header judul={title}/>
        <View className="flex-1 bg-white px-8 pt-8"
          style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
        >
          {/* halaman */}
        </View>
      </View>
    )
}