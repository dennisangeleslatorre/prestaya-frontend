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
  table__column__container__cnt: {
    width: "1cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__column__container__und: {
    width: "3.5cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__column__container__desc: {
    width: "4cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__column__container__obs: {
    width: "4.5cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__text__header: {
    fontSize: "0.3cm",
    textAlign: "center",
    fontFamily: "Roboto",
    fontWeight: "semibold",
  },
  //bottom
  signatures__container: {
    position: "absolute",
    bottom: "2.5cm",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "2cm",
    marginHorizontal: "1.5cm",
    justifyContent: "flex-end",
  },
  signature__container: {
    display: "flex",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  signature__text: {
    width: "60%",
    paddingTop: 10,
    textAlign: "center",
    fontSize: "0.35cm",
    fontFamily: "Roboto",
    fontWeight: "semibold",
    borderTopWidth: 1,
  },
  signature__document: {
    paddingTop: 10,
    fontSize: "0.35cm",
    fontFamily: "Roboto",
    fontWeight: "semibold",
  },
});

const ProofOfDeliveryOfTopNotePdf = ({ cabecera, detalles }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title__container}>
        <Image src={Logo} style={styles.image} />
        <Text style={styles.title__text}>CONSTANCIA DE ENTREGA</Text>
      </View>
      <View style={styles.row__header__container}>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Agencia : </Text>
          <Text style={styles.header__text}>{cabecera.agencia_desc}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>NUMERO DOC. : </Text>
          <Text style={styles.header__text}>{cabecera.c_numerodocumento}</Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>FECHA : </Text>
          <Text style={styles.header__text}>
            {cabecera.d_fechadocumento
              ? moment(cabecera.d_fechadocumento).format("DD/MM/yyyy")
              : ""}
          </Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>Cliente : </Text>
          <Text style={styles.header__text}>
            ({cabecera.n_cliente}) {cabecera.c_nombrescompleto}
          </Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>N° DOCUMENTO : </Text>
          <Text style={styles.header__text}>
            {cabecera.cliente_numerodocumento}
          </Text>
        </View>
        <View style={styles.row__header__container__text}>
          <Text style={styles.header__text__bold}>DOMICILIO : </Text>
          <Text style={styles.header__text}>
            {cabecera.cliente_direccion} - {cabecera.cliente_distrito}
          </Text>
        </View>
      </View>

      <View style={styles.body__container}>
        <View style={styles.body__section}>
          <View style={styles.table__container}>
            <View style={styles.table__row__container}>
              <View style={styles.table__column__container__cnt}>
                <Text style={styles.table__text__header}>NRO</Text>
              </View>
              <View style={styles.table__column__container__desc}>
                <Text style={styles.table__text__header}>PRODUCTO</Text>
              </View>
              <View style={styles.table__column__container__desc}>
                <Text style={styles.table__text__header}>DESCRICPION</Text>
              </View>
              <View style={styles.table__column__container__und}>
                <Text style={styles.table__text__header}>UND</Text>
              </View>
              <View style={styles.table__column__container__cnt}>
                <Text style={styles.table__text__header}>CANT</Text>
              </View>
              <View style={styles.table__column__container__obs}>
                <Text style={styles.table__text__header}>OBSERVACIONES</Text>
              </View>
            </View>
            {detalles.map((detalle, index) => (
              <View style={styles.table__row__container} key={detalle.n_linea}>
                <View style={styles.table__column__container__cnt}>
                  <Text style={styles.table__text__header}>{index + 1}</Text>
                </View>
                <View style={styles.table__column__container__desc}>
                  <Text style={styles.table__text__header}>
                    {detalle.c_item}
                  </Text>
                </View>
                <View style={styles.table__column__container__desc}>
                  <Text style={styles.table__text__header}>
                    {detalle.c_descripcionproducto}
                  </Text>
                </View>
                <View style={styles.table__column__container__und}>
                  <Text style={styles.table__text__header}>{detalle.c_unidadmedida}</Text>
                </View>
                <View style={styles.table__column__container__cnt}>
                  <Text style={styles.table__text__header}>{Number(detalle.n_cantidad).toFixed(2)}</Text>
                </View>
                <View style={styles.table__column__container__obs}>
                  <Text style={styles.table__text__header}>
                    {detalle.c_observacionesdet}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.body__section}>
          <View style={styles.row__header__container}>
            <Text style={styles.header__text}>
              El cliente que suscribe la presente constancia, declara que ha
              recibido el (los) artículo (s) descrito (s) líneas arriba, en el
              estado de uso en que se encuentran.
            </Text>
          </View>
          <View style={styles.row__header__container}>
            <Text style={styles.header__text}>
              Asimismo, declara haber sido correctamente informado, que de
              tratarse de compra de joya (s) o electrodomestico (s) una vez
              recibido (s) no podrán ser devueltos ni reemplazados por otra (s)
              joya (s) o electrodoméstico (s).
            </Text>
          </View>
          <View style={styles.row__header__container}>
            <Text style={styles.header__text}>
              Y que sólo para la compra de electrodoméstico (s) una vez
              adquiridos no cuenta con accesorios o servicios de reparación o
              mantenimiento.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.signatures__container}>
        <View style={styles.signature__container}>
          <Text style={styles.signature__text}>{cabecera.c_nombrescompleto}</Text>
          <Text style={styles.signature__document}>
            N° DOCUMENTO: {cabecera.cliente_numerodocumento}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ProofOfDeliveryOfTopNotePdf;
