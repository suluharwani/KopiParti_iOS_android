import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import * as Icons from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../../../theme';
export default function Header() {
  const navigation = useNavigation();
  const [Usertoken, setUserToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  
  const menuItems = [
    {label: 'Home', value: 'Home'},
    {label: 'Profile', value: 'Profile'},
    {label: 'Logout', value: 'Login'},
  ];
  
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{padding: 10}}
      onPress={() => {
        setSelectedValue(item.value);
        setModalVisible(false);
        navigation.navigate(item.value);
      }}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );
  console.log(modalVisible);
  AsyncStorage.getItem('token').then(token => {
    setUserToken(token);
  });
  
  return (
      <SafeAreaView className="flex">
        <View className="flex-row justify-center">
          <View className="flex-1 items-center justify-center">
            <View className="flex-row items-center justify-between w-full p-4 ">
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                className=" p-2 rounded-tr-2xl rounded-bl-2x2 ml-4"
                style={{backgroundColor: themeColors.latte}}>
                <Icons.UserIcon size="20" color="black" />
              </TouchableOpacity>
              <Text className="text-white text-xl">Home</Text>
              <TouchableOpacity
                className=" p-2 rounded-tr-2x2 rounded-bl-2xl ml-4"
                style={{backgroundColor: themeColors.latte}}
                onPress={() => setModalVisible(true)}>
                <Icons.ListBulletIcon size="20" color="black" />
              </TouchableOpacity>
              {/* Modal Menu */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      borderRadius: 8,
                    }}>
                    <FlatList
                      data={menuItems}
                      renderItem={renderItem}
                      keyExtractor={item => item.value}
                      contentContainerStyle={{paddingBottom: 10}}
                    />
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{
                        backgroundColor: '#1E40AF',
                        padding: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white'}}>Tutup Menu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Konten Aplikasi */}
            </View>
            {/* Konten Aplikasi */}
          </View>
        </View>
      </SafeAreaView>

  );
}
