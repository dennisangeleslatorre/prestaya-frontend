import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Svg,
  Line,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";
import Logo from "../../assets/images/logo_login.png";
import { separator } from "../../utilities/Functions/FormatNumber";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf" },
    {
      fontWeight: "bold",
      src: "http://fonts.gstatic.com/s/roboto/v15/bdHGHleUa-ndQCOrdpfxfw.ttf",
    },
    {
      fontWeight: "semibold",
      src: "http://fonts.gstatic.com/s/roboto/v15/Uxzkqj-MIMWle-XP2pDNAA.ttf",
    },
    {
      fontWeight: "bold",
      fontStyle: "italic",
      src: "http://fonts.gstatic.com/s/roboto/v15/daIfzbEw-lbjMyv4rMUUTqCWcynf_cDxXwCLxiixG1c.ttf",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: "1.5cm",
  },
  image: {
    objectFit: "contain",
    height: "1.0cm",
    marginRight: "1.6cm",
  },
  title__container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  title__text: {
    fontSize: "0.8cm",
    textDecoration: "underline"
  },
  row__header__container: {
    marginTop: "0.5cm",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header__text__bold: {
    fontSize: "0.35cm",
    fontFamily: "Roboto",
    fontWeight: "semibold",
  },
  header__text: {
    fontSize: "0.35cm",
  },
  row__header__container__text: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "0.25cm",
  },
  body__container: {
    width: "100%",
    display: "flex",
  },
  body__section: {
    width: "100%",
    display: "flex",
    marginTop: "0.5cm",
  },
  // Table
  table__container: {
    marginTop: "0.5cm",
    width: "100%",
    display: "flex",
  },
  table__row__container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  table__column__container: {
    width: "1cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__text__header: {
    fontSize: '0.3cm',
    textAlign: 'center',
    fontFamily: "Roboto",
    fontWeight: "semibold",
  },
  //bottom
  signatures__container: {
    position: 'absolute',
    bottom: '2.5cm',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '2cm',
    marginHorizontal: '1.5cm'
  },
  signature__container: {
    display: 'flex',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signature__text: {
    width: '50%',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: '0.35cm',
    borderTopWidth: 1,
    fontFamily: "Roboto",
    fontWeight: "semibold",
  }
});

const ProofOfSaleTopNotePdf = ({ cabecera, detalles }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title__container}>
        <Image src={Logo} style={styles.image} />
        <Text style={styles.title__text}>CONSTANCIA DE VENTA</Text>
      </View>
      <View style={styles.row__header__container}>
        <Text style={[styles.header__text, { marginVertical: '0.25cm' }]}>
          CONSTE POR EL PRESENTE DOCUMENTO LA VENTA QUE SE REALIZA SEGÚN LAS
          SIGUIENTES CONDICIONES:
        </Text>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Agencia                  :  </Text>
          <Text style={styles.header__text}>{cabecera.agencia_desc}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>NUMERO DOC.      :  </Text>
          <Text style={styles.header__text}>{cabecera.c_numerodocumento}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>FECHA                    :  </Text>
          <Text style={styles.header__text}>{cabecera.d_fechadocumento
              ? moment(cabecera.d_fechadocumento).format("DD/MM/yyyy")
              : ""}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Cliente                    :  </Text>
          <Text style={styles.header__text}>({cabecera.n_cliente}) {cabecera.c_nombrescompleto}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>N° DOCUMENTO   :  </Text>
          <Text style={styles.header__text}>{cabecera.cliente_numerodocumento}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>DOMICILIO             :  </Text>
          <Text style={styles.header__text}>{cabecera.cliente_direccion} - {cabecera.cliente_distrito}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>VENDEDOR             :  </Text>
          <Text style={styles.header__text}>{cabecera.usuario_operacion_nombres}</Text>
        </View>
      </View>

      <View style={styles.body__container}>
        <View style={styles.body__section}>
          <View style={styles.table__container}>
            {/*Begin :: Hedaer Table*/}
            <View style={styles.table__row__container}>
              <View style={[styles.table__column__container, {width: '1cm'}]}>
                <Text style={[styles.table__text__header]}>NRO</Text>
              </View>
              <View style={[styles.table__column__container, {width: '4cm'}]}>
                <Text style={styles.table__text__header}>PRODUCTO</Text>
              </View>
              <View style={[styles.table__column__container, {width: '4cm'}]}>
                <Text style={styles.table__text__header}>DESCRICPION</Text>
              </View>
              <View style={[styles.table__column__container, {width: '3.0cm'}]}>
                <Text style={styles.table__text__header}>UND</Text>
              </View>
              <View style={[styles.table__column__container, {width: '1cm'}]}>
                <Text style={styles.table__text__header}>CANT.</Text>
              </View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}>PRECIO</Text>
              </View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}>S/. MONTO T.</Text>
              </View>
            </View>
            {/*End :: Hedaer Table*/}
            {/*Begin :: Body Table*/}
            {detalles.map((detalle, index) => (
              <View style={styles.table__row__container}>
              <View style={[styles.table__column__container, {width: '1cm'}]}>
                <Text style={[styles.table__text__header]}> {index + 1} </Text>
              </View>
              <View style={[styles.table__column__container, {width: '4cm'}]}>
                <Text style={styles.table__text__header}> {detalle.c_item} </Text>
              </View>
              <View style={[styles.table__column__container, {width: '4cm'}]}>
                <Text style={styles.table__text__header}>{detalle.c_descripcionproducto} </Text>
              </View>
              <View style={[styles.table__column__container, {width: '3.0cm'}]}>
                <Text style={styles.table__text__header}> {detalle.c_unidadmedida} </Text>
              </View>
              <View style={[styles.table__column__container, {width: '1cm'}]}>
                <Text style={styles.table__text__header}>{Number(detalle.n_cantidad).toFixed(2)} </Text>
              </View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}>{separator(Number(detalle.n_precio).toFixed(2))}</Text>
              </View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}>{separator(Number(detalle.n_montototal).toFixed(2))}</Text>
              </View>
            </View>
            ))}
            {/*End :: Body Table*/}
            {/*Begin :: Total*/}
            <View style={styles.table__row__container}>
              <View style={[{width: '13cm'}]}></View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}> S/. TOTAL: </Text>
              </View>
              <View style={[styles.table__column__container, {width: '2.5cm'}]}>
                <Text style={styles.table__text__header}>
                  {separator(Number(cabecera.n_montototal).toFixed(2))}
                </Text>
              </View>
            </View>
            {/*Begin :: Total*/}
          </View>
        </View>
      </View>
      {/*Begin :: signature container*/}
      <View style={styles.signatures__container}>
        <View style={styles.signature__container}>
          <Text style={styles.signature__text}>VENDEDOR</Text>
        </View>
        <View style={styles.signature__container}>
          <Text style={styles.signature__text}>CLIENTE</Text>
        </View>
      </View>
      {/*End :: signature container*/}
    </Page>
  </Document>
);

export default ProofOfSaleTopNotePdf;
