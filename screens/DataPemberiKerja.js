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
import * as Icons from 'react-native-heroicons/solid';
import { GetCompanyData, deleteJob, getCities, getJob, getProvinces, postJob } from '../src/api/CompanyApi';
import { themeColors } from '../theme';
import Header from './header';
// Import statements...

export default function DataPemberiKerja({ route }) {
  const [selectedTab, setSelectedTab] = useState('cv');
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = route.params;
  const [Usertoken, setUserToken] = useState(null);
  const title = 'Company';
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  // const [start, start] = useState(null);
  const [establishmentDate, setEstablishmentDate] = useState('Establishment Date');
  const [pdf, setPdf] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  
  const [modalVisibleApplicants, setModalVisibleApplicants] = useState(false);
  const [modalVisibleJob, setModalVisibleJob] = useState(false);
  const [applicantList, setApplicantList] = useState([]);
  const [applicantListLoading, setApplicantListLoading] = useState(true);
  
  //job add
  const [catId, setCatId] = useState('');
  const [subcatId, setSubcatId] = useState('');
  const [provId, setProvId] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [job, setJob] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [benefits, setBenefits] = useState('');
  const [minQualification, setMinQualification] = useState('');
  const [facility, setFacility] = useState('');
  const [openFor, setOpenFor] = useState('');
  const [salaryStart, setSalaryStart] = useState('');
  const [salaryEnd, setSalaryEnd] = useState('');
  const [status, setStatus] = useState('');
  const [start, setStart] = useState(null);
  const [due, setDue] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  


  const handleSubmit = () => {

    try {
      postJob({
        token: Usertoken,
        company_id:id,
        prov_id:selectedProvince,
        city_id:selectedCity,
        address:address,
        postal_code:postalCode,
        job:job,
        job_desc:jobDesc,
        benefits:benefits,
        minimum_qualification:minQualification,
        facility:facility,
        open_for:openFor,
        salary_start:salaryStart,
        salary_end:salaryEnd,
        status:1,
        start:new Date(),
        due:new Date(due).toISOString().split('T')[0],
      }).then(result => {
      console.log(result.success)
        if (result.success) {
        Alert.alert('Success', "Berhasil ditambahkan");
        }else{
        Alert.alert('Gagal', "Gagal ditambahkan");
        
        }
        // const responseObject = JSON.parse(result);
      });
    } catch (error) {
      Alert.alert('Failed', error.response);
    }
  };
  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      setUserToken(token);
    });
    const fetchProvinces = async () => {
      // Replace with your API endpoint
      const response = await getProvinces();
      
      const data = JSON.parse(response.data)
      
    
      
      setProvinces(data);
    
    };
    
    fetchProvinces();
  }, []);
  useEffect(() => {
    // Fetch data from AsyncStorage when the component mounts
    const fetchData = async () => {
      try {
        // Fetch company data
        // const companyData = await GetCompanyData({ id: id, token: Usertoken });
        // if (companyData.success === true) {
        // }
  
        // Fetch job data
        setApplicantListLoading(true);
        const applicants = await getJob({ id: id, token: Usertoken });
        if (applicants.success && applicants.data != null) {
          setApplicantList(JSON.parse(applicants.data));
        }
        console.log(applicants.data);

      } catch (e) {
        console.log('Error fetching data applicant');
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
  }, [id, Usertoken]);
  const fetchCities = async (provinceId) => {
    // Fetch cities based on the selected province
    // Replace the following with your actual API call to fetch cities based on provinceId
    // Example API response: [{ id: '1', name: 'City 1' }, { id: '2', name: 'City 2' }]
    const response = await getCities(provinceId);
    const data = JSON.parse(response.data)
    
    setCities(data);
  };
  
  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    fetchCities(provinceId);
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
  
  const saveApplicant = async () => {
    try {
      // Save applicant data here...
      
      setApplicantListLoading(true);
      
      const applicants = await getJob({id:id,token:Usertoken}); // Replace with the appropriate function
      if (applicants.success) {
        setApplicantList(JSON.parse(applicants.data));
      }
      setApplicantListLoading(false);
    } catch (error) {
      Alert.alert('Failed', error.response.data.message);
    }
    closeModalApplicants();
  };
  
  const openModalJob = () => {
    setModalVisibleJob(true);
  };
  
  const closeModalJob = () => {
    setModalVisibleJob(false);
  };
  const openModalApplicants = () => {
    setModalVisibleApplicants(true);
  };
  
  const closeModalApplicants = () => {
    setModalVisibleApplicants(false);
  };
  const handleTapToView = (applicant) => {
    // Handle tap-to-view functionality
    navigation.navigate('JobDetailCompany', { data: applicant })
  };
  
  // Other functions...
  
  const renderContent = () => {
    switch (selectedTab) {
      case 'jobListing':
        return (
          <View>
                <View style={{padding: 16}}>
                  <View>
                  <Text  className = "color-black">Provinsi</Text>
                    <Picker
                      itemStyle={{ fontFamily:"Ebrima", fontSize:17 }}
                      selectedValue={selectedProvince}
                      onValueChange={(itemValue) => handleProvinceChange(itemValue)}
                       style={{ height: 150 }}
                      >
                      <Picker.Item label="Select Provinsi" value=""  />
                      {provinces.map((province) => (
                        <Picker.Item key={province.prov_id} label={province.prov_name} value={province.prov_id} />
                      ))}
                    </Picker>
                    <Text className = "color-black">Kota</Text>
                    <Picker
                      itemStyle={{  fontFamily:"Ebrima", fontSize:17 }}
                      selectedValue={selectedCity}
                      onValueChange={(itemValue) => setSelectedCity(itemValue)}
                      // style={{ height: 100, width: 200 }}
                      >
                      <Picker.Item label="Select Kota" value="" />
                      {cities.map((city) => (
                        <Picker.Item key={city.city_id} label={city.city_name} value={city.city_id} />
                      ))}
                    </Picker>
                    </View>

                  <Text className = "color-black">Alamat</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Alamat" value={address} onChangeText={setAddress} />
                  <Text className = "color-black">Kode Pos</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Kode Pos" value={postalCode} onChangeText={setPostalCode} />
                  <Text className = "color-black">Lowongan</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Lowongan" value={job} onChangeText={setJob} />
                  <Text className = "color-black">Deskripsi Pekerjaan</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"  value={jobDesc} multiline numberOfLines={7} onChangeText={setJobDesc} />
                  <Text className = "color-black">Benefit</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Benefit" value={benefits} onChangeText={setBenefits} />
                  <Text className = "color-black">Minimum Kualifikasi</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="SMA/D3/S1" value={minQualification} onChangeText={setMinQualification} />
                  <Text className = "color-black">Fasilitas</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Fasilitas" value={facility} onChangeText={setFacility} />
                  <Text className = "color-black">Banyak Posisi</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" keyboardType="numeric" placeholder="1/2/3/../100" value={openFor} onChangeText={setOpenFor} />
                  <Text className = "color-black">Salary Start</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" keyboardType="numeric" value={salaryStart} onChangeText={setSalaryStart} />
                  <Text className = "color-black">Salary End</Text>
                  <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" keyboardType="numeric"  value={salaryEnd} onChangeText={setSalaryEnd} />
                
                  <Text>Tanggal Akhir Pendaftaran</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={due ? due.toDateString() : date.toDateString()}
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
                  date={due || date}
                  onConfirm={selectedDate => {
                    setOpen(false);
                    setDue(selectedDate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </TouchableOpacity>
            </View>
                  <Button  title="Submit" onPress={handleSubmit} />
                </View>
            
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleJob}
              onRequestClose={closeModalJob}>
              <View
                style={{
                  flex: 1
                }}>
                <View
                  >
                
                </View>
              </View>
            </Modal>
          </View>
        );
      
      // case 'companyData':
      //   return (
      //     <View>
      //           <View style={{padding: 16}}>
                  
      //             <Text>Nama Perusahaan</Text>
      //             <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Nama Perusahaan" value={CompNamaPerusahaan} onChangeText={setCompNamaPerusahaan} />
      //             <Text>Provinsi</Text>
      //               <Picker
      //                 selectedValue={selectedProvince}
      //                 onValueChange={(itemValue) => handleProvinceChange(itemValue)}
      //                 style={{ height: 50, width: 200 }}>
      //                 <Picker.Item label="Select Provinsi" value="" />
      //                 {provinces.map((province) => (
      //                   <Picker.Item key={province.prov_id} label={province.prov_name} value={province.prov_id} />
      //                 ))}
      //               </Picker>
      //               <Text>Kota</Text>
      //               <Picker
      //                 selectedValue={selectedCity}
      //                 onValueChange={(itemValue) => setSelectedCity(itemValue)}
      //                 style={{ height: 50, width: 200 }}>
      //                 <Picker.Item label="Select Kota" value="" />
      //                 {cities.map((city) => (
      //                   <Picker.Item key={city.city_id} label={city.city_name} value={city.city_id} />
      //                 ))}
      //               </Picker>
      //               <Text>Kota</Text>
      //               <Picker
      //                 selectedValue={selectedCity}
      //                 onValueChange={(itemValue) => setSelectedCity(itemValue)}
      //                 style={{ height: 50, width: 200 }}>
      //                 <Picker.Item label="Select Kota" value="" />
      //                 {cities.map((city) => (
      //                   <Picker.Item key={city.city_id} label={city.city_name} value={city.city_id} />
      //                 ))}
      //               </Picker>
      //               <Text>Desa</Text>
      //               <Picker
      //                 selectedValue={selectedCity}
      //                 onValueChange={(itemValue) => setSelectedCity(itemValue)}
      //                 style={{ height: 50, width: 200 }}>
      //                 <Picker.Item label="Select Kota" value="" />
      //                 {cities.map((city) => (
      //                   <Picker.Item key={city.city_id} label={city.city_name} value={city.city_id} />
      //                 ))}
      //               </Picker>
      //             <Text>Alamat Jalan</Text>
      //             <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Alamat" value={address} onChangeText={setAddress} />
      //       </View>
      //             <Button  title="Submit" onPress={SubmitCompany} />
      //           </View>
            

      //     </View>
      //   );
      case 'applicants':
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
                      <Text  style={{ color: 'black' }}>No: {index + 1}</Text>
                      <Text  style={{ color: 'black' }}>Job: {item.job}</Text>
                      <Text  style={{ color: 'black' }}>Tanggal: {item.start}</Text>
                      <Text  style={{ color: 'black' }}>Selesai: {item.due}</Text>
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
      default:
        return null;
    }
  };

  // Other functions...

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <Header title={title} />
      <View
        className="flex-1 bg-white px-5 pt-5"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, flex: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setSelectedTab('jobListing')}
            style={{ flex: 1, alignItems: 'center' }}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'jobListing' ? 'text-blue-500' : 'text-gray-700'
              }`}>
              Job Listing
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => setSelectedTab('companyData')}
            style={{ flex: 1, alignItems: 'center' }}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'companyData'
                  ? 'text-blue-500'
                  : 'text-gray-700'
              }`}>
              Company
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => setSelectedTab('applicants')}
            style={{ flex: 1, alignItems: 'center' }}>
            <Text
              className={`text-xl font-bold mb-2 ${
                selectedTab === 'applicants' ? 'text-blue-500' : 'text-gray-700'
              }`}>
              Applicants
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic content */}
        <ScrollView style={{ flex: 1 }}>{renderContent()}</ScrollView>
      </View>
    </View>
  );
}
