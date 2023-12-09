import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CameraIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getJob } from '../src/api/CompanyApi';
import { Dilamar } from '../src/api/JobApi';
import { themeColors } from '../theme';
import Header from './header';
export default function ProfileScreen() {
  const navigation = useNavigation();
  const [Usertoken, setUserToken] = useState(null);
  const [UserData, setUserData] = useState();
  const [profileImage, setProfileImage] = useState(require('../assets/images/profile-default.png'));
  const [viewLoaded, setViewLoaded] = useState(false); // Tambahkan state viewLoaded
  const [jobApplications, setJobApplications] = useState([]); // Tambahkan state viewLoaded
  const title = "Profile";
    
  const [modalVisibleApplicants, setModalVisibleApplicants] = useState(false);
  
  
  const [applicantList, setApplicantList] = useState([]);
  const [applicantListLoading, setApplicantListLoading] = useState(true);
  const [UserId, setUserId] = useState();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const data = await AsyncStorage.getItem('data');
        setUserToken(token);
        setUserData(data);
        setViewLoaded(true);
        get_id_user = JSON.parse(data).id
        setUserId(get_id_user)
        Dilamar({
          token : token,
          id_user :get_id_user,
        }).then((result) => {
          if(result.data){
            setJobApplications(JSON.parse(result.data));
          }
          
        
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array means this effect runs once after the component mounts
  useEffect(() => {
    // Fetch data from AsyncStorage when the component mounts
    const fetchData = async () => {
      try {

        
        // Fetch job data
        setApplicantListLoading(true);
        const applicants = await getJob({ id:  UserId, token: Usertoken });
        if (applicants.success && applicants.data != null) {
          setApplicantList(JSON.parse(applicants.data));
        }
      } catch (e) {
        // console.error('Error fetching data:', error);
      } finally {
        // Update state to stop loading
        setApplicantListLoading(false);
      }
    };
  
    // Call the fetchData function
    fetchData();
  
    // Use the cleanup function to handle any cleanup logic if needed
    return () => {
      // Cleanup logic here...
    };
  }, [ UserId, Usertoken]);
  const handleSelectImage = () => {
    // Implement logic to select or capture a new profile image
  };
  const toCV = () => {
    navigation.navigate('CV', { id:  JSON.parse(UserData).id })
    // Implement logic to select or capture a new profile image
  };
  const toCompanyProfile = ()=>{
    navigation.navigate('CompanyProfile', { id:  JSON.parse(UserData).id })
  }



  const ButtonProfile = ()=>{
    if (!viewLoaded) {
      return null; // Jika data belum dimuat, kembalikan null untuk mencegah render
    }
    const level = UserData ? JSON.parse(UserData).level : 1;
    if (level == 2 || level == "2") {
      return (
        <TouchableOpacity 
        className="py-1 bg-yellow-100 rounded-xl" onPress={()=> toCompanyProfile()}>
          <Text 
              className="text-xl font-bold text-center text-gray-700"
          >
                  Company Profile
          </Text>
       </TouchableOpacity>
      )
    }else{
      return (
        <TouchableOpacity 
        className="py-1 bg-yellow-100 rounded-xl" onPress={()=> toCV()}>
          <Text 
              className="text-xl font-bold text-center text-gray-700"
          >
                  CV
          </Text>
       </TouchableOpacity>
      )
    }
    
  }
  // const openModalApplicants = () => {
  //   setModalVisibleApplicants(true);
  // };
  
  const closeModalApplicants = () => {
    setModalVisibleApplicants(false);
  };
  const handleDeleteApplicant = (jobId) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah anda yakin untuk menghapus lowongan ini?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => deleteApplicantData(jobId),
        },
      ]
    );
  };
  
  const deleteApplicantData = async (jobId) => {
    try {
      // Delete applicant data here...
      await deleteJob({id:jobId})
      setApplicantListLoading(true);
      
      // Fetch applicant data again
      const applicants = await getJob({id:id,token:Usertoken}); // Replace with the appropriate function
      if (applicants.success) {
        setApplicantList(JSON.parse(applicants.data));
      }
      
      // Update state to stop loading
      setApplicantListLoading(false);
      
      Alert.alert('Success', 'Berhasil dihapus');
    } catch (error) {
      Alert.alert('Failed', 'Gagal hapus data');
    }
  };
  const ViewPage = () => {
    if (!viewLoaded) {
      return null; // Jika data belum dimuat, kembalikan null untuk mencegah render
    }
    const handleTapToView = (applicant) => {
      // Handle tap-to-view functionality
      navigation.navigate('JobDetailCompany', { data: applicant })
    };
  
    
    const level = UserData ? JSON.parse(UserData).level : 1;
    
    if (level == 2 || level == "2") {
      return (
        <View>
            <ScrollView>
              <Text>Applicant Data:</Text>
              {applicantListLoading ? (
                <Text>Loading applicant data...</Text>
              ) : (
                applicantList && applicantList.length > 0 ? (
                  applicantList.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleTapToView(item)}
                      onLongPress={() => handleDeleteApplicant(item.id)}
                      style={{
                        marginVertical: 10,
                        borderWidth: 1,
                        padding: 10,
                      }}>
                      <Text>No: {index + 1}</Text>
                      <Text>Job: {item.job}</Text>
                      <Text>Tanggal: {item.start}</Text>
                      <Text>Selesai: {item.due}</Text>
                      {/* Other applicant details... */}
                      <Text style={{ color: 'green' }}>Tap to View</Text>
                      <Text style={{ color: 'red' }}>Long Tap to delete</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No applicant data available.</Text>
                )
              )}
            </ScrollView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleApplicants}
              onRequestClose={closeModalApplicants}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    elevation: 5,
                  }}>
                  {/* Applicant modal content */}
                </View>
              </View>
            </Modal>
          </View>
      );
    } else {
      return (
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: "#000" }}>
            Riwayat Lamaran Kerja
          </Text>
          <ScrollView>
          {jobApplications && Array.isArray(jobApplications) && jobApplications.map(application => (
  <TouchableOpacity
    key={application.id} // Add a unique key prop here
    onPress={() => navigation.navigate('JobDetail', { id: application.id_job })} // Navigate to JobDetail with id as parameter
  >
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#000" }}>
        Lowongan: {application.job}
      </Text>
      <Text style={{ fontSize: 16, color: "#000" }}>
        Tanggal: {application.created_at}
      </Text>
    </View>
  </TouchableOpacity>
))}
          
          </ScrollView>
        </View>
      );
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <Header judul={title} />
      <View style={{ flex: 0.5, paddingHorizontal: 20, paddingTop: 8, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity onPress={handleSelectImage}>
              <Image
                source={profileImage}
                style={{ width: 150, height: 150, borderRadius: 75 }}
              />
              <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: themeColors.primary, padding: 10, borderRadius: 999 }}>
                <CameraIcon size={30} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.palegreen }}>{UserData ? JSON.parse(UserData).firstname+" "+JSON.parse(UserData).lastname : ''}</Text>
            <Text style={{ fontSize: 16, color: themeColors.palegreen }}>{UserData ? JSON.parse(UserData).email : ''}</Text>
          </View>
          <View>
            <ButtonProfile/>

             
          </View>
        </SafeAreaView>
      </View>
      <View style={{ backgroundColor: themeColors.palegreen, flex: 0.5 }}>
        <View style={{ flex: 1, padding: 20 }}>
          <ViewPage />
        </View>
      </View>
    </View>
  );
}


