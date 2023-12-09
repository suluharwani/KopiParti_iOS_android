import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApplyJob, CheckApply, GetJobDetail } from '../src/api/JobApi';
import { themeColors } from '../theme';
import Header from './header';

const JobDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const title = "Detail Lowongan";
  const [jobDetail, setJobDetail] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [Usertoken, setUserToken] = useState(null);
  const [UserData, setUserData] = useState();
  const [hasApplied, setHasApplied] = useState(false);
  
  
  
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const result = await GetJobDetail(id);
        setJobDetail(result.data);
          // Hitung selisih waktu
          const createdTime = new Date(result.data.created_at);
          const currentTime = new Date();
          const timeDiff = currentTime - createdTime;
          const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
          const daysAgo = Math.floor(hoursAgo / 24);
          
          // Menetapkan waktu yang sudah dihitung
          if (daysAgo >= 2) {
            setTimeAgo(`${daysAgo} hari yang lalu`);
          } else if (hoursAgo >= 2) {
            setTimeAgo(`${hoursAgo} jam yang lalu`);
          } else {
            setTimeAgo('Baru saja');
          }
      
      } catch (error) {
        console.error('Error fetching job detail:', error);
      }
    };
    
    fetchJobDetail();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const data = await AsyncStorage.getItem('data');
        setUserToken(token);
        setUserData(data);
        
        get_id_user = JSON.parse(data).id
        // console.log(`token = ${token}, user = ${get_id_user}, job = ${id}`)
        CheckApply({
          token : token,
          id_user :get_id_user,
          id_job : id
        }).then((result) => {
          console.log(result.success)
    
          if(result.success){
            setHasApplied(true);
          }
          
        
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  

  if (jobDetail === null) {
    return null; // Return null if jobDetail is null
  }
  const lamarPekerjaan = () => {
    console.log(`has applied = ${hasApplied}`)
    if (hasApplied) {
      Alert.alert(
        "Anda Sudah Melamar",
        "Anda sudah melamar pekerjaan ini sebelumnya.",
        [
          {
            text: "OK",
            onPress: () => console.log("Pesan ditutup"),
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Konfirmasi Lamar Pekerjaan",
        "Apakah Anda yakin ingin melamar pekerjaan ini?",
        [
          {
            text: "Batal",
            onPress: () => console.log("Lamaran pekerjaan dibatalkan"),
            style: "cancel"
          },
          { text: "Lamar", onPress: doApplyJob }
        ],
        { cancelable: false }
      );
    }
  };

  const doApplyJob = async () => {
    try {

      
      
      ApplyJob({
        token : Usertoken,
        id_user : JSON.parse(UserData).id,
        id_job : id,
        status_lamaran: 1
      }).then((result) => {
        console.log(result.data);
        Alert.alert("Pekerjaan berhasil dilamar")
      setHasApplied(true);
      
      });
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <Header judul={title} />
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
        <>
        <ScrollView>
          <Text className="text-2xl font-bold mb-2 text-black">{jobDetail.job}</Text>
          
          <Text className="text-lg mb-2 text-black">Waktu ditayangkan: {timeAgo}</Text>
          <Text className="text-lg mb-2 text-black">Minimum Qualification: {jobDetail.minimum_qualification}</Text>
          <Text className="text-lg mb-2 text-black">Alamat: {jobDetail.address}</Text>
          <Text className="text-lg mb-2 text-black">Benefits: {jobDetail.benefits}</Text>
          <Text className="text-lg mb-2 text-black">Fasilitas: {jobDetail.facility}</Text>
          <Text className="text-lg mb-2 text-black">{jobDetail.job_desc}</Text>
          </ScrollView>
          <View style={{ padding: 16, backgroundColor: 'white' }}>
        <TouchableOpacity 
          style={{ 
            height: 50, 
            width: '100%', // Lebar penuh
            backgroundColor: '#FFD700', 
            borderRadius: 8, 
            justifyContent: 'center', 
            alignItems: 'center'
          }}
          onPress={lamarPekerjaan}
        >
          <Text 
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333333'
            }}
          >
            Lamar Pekerjaan
          </Text>
        </TouchableOpacity>
      </View>
        </>
        
      </View>
    </View>
  );
};

export default JobDetailScreen;
