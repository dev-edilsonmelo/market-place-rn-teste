import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { DatabaseConnection } from "../database/database-connection";
const db = DatabaseConnection.getConnection()
export default function Login({ navigation }) {
    const [usuario, onChangeUsuario] = React.useState("");
    const [senha, onChangeSenha] = React.useState("");

    async function onLogin() {
        var result
        db.transaction(tx => {
            tx.executeSql(
                `SELECT count(user) as COUNT FROM USUARIOS where user='${usuario}' and password='${senha}'`
                , [], (_, { rows }) =>
                result = JSON.stringify(rows._array[0].COUNT)
            )
        }, (error) => {
            console.log(error)
        }, (success) => {
            if (result != '1') {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Erro',
                    text2: 'Usuário ou Senha incorretos',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40,
                });
            }
            else {
                navigation.navigate('Home',
                    {
                        user: usuario,
                    })
            }
        })
    }



    return (
        <View style={styles.Containter}>
            <Image
                style={styles.Logo}
                source={require('../../assets/logo.jpg')}
            />
            <Toast style={styles.Toast} ref={(ref) => Toast.setRef(ref)} />
            <Text style={styles.TextTitle}>MINHA FRUTARIA</Text>
            <TextInput
                label="Usuário"
                style={styles.Input}
                onChangeText={onChangeUsuario}
                value={usuario}
                mode='flat'
                right={<TextInput.Icon name="account" />}
            />
            <TextInput
                label="Senha"
                style={styles.Input}
                onChangeText={onChangeSenha}
                value={senha}
                secureTextEntry={true}
                mode='flat'
                right={<TextInput.Icon name="lock" />}
            />
            <View style={styles.ContainerBotoes}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={onLogin}
                >
                    <Text style={styles.TextButton}>ENTRAR</Text>
                </TouchableOpacity>
            </View>


        </View >
    );
}

const styles = StyleSheet.create({
    Containter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    Toast: {
        position: 'absolute',
    },
    ContainerBotoes: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        marginTop: 20,
    },
    Logo: {
        width: 200,
        height: 200,
    },
    Input: {
        width: 300,
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#FFF'
    },
    Button: {
        margin: 5,
        alignItems: "center",
        backgroundColor: "#EE7924",
        padding: 10,
        width: 190,
        height: 50,
        justifyContent: 'center',

    },
    TextButton: {
        fontSize: 16,
        color: '#FFFF',
        fontWeight: 'bold'
    },
    TextTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#323233',
    },
});
