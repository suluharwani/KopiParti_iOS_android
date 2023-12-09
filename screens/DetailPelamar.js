import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';
import { GetApplicantDet, updateStatus } from '../src/api/CompanyApi';
import { themeColors } from '../theme';
import Header from './header';

export default function DetailPelamar({ route }) {
  const title = `Detail Pelamar`;
  const applicantId = route.params.id;
  const JobId = route.params.id_job;
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleStatusChange = () => {
    setIsModalVisible(true);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const selectStatus = async (newStatus) => {
    try {
      data = await updateStatus({ id_user: applicantId ,id_job:JobId, status_lamaran:newStatus});
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
      setLoading(false);
    }

    
    closeModal();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await GetApplicantDet({ id: applicantId });
      const data = JSON.parse(response.data)[0];
      
      setApplicant(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '1':
        return '#FFFFFF'; // Warna hijau untuk status 1
      case '2':
        return '#FFFF00'; // Warna kuning untuk status 2
      case '3':
        return '#00FF00'; // Warna biru untuk status 3
      case '4':
        return '#FF0000'; // Warna merah untuk status 4
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
        return 'Tidak Sesuai'; // Warna merah untuk status 4
      default:
        return 'Belum ada Status'; // Warna putih untuk status lainnya atau tidak valid
    }
  };

  const ViewPdf = () => {
    const apiurl = config.API_URL;
    const pdfUri = `${apiurl}/users/file/${applicantId}`;
    setPdf(pdfUri);

    navigation.navigate('ViewPdf', { pdfUri: pdfUri });
  };
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
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <Header judul={title} />
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, borderWidth: 1, borderColor: '#000' }}>
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <View style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Text>{`Nama Pelamar: ${applicant.firstname} ${applicant.lastname}`}</Text>
              </View>

              <View style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Text>{`Email: ${applicant.email}`}</Text>
              </View>
              <View style={{ borderWidth: 1, borderColor: '#000', backgroundColor: `${getStatusColor(applicant.status_lamaran)}`, padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Text>{`Status: ${getStatus(applicant.status_lamaran)}`}</Text>
              </View>
              <View style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Text>{`Alamat: ${applicant.alamat}`}</Text>
              </View>
              <View style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Text>{`Telepon: ${applicant.telepon}`}</Text>
              </View>
              <TouchableOpacity
                onPress={ViewPdf}
                className="bg-yellow-500 py-2 px-2 my-2 rounded-md  ">
                <Text className="text-white">View CV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleStatusChange}
                style={{
                  height: 50,
                  width: '100%',
                  backgroundColor: '#FFD700',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#333333',
                  }}
                >
                  Ubah Status
                </Text>
              </TouchableOpacity>

                       {/* Modal */}
          {isModalVisible && (
            <View style={styles.centeredView}>
            <Modal animationType="slide" isVisible={true}  onBackdropPress={closeModal}>
              <View style={{ }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
                  <Text>Pilih Status :</Text>
   
                  <TouchableOpacity 
                  style={{
                  height: 50,
                  width: '100%',
                  backgroundColor:`${getStatusColor('2')}`,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}
                 onPress={() => selectStatus('2')}>
                    <Text>Lamaran Diproses</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                  style={{
                  height: 50,
                  width: '100%',
                  backgroundColor:`${getStatusColor('3')}`,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}
                 onPress={() => selectStatus('3')}>
                    <Text>Proses Interview</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                  style={{
                  height: 50,
                  width: '100%',
                  backgroundColor:`${getStatusColor('4')}`,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}
                 onPress={() => selectStatus('4')}>
                    <Text>Tidak Sesuai</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                  style={{
                  height: 50,
                  width: '100%',
                  backgroundColor:getStatusColor(1),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}
                 onPress={closeModal}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            </View>
          )}
            </>
          )}
        </>
      </View>
    </View>
    
  );
}
