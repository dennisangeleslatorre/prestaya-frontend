import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { separator } from "../../utilities/Functions/FormatNumber";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: "1.5cm",
  },
  header__container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  title__company: {
    fontSize: "0.5cm",
    width: "6.5cm",
  },
  title_container: {
    width: "14cm",
    textAlign: "center",
  },
  title__reportname: {
    fontSize: "0.5cm",
    marginBottom: "0.1cm",
  },
  title__reportFilters: {
    fontSize: "0.4cm",
    marginBottom: "0.1cm",
  },
  //tabla
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
  body__container: {
    width: "100%",
    display: "flex",
  },
  body__section: {
    width: "100%",
    display: "flex",
    marginTop: "0.5cm",
  },
  //Header
  table__header__column: {
    width: "1.50cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
    backgroundColor: "gray",
    color: "white",
  },
  table__header__column__cod: {
    width: "1.60cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
    backgroundColor: "gray",
    color: "white",
  },
  table__header__column__short: {
    width: "1.15cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
    backgroundColor: "gray",
    color: "white",
  },
  table__header__column__tiny: {
    width: "1.0cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
    backgroundColor: "gray",
    color: "white",
  },
  //Body
  table__body__column: {
    width: "1.50cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__body__column__cod: {
    width: "1.60cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__body__column__short: {
    width: "1.15cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__body__column__tiny: {
    width: "1.0cm",
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
  },
  table__body__column__without__border: {
    minHeight: '0.7cm',
    display: 'flex',
    justifyContent: 'center',
    margin: '0px'
},
  //Textos
  table__text__header: {
    fontSize: "0.22cm",
    textAlign: "center",
  },
  table__text__body: {
    fontSize: "0.18cm",
    textAlign: "center",
  },
});

const getHeader = () => (
  <View style={styles.table__row__container}>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>Agencia</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>PRODUCTO</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>DESCRIPCION</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>UNIDAD</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>STOCK</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>UBICACION</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>F. INGRESO</Text>
    </View>
    <View style={styles.table__header__column__tiny}>
      <Text style={styles.table__text__header}>C. ING</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>F. SALIDA</Text>
    </View>
    <View style={styles.table__header__column__tiny}>
      <Text style={styles.table__text__header}>C. SAL</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>Antiguedad (dias)</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>PRECIO PROM. S/.</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>TIPO PROD</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>SUBTIPO PROD</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>P. Bruto</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>P. Neto</Text>
    </View>
    <View style={styles.table__header__column__cod}>
      <Text style={styles.table__text__header}># Prestamo</Text>
    </View>
    <View style={styles.table__header__column__cod}>
      <Text style={styles.table__text__header}>ITEM ORIGEN</Text>
    </View>
    <View style={styles.table__header__column__short}>
      <Text style={styles.table__text__header}>Estado</Text>
    </View>
    <View style={styles.table__header__column}>
      <Text style={styles.table__text__header}>Observaciones</Text>
    </View>
  </View>
);

const getColumns = (lineasReporte) => {
  return lineasReporte.map((item, index) => {
    return (
      <View style={styles.table__row__container} key={"linea" + index}>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>{item.agencia_desc}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>{item.c_item}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>
            {item.c_descripcionproducto}
          </Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>{item.c_unidadmedida}</Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>
            {Number(item.stock).toFixed(2)}
          </Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>{item.ubicacion_desc}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>
            {item.fechaingresa ? moment(item.fechaingresa).format("DD/MM/yyyy") : "-"}
          </Text>
        </View>
        <View style={styles.table__body__column__tiny}>
          <Text style={styles.table__text__body}>{item.cantidad_ingreso}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>
            <Text style={styles.table__text__body}>
              {item.fechasalida ? moment(item.fechasalida).format("DD/MM/yyyy") : "-"}
            </Text>
          </Text>
        </View>
        <View style={styles.table__body__column__tiny}>
          <Text style={styles.table__text__body}>{item.cantidad_salida}</Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>
            {item.tiempo_transcurrido_dias}
          </Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>
            {item.precio ? separator(Number(item.precio).toFixed(2)) : ""}
          </Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>{item.descripciontipo}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>{item.descripcionsubtipo}</Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>{Number(item.n_pesobruto).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>{Number(item.n_pesoneto).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column__cod}>
          <Text style={styles.table__text__body}>{item.c_prestamo}</Text>
        </View>
        <View style={styles.table__body__column__cod}>
          <Text style={styles.table__text__body}>{item.c_itemorigen}</Text>
        </View>
        <View style={styles.table__body__column__short}>
          <Text style={styles.table__text__body}>{item.c_estado}</Text>
        </View>
        <View style={styles.table__body__column}>
          <Text style={styles.table__text__body}>{item.producto_observaciones}</Text>
        </View>
      </View>
    );
  });
};

const getTable = (element) => (
  <View style={styles.body__section}>
    <View style={styles.table__container}>{getHeader()}</View>
    <View style={styles.table__row__container}>
      {element?.lineasReporte && getColumns(element?.lineasReporte)}
    </View>
  </View>
);

const ReporteProductosTiendaPdf = ({ element, general }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View fixed style={styles.header__container}>
        <Text style={styles.title__company}>{element?.compania}</Text>
        <View style={styles.title_container}>
          <Text style={styles.title__reportname}>REPORTE PRORUCTOS TIENDA</Text>
          <Text style={styles.title__reportFilters}>
            Agencia: {general.agencia}
          </Text>
          <Text style={styles.title__reportFilters}>
            Ubicación: {general.ubicacion}
          </Text>
          <Text style={styles.title__reportFilters}>
            Con Stock: {general.tieneStock}
          </Text>
          <Text style={styles.title__reportFilters}>
            Fecha actual: {moment(general.fechaActual).format("DD/MM/yyyy")}
          </Text>
          <Text style={styles.title__reportFilters}>
            Estado: {general.estado}
          </Text>
        </View>
        <View style={styles.title__company}>
          <Text style={styles.title__reportname}>
            Fecha: {moment().format("DD/MM/yyyy")}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </View>
      <View style={styles.body__container}>{getTable(element)}</View>
    </Page>
  </Document>
);

export default ReporteProductosTiendaPdf;
