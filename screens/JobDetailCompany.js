import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GetApplicant } from '../src/api/CompanyApi';
import { themeColors } from '../theme';
import Header from './header';
export default function JobDetailCompany({ route }) {
  const title = `Detail Lowongan`;
  const jobDetail = route.params.data;
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Usertoken, setUserToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setUserToken(token);
        if (token) {
          fetchData();
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        setLoading(false);
      }
    };
    
    getTokenAndFetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await GetApplicant({id:jobDetail.id });
      const data = JSON.parse(response.data)
      
      setApplicants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
      setLoading(false);
    }
  };
  
  const renderApplicantItem = (item, index) => {
    // Fungsi untuk mendapatkan warna berdasarkan status
    const getStatusColor = (status) => {
      switch (status) {
        case '1':
          return '#FFFFFF'; // Warna hijau untuk status 1
        case '2':
          return '#FFFF00'; // Warna kuning untuk status 2
        case '3':
          return '#00FF00'; // Warna biru untuk status 3
          case '4':
            return '#FF0000'; // Warna biru untuk status 3
        default:
          return '#FFFFFF'; // Warna putih untuk status lainnya atau tidak valid
      }
    };
    const getStatus = (status) => {
        switch (status) {
          case '1':
            return 'Lamaran Masuk'; // Warna hijau untuk status 1
          case '2':
            return 'Lamaran Diproses'; // Warna kuning untuk status 2
          case '3':
            return 'Proses Interview'; // Warna biru untuk status 3
            case '4':
              return 'Tidak Sesuai'; // Warna biru untuk status 3
          default:
            return 'Belum ada Status'; // Warna putih untuk status lainnya atau tidak valid
        }
      };
    let bg = getStatusColor(item.status_lamaran);
    let status = getStatus(item.status_lamaran);
  console.log(item.status_lamaran)
  console.log(bg)
    return (
      <TouchableOpacity
        key={item.id.toString()}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: bg, // Set warna latar belakang berdasarkan status
        }}
        onPress={() => {
        navigation.navigate('DetailPelamar',({id:item.id_user,id_job:jobDetail.id}))
          console.log(item.id_user);
          // Navigasi ke tampilan pelamar atau lakukan operasi lainnya
        }}
      >
        <View>
          <Text>{`Nomor: ${index + 1}`}</Text>
          <Text>{`Pelamar: ${item.firstname} ${item.lastname}`}</Text>
          <Text>{`Tanggal: ${item.created_at}`}</Text>
          <Text>{`Status: ${status}`}</Text>
          {/* Tampilkan informasi pelamar lainnya sesuai kebutuhan */}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View className="flex-1 bg-white color-black" style={{ backgroundColor: themeColors.bg }}>
      <Header judul={title} />
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <>
          <ScrollView>
            {/* Tampilkan informasi pekerjaan */}
            <Text className="text-2xl font-bold mb-2 text-black">{jobDetail.job}</Text>
            <Text className="text-lg mb-2 text-black">Waktu ditayangkan: {jobDetail.start}</Text>
            <Text className="text-lg mb-2 text-black">Minimum Qualification: {jobDetail.minimum_qualification}</Text>
            <Text className="text-lg mb-2 text-black">Alamat: {jobDetail.address}</Text>
            <Text className="text-lg mb-2 text-black">Benefits: {jobDetail.benefits}</Text>
            <Text className="text-lg mb-2 text-black">Fasilitas: {jobDetail.facility}</Text>
            <Text className="text-lg mb-2 text-black">{jobDetail.job_desc}</Text>
          </ScrollView>
          
          {/* Tampilkan daftar pelamar */}
          <Text className="text-2xl font-bold mb-2 items-center justify-center ">Pelamar:</Text>
          <ScrollView>
          <View className="flex-1 bg-white" >
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              applicants.map(renderApplicantItem)
            )}
          </View>
          </ScrollView>
        </>
      </View>
    </View>
  );
}
