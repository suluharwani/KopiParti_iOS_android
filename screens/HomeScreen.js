import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GetJobPage } from '../src/api/JobApi';
import { themeColors } from '../theme';
import Header from './header';

const HomeScreen = () => {
  const [Usertoken, setUserToken] = useState(null);
  const title = "Cari kerja";
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [nomorPage, setPage] = useState(1);
  const [batasPage, setBatasPage] = useState(1);
  const [jobPostings, setJobPostings] = useState([]);
  const [searchTextBuffer, setSearchTextBuffer] = useState('');

  const navigation = useNavigation();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const tambahData = async () => {
    try {
      let params = { page: nomorPage };

      if (searchText) {
        params.s = searchText;
      }

      const result = await GetJobPage(params);
      console.log(result.data)

      console.log("panjang="+result.data.length)
      console.log(result.pagination)
      console.log(searchText)
      console.log("total="+result.pagination.totalElements)
      if (result && result.pagination && result.pagination.totalElements > 0) {
        if (parseInt(result.pagination.totalElements) - nomorPage * 7 > 0 || result.data.length==7 ) {
          setPage(nomorPage + 1);
          setJobPostings((prevPostings) => {
            const newPostings = result.data.filter(
              (newItem) => !prevPostings.some((prevItem) => prevItem.id === newItem.id)
            );
            return [...prevPostings, ...newPostings];
          });
        } else if ((parseInt( result.data.length)<7) )  {
          setJobPostings(result.data);
        }
        else{
          console.log('Data habis');
        }
      } else {
        Alert.alert('Tidak ada data');
      }
    } catch (error) {
      Alert.alert('error');
    }
  };

  const onSearchTextChange = (text) => {
    setSearchTextBuffer(text);
  };

  const resetData = () => {
    setSearchText('');
    setPage(1);
    setJobPostings([]);
    tambahData();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchText(searchTextBuffer);
      setPage(1);
      setJobPostings([]);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTextBuffer]);

  useEffect(() => {
    tambahData();
  }, [searchText]);

  useEffect(() => {
    setJobPostings([]);
    tambahData();
    AsyncStorage.getItem('token').then((token) => {
      setUserToken(token);
    });
  }, []);
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <Header judul={title} />
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <TextInput
              style={{ flex: 1}}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="Cari lowongan..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              onPress={resetData}
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              style={{ marginLeft: 10, justifyContent: 'center' }}
            >
              <Text style={{ color: "#000" }}>Reset</Text>
            </TouchableOpacity>
          </View>
          <FlatList
      data={jobPostings}
      onEndReached={tambahData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('JobDetail', { id: item.id })} // Navigate to JobDetail with id as parameter
        >
          <View style={[styles.card]}> 
                <Text style={styles.cardHeading}> 
                {item.job}
                </Text> 
                <Text style={{ fontSize: 16, color: "#000" }}>
              {item.minimum_qualification}
            </Text>
                <Text style={styles.cardText}> 
               
            <Text numberOfLines={1} style={{ width: 100 }}>
            {item.job_desc }
            </Text>
                </Text> 
            </View> 

        </TouchableOpacity>
      )}
    />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f0f0f0", 
    padding: 20, 
  }, 
  button: { 
    backgroundColor: "#007BFF", 
    padding: 15, 
    borderRadius: 30, // Gabungkan borderRadius
    justifyContent: "center", 
    alignItems: "center", 
    width: "60%", 
    shadowColor: '#171717',
  shadowOffset: { width: -2, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3, // Gabungkan shadow properties
  }, 
  buttonText: { 
    color: "white", 
    fontSize: 18, 
  }, 
  card: { 
    backgroundColor: "#d1ddeb", 
    borderRadius: 10, 
    marginTop: 20, 
    padding: 15, 
    width: "90%", 
    shadowColor: '#171717',
  shadowOffset: { width: -2, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3, // Gabungkan shadow properties
  }, 
  cardHeading: { 
    color: "#000",
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10, 
  }, 
  cardText: { 
    fontSize: 16, 
    color: "#000"
  }, 
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Tambahkan elevation untuk platform Android
  },
});

export default HomeScreen;
