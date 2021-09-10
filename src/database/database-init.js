import { DatabaseConnection } from './database-connection'

var db = null
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }
    InitDb() {
        var sql = [          

            `            
            CREATE TABLE IF NOT EXISTS "PRODUTOS" (
                "id"	INTEGER,
                "descricao"	TEXT NOT NULL UNIQUE,
                "urlImagem"	TEXT NOT NULL,
                "unidade"	TEXT NOT NULL,
                "valor"	NUMERIC NOT NULL,
                PRIMARY KEY("id")
            )            
            `,

            `
            INSERT INTO "main"."PRODUTOS"
                ("descricao", "urlImagem", "unidade", "valor")
                VALUES ('Maçã', 'https://www.paulistaflores.com.br/image/cache/data/produtos/monte-sua-cesta/frutas/maca01---maca/maca-gala-1-926x926.jpg', 'KG', '4.50');
            `,
            `
            INSERT INTO "main"."PRODUTOS"
                ("descricao", "urlImagem", "unidade", "valor")
                VALUES ('Pêra', 'https://hiperideal.vteximg.com.br/arquivos/ids/167745-1000-1000/80764.jpg?v=636615816415070000', 'KG', '6.50');
            `,
            `
            INSERT INTO "main"."PRODUTOS"
                ("descricao", "urlImagem", "unidade", "valor")
                VALUES ('Banana', 'https://hiperideal.vteximg.com.br/arquivos/ids/171306-1000-1000/12696.jpg?v=636626179776100000', 'KG', '4.50');
            `,
            `
            INSERT INTO "main"."PRODUTOS"
                ("descricao", "urlImagem", "unidade", "valor")
                VALUES ('Abacaxi ', 'https://s.cornershopapp.com/product-images/1607027.jpg?versionId=iXmW.Uukv1i4KvFcmWh4GZVLR_ngtFSf', 'KG', '10.00');
            `,
            `
            INSERT INTO "main"."PRODUTOS"
                ("descricao", "urlImagem", "unidade", "valor")
                VALUES ('Manga ', 'https://www.orquidario4e.com.br/Content/images/product/fruta00082_1_m_z_00.jpg', 'KG', '4.50');
            `,

            `CREATE TABLE "USUARIOS" (
                "user"	TEXT UNIQUE,
                "password"	TEXT UNIQUE
            )`,


            `
            INSERT INTO USUARIOS ("user", "password") VALUES ('admin', '1234')
            `,

        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}