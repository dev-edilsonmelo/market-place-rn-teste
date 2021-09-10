import React from 'react';
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Searchbar, FAB, Text } from 'react-native-paper';
import CardProduto from '../components/CardProduto';
import { DatabaseConnection } from "../database/database-connection";
import CurrencyInput from 'react-native-currency-input';
import CardProdutoCarrinho from '../components/CardProdutoCarrinho';
import * as Print from 'expo-print';
import { IconButton } from 'react-native-paper';
const { htmlComprovante } = require('../template/templateCupom');

const db = DatabaseConnection.getConnection()


export default function Home({ route, navigation }) {

    const [produtosCarrinho, setProdutosCarrinho] = React.useState([]);
    const [produtos, setProdutos] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalCartVisible, setModalCartVisible] = React.useState(false);
    const [rerender, setRerender] = React.useState(false);
    const [produtoQtd, setProdutoQtd] = React.useState("");
    const [produtoSelecionado, setprodutoSelecionado] = React.useState({});
    let totalCarrinho = 0


    const createPDF = async (html) => {
        try {
            const { uri } = await Print.printToFileAsync({ html });
            setModalVisible(false),
                setModalCartVisible(false),
                setProdutosCarrinho([])
            navigation.navigate('pdfReader',
                {
                    url: uri,
                })
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();
        })

        RefreshDados()

    }, [])

    function RefreshDados() {
        var result
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM PRODUTOS`
                , [], (_, { rows }) =>
                result = rows._array
            )
        }, (error) => {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Erro',
                text2: 'Não foi possível buscar os produtos',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
            });
        }, (success) => {
            setProdutos(result)
        })
    }

    function OpenModalBuy(produtoCod) {
        produtos.map(function (produto) {
            if (produtoCod == produto.id) {
                setprodutoSelecionado(produto)
                setModalVisible(true)
            }
        })
    }

    function OpenModalCart() {
        setModalCartVisible(true)
    }

    function AddProductsCart(produtoCod, produtoQtd) {
        let bProdutoNoCarrinho
        produtosCarrinho.map(function (produto, index) {
            if (produtoCod == produto.id) {
                bProdutoNoCarrinho = index
            }
        })
        if (bProdutoNoCarrinho != undefined) {
            const listPositons = produtosCarrinho
            listPositons.splice(bProdutoNoCarrinho, 1)
            setProdutosCarrinho(listPositons)
        }
        const listPositons = produtosCarrinho
        listPositons.push({ id: produtoCod, quantidade: produtoQtd })
        setProdutosCarrinho(listPositons)
        setModalVisible(false)
        setProdutoQtd(0)
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Muito bem',
            text2: 'Produto adicionado ao carrinho',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
            bottomOffset: 40,
        });
    }

    function RemoveProductsCart(produtoCod) {
        let bProdutoNoCarrinho
        produtosCarrinho.map(function (produto, index) {
            if (produtoCod == produto.id) {
                bProdutoNoCarrinho = index
            }
        })
        if (bProdutoNoCarrinho != undefined) {
            const listPositons = produtosCarrinho
            listPositons.splice(bProdutoNoCarrinho, 1)
            setProdutosCarrinho(listPositons)
        }

        setRerender(!rerender)
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Muito bem',
            text2: 'Produto removido do carrinho',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
            bottomOffset: 40,
        });

    }

    function Checkout() {
        let produtosHtml = ""
        let total = 0
        let novoHtmlComprovante = htmlComprovante
        produtosCarrinho.map(function (produtoCarrinho) {
            let produtoGlobal = {}
            produtos.map(function (produto) {

                if (produtoCarrinho.id == produto.id) {
                    produtoGlobal = produto
                }
            })

            if (produtoGlobal.id != undefined) {
                produtosHtml += `
                    <p>
                        ${produtoGlobal.descricao} ${produtoCarrinho.quantidade}kg R$ ${produtoGlobal.valor}<br>
                        Total R$ ${produtoCarrinho.quantidade * produtoGlobal.valor}<br>
                    </p>
                `
                total += produtoCarrinho.quantidade * produtoGlobal.valor
            }

        })

        novoHtmlComprovante = novoHtmlComprovante.replace('#PRODUTOS', produtosHtml)
        novoHtmlComprovante = novoHtmlComprovante.replace('#VALORTOTAL', total)

        createPDF(novoHtmlComprovante)
    }

    return (
        <View style={styles.Container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalBorder}></View>
                        <IconButton
                            icon="arrow-left-circle"
                            color="#2A9300"
                            size={30}
                            onPress={() => setModalVisible(false)}
                        />
                        <View style={styles.modalContent}>
                            <Text style={styles.textTitleModal}>Adicionar ao Carrinho</Text>
                            <Text style={styles.textTitleModalNormal}>{produtoSelecionado.descricao}</Text>
                            <Text style={styles.textTitleModalNormal}>R$ {produtoSelecionado.valor}</Text>
                            <Text style={styles.textTitleModalNormal}>1 {produtoSelecionado.unidade}</Text>
                            <Text style={styles.CurrencyLabel}>Quantidade</Text>
                            <CurrencyInput
                                style={styles.CurrencyInput}
                                value={produtoQtd}
                                selectionColor="#B88CF7"
                                onChangeValue={setProdutoQtd}
                                unit="$"
                                delimiter=","
                                separator="."
                                precision={2}
                            />
                            <Text style={styles.textTitleModalNormal}>Total: R$ {produtoSelecionado.valor * produtoQtd}</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    AddProductsCart(produtoSelecionado.id, produtoQtd)
                                }}
                            >
                                <Text style={styles.textBtn}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCartVisible}
                onRequestClose={() => {
                    setModalCartVisible(!modalCartVisible);
                }}
            >

                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <View style={styles.modalBorder}></View>
                        <IconButton
                            icon="arrow-left-circle"
                            color="#2A9300"
                            size={30}
                            onPress={() => setModalCartVisible(false)}
                        />
                        <View style={styles.modalContent}>
                            <Text style={styles.textTitleModal}>Seu Carrinho de Compras</Text>
                            {
                                produtosCarrinho.map(function (produtoCarrinho) {
                                    let produtoGlobal = {}
                                    produtos.map(function (produto) {

                                        if (produtoCarrinho.id == produto.id) {
                                            produtoGlobal = produto
                                        }
                                    })

                                    if (produtoGlobal.id != undefined) {
                                        totalCarrinho += produtoCarrinho.quantidade * produtoGlobal.valor
                                        return (
                                            <CardProdutoCarrinho
                                                key={produtoGlobal.id}
                                                Id={produtoGlobal.id}
                                                Valor={produtoGlobal.valor}
                                                Descricao={produtoGlobal.descricao}
                                                Unidade={produtoGlobal.unidade}
                                                Quantidade={produtoCarrinho.quantidade}
                                                RemoveProductsCart={RemoveProductsCart}
                                            >
                                            </CardProdutoCarrinho>
                                        )


                                    }

                                })
                            }
                            <Text style={[styles.textTitleModalTotal, produtosCarrinho.length <= 0 ? styles.Hide : '']}>Total R$ {totalCarrinho}</Text>
                            <Text style={[styles.textTitleModalNormal, produtosCarrinho.length > 0 ? styles.Hide : '']}>Carrinho Vazio</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    Checkout()
                                }}
                            >
                                <Text style={styles.textBtn}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </Modal>
            <Searchbar
                placeholder="Filtrar"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <ScrollView>
                <View style={styles.ContainerProdutos}>
                    {
                        produtos.map(function (produto) {
                            if (produto.descricao.toLowerCase().includes(searchQuery.toLowerCase())) {
                                return (
                                    <View key={produto.id} style={styles.Card}>
                                        <CardProduto
                                            Id={produto.id}
                                            Valor={produto.valor}
                                            Descricao={produto.descricao}
                                            Unidade={produto.unidade}
                                            UrlImagem={produto.urlImagem}
                                            OpenModalBuy={OpenModalBuy}
                                        >
                                        </CardProduto>
                                    </View>
                                )
                            }
                        })
                    }


                </View>
            </ScrollView>

            <FAB
                style={styles.FAB}
                icon="cart"
                onPress={() => {
                    OpenModalCart()
                }}
            />
            <Toast style={styles.Toast} ref={(ref) => Toast.setRef(ref)} />
        </View>

    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
    },
    Hide: {
        display: 'none'
    },
    ContainerProdutos: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#FFF',
        justifyContent: 'space-around',

    },
    Card: {
    },
    textTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 30,
        color: '#000',
    },
    Button: {
        marginTop: 30,
        alignItems: "center",
        alignSelf: 'center',
        backgroundColor: "#D94C58",
        padding: 10,
        width: 300,
    },
    textButton: {
        fontSize: 20,
        padding: 5,
        color: '#FFFF',
    },
    FAB: {
        backgroundColor: '#EE7924',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
    },
    textTitleModal: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    textTitleModalNormal: {
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
    },
    textTitleModalTotal: {
        marginTop: 20,
        fontSize: 16,
        marginBottom: 5,
        color: '#EE7924',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,

    },
    modalContent: {
        padding: 35,
    },
    modalView: {
        width: 360,
        backgroundColor: '#fff',
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalBorder: {
        width: 360,
        height: 5,
        backgroundColor: "#F8A300",

    },
    button: {
        marginTop: 30,
        alignItems: "center",
        alignSelf: 'center',
        backgroundColor: "#EE7924",
        padding: 10,
        width: 300,
    },
    textBtn: {
        fontSize: 20,
        padding: 5,
        color: '#FFFF',
    },
    CurrencyInput: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#D2D2D2',
        paddingLeft: 7,
        fontSize: 16,
    },
    CurrencyLabel: {
        color: '#8B8B8B',
        fontSize: 12,
        marginTop: 20,
    },
});
