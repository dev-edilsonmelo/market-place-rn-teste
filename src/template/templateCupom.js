const htmlComprovante = `  <!DOCTYPE html>
                            <html>

                            <head>
                                <title>Comprovante Minha Frutaria</title>
                            </head>

                            <body>

                                <h3>Comprovante de Pagamento</h3>
                                #PRODUTOS
                                <h4>Total: R$#VALORTOTAL</h4>
                            </body>

                            </html>

`
module.exports = {
    htmlComprovante,
};