import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function CardProduto(props) {
    return (

        <View style={styles.Container} >

            <View style={styles.Imagem}>
                <Image
                    style={styles.ImgProduto}
                    source={{
                        uri: props.UrlImagem,
                    }}
                />
            </View>
            <View style={styles.Conteudo}>
                <Text style={styles.TextDescricao}>
                    {props.Descricao}
                </Text>

                <Text style={styles.TextValor}>
                    R$ {props.Valor}
                </Text>
                <Text style={styles.TextValor}>
                    1 {props.Unidade}
                </Text>

            </View>
            <View style={styles.AddCart}>
                <IconButton
                    icon="plus-circle"
                    color="#2A9300"
                    size={30}
                    onPress={() => props.OpenModalBuy(props.Id)}
                />
            </View>
        </View >





    );
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 350,
        borderRadius: 2,
        marginTop: 20,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    Conteudo: {
        marginLeft: 5,
        flex: 1,
        

    }
    ,
    Imagem: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    ImgProduto: {
        width: 50,
        height: 50,
    },
    TextDescricao: {
        fontSize: 14,
        padding: 2,
        color: '#000',
    },
    TextValor: {
        fontSize: 12,
        padding: 2,
        color: '#D94C58',
    },
    AddCart: {
        alignSelf: 'center'
    }
});
