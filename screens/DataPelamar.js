import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
import * as Icons from 'react-native-heroicons/solid';
import config from '../config';
import { UploadCV } from '../src/api/FileApi';
import {
  DeletePendidikan,
  GetDataPelamar,
  GetPendidikan,
  PostDataPelamar,
  PostPendidikan
} from '../src/api/dataPelamarApi';
import { themeColors } from '../theme';
import Header from './header';
export default function DataPelamar({route}) {
  const {id} = route.params;
  const [Usertoken, setUserToken] = useState(null);
  const title = 'Curriculum Vitae';
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [tanggalLahir, setTanggalLahir] = useState('Tanggal Lahir');
  const [pdf, setPdf] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  
  const [modalVisiblePendidikan, setModalVisiblePendidikan] = useState(false);
  const [inputValuePendidikan, setInputValuePendidikan] = useState('');
  
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [educationLevel, setEducationLevel] = useState('SD');
  const [educationData, setEducationData] = useState([]);
  const [educationDataLoading, setEducationDataLoading] = useState(true);

  const handleDeleteEducation = (educationId) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah anda yakin untuk menghapus data ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => deleteEducationData(educationId),
        },
      ]
    );
  };
  const deleteEducationData = async (educationId) => {
    try {
      DeletePendidikan({
        token: Usertoken,
        id:educationId,
      })
      setEducationDataLoading(true);
  
      // Fetch education data again
      const pendidikan = await GetPendidikan(id);
      if (pendidikan.success) {
        setEducationData(JSON.parse(pendidikan.data));
      }
  
      // Update state to stop loading
      setEducationDataLoading(false);
  
      Alert.alert('Success', 'Berhasil dihapus');
    } catch (error) {
      Alert.alert('Failed', 'Gagal menghapus data');
    }
  };
  const saveEducation = async ()=> {
    try {
      PostPendidikan({
        token: Usertoken,
        id_user: id,
        jenjang: educationLevel,
        lembaga: institution,
        tahun_lulus: graduationYear,
      }).then(result => {
        // const responseObject = JSON.parse(result);
        
        Alert.alert('Success', result.message);
      });
      setEducationDataLoading(true);
      
      const pendidikan = await GetPendidikan(id);
      if (pendidikan.success) {
        setEducationData(JSON.parse(pendidikan.data));
      }
      setEducationDataLoading(false);
    } catch (error) {
      Alert.alert('Failed', error.response.data.message);
    }
    closeModalPendidikan();
  };
  
  const openModalPendidikan = () => {
    setModalVisiblePendidikan(true);
  };
  const closeModalPendidikan = () => {
    setModalVisiblePendidikan(false);
  };


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  
  useEffect(() => {
    // Fetch data from AsyncStorage when the component mounts
    const fetchData = async () => {
      try {
        const dataString = await AsyncStorage.getItem('data');
        const data = JSON.parse(dataString);
        
        const dataPelamar = await GetDataPelamar(id);
        const pendidikan = await GetPendidikan(id);
        if (pendidikan.success) {
          setEducationData(JSON.parse(pendidikan.data));
        }
        setEducationDataLoading(false);

        if (dataPelamar.success == true) {
          setAlamat(dataPelamar.data.alamat);
          setNomorTelepon(dataPelamar.data.telepon);
          setTanggalLahir(dataPelamar.data.tanggal_lahir);
          setDateOfBirth(new Date(dataPelamar.data.tanggal_lahir));
        }
        if (data) {
          setNama(data.firstname + ' ' + data.lastname || ''); // Set nama from AsyncStorage, or default to an empty string
          setEmail(data.email || ''); // Set email from AsyncStorage, or default to an empty string
        }
      } catch (error) {
        // console.error('Error fetching data from AsyncStorage:', error);
      }
    };
    
    fetchData();
  }, [id]); // Empty dependency array to run this effect only once
  
  // const handleSimpan = () => {
  // };
  
  AsyncStorage.getItem('token').then(token => {
    setUserToken(token);
  });
  
  const [selectedTab, setSelectedTab] = useState('cv');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleSimpanPelamar = async () => {
    try {
      PostDataPelamar({
        token: Usertoken,
        id_user: id,
        alamat: alamat,
        telepon: nomorTelepon,
        tanggal_lahir: new Date(dateOfBirth).toISOString().split('T')[0],
      }).then(result => {
        // const responseObject = JSON.parse(result);
        Alert.alert('Success', result.message);
      });
    } catch (error) {
      Alert.alert('Failed', error.response.data.message);
    }
  };
  
  const renderContent = () => {
    switch (selectedTab) {
      case 'cv':
        return (
          <View>
            <Text className="text-xl font-bold mb-2">
              Upload Curriculum Vitae
            </Text>
            {/* Tombol untuk memilih file CV */}
            <TouchableOpacity
              onPress={pickCV}
              className="bg-blue-500 py-2 px-4 rounded-md mb-4">
              <Text className="text-white">Pilih CV (Hanya file pdf)</Text>
            </TouchableOpacity>
            {/* Menampilkan nama file yang dipilih */}
            {selectedFile && (
              <Text className="mb-4 color-black">
                File yang dipilih: {selectedFile[0].name}
              </Text>
            )}
            
            {/* Tombol untuk mengunggah file */}
            <TouchableOpacity
              onPress={uploadFile}
              className="bg-green-500 py-2 px-4 rounded-md">
              <Text className="text-white">Upload File</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={ViewPdf}
              className="bg-yellow-500 py-2 px-2 my-2 rounded-md  ">
              <Text className="text-white">View File</Text>
            </TouchableOpacity>
          </View>
        );
      case 'datapelamar':
        return (
          <View style={{padding: 16}}>
            <Text>Data Diri Pelamar Kerja</Text>
            <TextInput
              placeholder="Nama"
              value={nama}
              editable={false}
              onChangeText={setNama}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            />
            <TextInput
              placeholder="Email"
              value={email}
              editable={false}
              onChangeText={setEmail}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            />
            <TextInput
              placeholder="Alamat"
              value={alamat}
              onChangeText={setAlamat}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            />
            <TextInput
              placeholder="Nomor Telepon"
              value={nomorTelepon}
              onChangeText={setNomorTelepon}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            />
            
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={dateOfBirth ? dateOfBirth.toDateString() : tanggalLahir}
                placeholder={tanggalLahir}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                editable={false} // Disable editing
                style={{flex: 1, padding: 8, marginRight: 8}}
              />
              <TouchableOpacity
                onPress={() => setOpen(true)}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                style={{
                  backgroundColor: '#1E40AF',
                  padding: 8,
                  borderRadius: 5,
                }}>
                <Icons.CalendarIcon size={30} color="white" />
                <DatePicker
                  modal
                  title="Pilih Tanggal"
                  confirmText="Pilih"
                  cancelText="Batal"
                  mode="date"
                  open={open}
                  date={dateOfBirth || date}
                  onConfirm={selectedDate => {
                    setOpen(false);
                    setDateOfBirth(selectedDate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </TouchableOpacity>
            </View>
            
            <Button title="Simpan" onPress={handleSimpanPelamar} />
          </View>
        );
      case 'education':
        return (
          <View>
            <Button title="Tambah Pendidikan" onPress={openModalPendidikan} />
            <ScrollView>
            <Text>Data Pendidikan:</Text>
            {educationDataLoading ? (
              <Text>Loading education data...</Text>
            ) : (
              educationData && educationData.length > 0 ? (
                educationData.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleDeleteEducation(item.id)}
                    style={{
                      marginVertical: 10,
                      borderWidth: 1,
                      padding: 10,
                    }}>
                    <Text>Lembaga Pendidikan: {item.lembaga}</Text>
                    <Text>Tahun Lulus: {item.tahun_lulus}</Text>
                    <Text>Tingkatan: {item.jenjang}</Text>
                    <Text style={{ color: 'red' }}>Tap untuk hapus</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No education data available.</Text>
              )
            )}
          </ScrollView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisiblePendidikan}
              onRequestClose={closeModalPendidikan}>
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
                  <Text>Lembaga Pendidikan</Text>
                  <TextInput
                    placeholder="Masukkan Lembaga Pendidikan"
                    value={institution}
                    onChangeText={text => setInstitution(text)}
                  />

                  <Text>Tahun Lulus</Text>
                  <TextInput
                    placeholder="Tahun Lulus"
                    value={graduationYear}
                    onChangeText={text => setGraduationYear(text)}
                    keyboardType="numeric" // Hanya izinkan angka
                  />
                  
                  <Text>Tingkatan</Text>
                  <Picker
                    selectedValue={educationLevel}
                    onValueChange={(itemValue, itemIndex) =>
                      setEducationLevel(itemValue)
                    }>
                    <Picker.Item label="SD" value="SD" />
                    <Picker.Item label="SMP" value="SMP" />
                    <Picker.Item label="SMA" value="SMA" />
                    <Picker.Item label="D3" value="D3" />
                    <Picker.Item label="S1" value="S1" />
                    <Picker.Item label="S2" value="S2" />
                  </Picker>
                  
                  <Button title="Simpan" onPress={saveEducation} />
                </View>
              </View>
            </Modal>
            
            
          </View>
        );
      default:
        return null;
    }
  };
  const ViewPdf = () => {
    const apiurl = config.API_URL;
    pdfUri = `${apiurl}/users/file/${id}`;
    setPdf(pdfUri);
    
    navigation.navigate('ViewPdf', {pdfUri: pdfUri});
  };
  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file_cv', {
        uri: selectedFile[0].uri,
        name: selectedFile[0].name,
        type: selectedFile[0].type,
      });

      const result = await UploadCV({
        formData: formData,
        id: id,
        token: Usertoken,
      });
      Alert.alert(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  const pickCV = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {

        // Pengguna membatalkan pemilihan file
      } else {
        throw err;
      }
    }
  };

  return (
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <Header judul={title} />
      <View
        className="flex-1 bg-white px-5 pt-5"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, flex: 1}}>
        <View style={{flexDirection: 'row', marginBottom: 16}}>
          <TouchableOpacity
            onPress={() => setSelectedTab('cv')}
            style={{flex: 1, alignItems: 'center'}}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'cv' ? 'text-blue-500' : 'text-gray-700'
              }`}>
              CV
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('datapelamar')}
            style={{flex: 1, alignItems: 'center'}}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'datapelamar'
                  ? 'text-blue-500'
                  : 'text-gray-700'
              }`}>
              Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('education')}
            style={{flex: 1, alignItems: 'center'}}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'education' ? 'text-blue-500' : 'text-gray-700'
              }`}>
              Pendidikan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Konten yang dinamis */}
        <ScrollView style={{flex: 1}}>{renderContent()}</ScrollView>
      </View>
    </View>
  );
}
