import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function ViewPdf({ route }) {
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
                style={styles.pdf} />
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
    }
});
