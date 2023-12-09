import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';

export default function ViewPdf({ route }) {
    const navigation = useNavigation();
    const { pdfUri } = route.params;
    const [fileExists, setFileExists] = useState(true);

    useEffect(() => {
        // Check if the PDF file exists
        const checkFileExists = async () => {
            try {
                const response = await fetch(pdfUri);
                if (!response.ok) {
                    setFileExists(false);
                }
            } catch (error) {
                setFileExists(false);
            }
        };

        checkFileExists();
    }, [pdfUri]);

    const handleBack = () => {
        navigation.goBack(); // Kembali ke layar sebelumnya
    };

    if (!fileExists) {
        return (
            <View style={styles.container}>
                <Text>File PDF tidak ditemukan</Text>
            </View>
        );
    }

    const source = { uri: pdfUri, cache: false };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Pdf
                trustAllCerts={false}
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    backText: {
        color: 'white',
        fontSize: 16,
    },
});
