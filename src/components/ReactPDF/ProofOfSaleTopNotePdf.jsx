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

const ProofOfSaleTopNotePdf = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title__container}>
        <Image src={Logo} style={styles.image} />
        <Text style={styles.title__text}>CONSTANCIA DE VENTA</Text>
      </View>
      <View style={styles.row__header__container}>
        <Text style={styles.header__text}>
          CONSTE POR EL PRESENTE DOCUMENTO LA VENTA QUE SE REALIZA SEGÚN LAS
          SIGUIENTES CONDICIONES:
        </Text>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Agencia : </Text>
          <Text style={styles.header__text}>Agenciasadhfsjdfhds</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>NUMERO DOC. : </Text>
          <Text style={styles.header__text}>0000000001</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>FECHA : </Text>
          <Text style={styles.header__text}>18/15/2014</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Cliente : </Text>
          <Text style={styles.header__text}>(id) Jose alberto o coadasj</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>N° DOCUMENTO : </Text>
          <Text style={styles.header__text}>(id) Jose alberto o coadasj</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>DOMICILIO : </Text>
          <Text style={styles.header__text}>(id) Jose alberto o coadasj</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>VENDEDOR : </Text>
          <Text style={styles.header__text}>NOMBRE USUARIO OPERACIÓN</Text>
        </View>
      </View>
      <View style={styles.signatures__container}>
        <View style={styles.signature__container}>
          <Text style={styles.signature__text}>VENDEDOR</Text>
        </View>
        <View style={styles.signature__container}>
          <Text style={styles.signature__text}>CLIENTE</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ProofOfSaleTopNotePdf;
