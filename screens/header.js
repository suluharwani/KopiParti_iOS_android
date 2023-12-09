import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Icons from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../theme';

export default function Header({judul}) {
  const navigation = useNavigation();
  const [Usertoken, setUserToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  
  const menuItems = [
    {label: 'Home', value: 'Home'},
    {label: 'Profile', value: 'Profile'},
    {label: 'Logout', value: 'Login'},
  ];
  Logout =  () => {

      Alert.alert(
        'Konfirmasi Logout',
        'Apakah Anda yakin ingin logout?',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                await AsyncStorage.removeItem('token')
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
                Alert.alert("Anda telah logout"); 
              // navigation.navigate('Login');
              } catch(e) {
                Alert.alert(e); 
              
              }
            },
          },
        ],
        { cancelable: false }
      );



  
  }
  
  // AsyncStorage.getItem('token').then(token => {
  //   setUserToken(token);
  // });
  if (judul == "detailjob") {
    
  }else{
  
  }
  


  return (
    <SafeAreaView className="flex">
      <View className="flex-row justify-center">
        <View className="flex-1 items-center justify-center">
          <View className="flex-row items-center justify-between w-full p-4 ">
          {judul == "Profile"  ? (
              <TouchableOpacity
              onPress={() =>  Logout()}
              className="p-1 rounded-tr-2x1  rounded-br-2xl ml-4"
              style={{ backgroundColor: themeColors.latte }}>
              <Icons.XCircleIcon size={25} color="black" />
            </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                className="p-1 rounded-tr-2x1  rounded-br-2xl ml-4"
                style={{ backgroundColor: themeColors.latte }}>
                <Icons.UserIcon size={25} color="black" />
              </TouchableOpacity>
              
            )}
            <Text className="text-white text-xl">{judul}</Text>
            <TouchableOpacity
              className=" p-1 rounded-tr-2x2 rounded-bl-2xl ml-4"
              style={{backgroundColor: themeColors.latte}}
              onPress={() => navigation.navigate('Home')}>
              <Icons.HomeIcon size={25} color="black" />
            </TouchableOpacity>
            {/* Modal Menu */}
            {/* <View style={styles.centeredView}> */}
              {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
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
              </Modal> */}
            {/* </View> */}
            {/* Konten Aplikasi */}
          </View>
          {/* Konten Aplikasi */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
