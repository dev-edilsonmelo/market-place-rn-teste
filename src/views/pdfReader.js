import React from 'react';
import { StyleSheet, View } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import { Constants } from 'expo';

export default function pdfReader({ route, navigation }) {
    const { url } = route.params;
    return (
        <View style={styles.container}>
            <PDFReader
                source={{ uri: url }}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
});