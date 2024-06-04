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
  //Tabla
  body__container: {
    width: "100%",
    display: "flex",
  },
  body__section: {
    width: "100%",
    display: "flex",
    marginTop: "0.5cm",
  },
  table__container: {
    marginTop: "0.3cm",
    width: "100%",
    display: "flex",
  },
  table__row__container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  table__body__general__label: {
    display: "flex",
    margin: "0px",
    marginTop: "0.3cm",
  },
  table__body__general__data: {
    display: "flex",
    margin: "0px",
    marginTop: "0.3cm",
    marginRight: "0.3cm",
    textAlign: "center",
    border: "1px",
  },
  table__body__general__without__margin: {
    display: "flex",
    margin: "0px",
    marginTop: "0.3cm",
    textAlign: "center",
    border: "1px",
  },
  //Header Table
  table__header: {
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    margin: "0px",
    backgroundColor: "gray",
    color: "white",
  },
  //Body Table
  table__data: {
    minHeight: "0.7cm",
    display: "flex",
    justifyContent: "center",
    margin: "0px",
  },
  //Textos
  text__info: {
    fontSize: "0.30cm",
  },
  text__info__bold: {
    fontSize: "0.32cm",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  table__text__header: {
    fontSize: "0.26cm",
    textAlign: "center",
  },
  table__text__body: {
    fontSize: "0.22cm",
    textAlign: "center",
  },
  table__text__body_price: {
    fontSize: "0.22cm",
    textAlign: "right",
  },
});

const renderHeaderPDF = (general) => (
  <View fixed style={styles.header__container}>
    <Text style={styles.title__company}>{general.companianame}</Text>
    <View style={styles.title_container}>
      <Text style={styles.title__reportname}>REPORTE DE FLUJO CAJA TIENDA</Text>
      <Text style={styles.title__reportFilters}>
        Fecha movimiento: del {general.fechaMovimientoInicio} al{" "}
        {general.fechaMovimientoFinal}
      </Text>
      <Text style={styles.title__reportFilters}>
        Clase Tipo Mov: {general.clase}
      </Text>
      <Text style={styles.title__reportFilters}>
        Usuario Flujo Caja Tienda: {general.usuarioFT}
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
);

const renderDataGeneral = (fc, index) => (
  <View key={`${fc.agencia}-${fc.usuarioFlujoCajaTienda}-${index}`} style={styles.body__container}>
    <View style={styles.body__section}>
      <View style={styles.table__container}>
        <View style={styles.table__row__container}>
          {/*Agencia*/}
          <View
            style={[styles.table__body__general__label, { width: "1.4cm" }]}
          >
            <Text style={styles.text__info__bold}>Agencia:</Text>
          </View>
          <View style={[styles.table__body__general__data, { width: "3.8cm" }]}>
            <Text style={styles.text__info}>{fc.agencia}</Text>
          </View>
          {/*Usuario flujo caja*/}
          <View
            style={[styles.table__body__general__label, { width: "2.8cm" }]}
          >
            <Text style={styles.text__info__bold}>Usuario Flujo CT:</Text>
          </View>
          <View style={[styles.table__body__general__data, { width: "1.8cm" }]}>
            <Text style={styles.text__info}>{fc.usuarioFlujoCajaTienda}</Text>
          </View>
          {/*Tipo Caja Usuario*/}
          <View
            style={[styles.table__body__general__label, { width: "2.7cm" }]}
          >
            <Text style={styles.text__info__bold}>Tipo Caja Usuario:</Text>
          </View>
          <View style={[styles.table__body__general__data, { width: "1.9cm" }]}>
            <Text style={styles.text__info}>{fc.tipoCajaUsuario}</Text>
          </View>
          {/*Fecha Movimiento*/}
          <View
            style={[styles.table__body__general__label, { width: "2.8cm" }]}
          >
            <Text style={styles.text__info__bold}>Fecha movimiento:</Text>
          </View>
          <View
            style={[
              styles.table__body__general__without__margin,
              { width: "1.9cm" },
            ]}
          >
            <Text style={styles.text__info}>{fc.fechaInicio}</Text>
          </View>
          <View style={[styles.table__body__general__data, { width: "1.9cm" }]}>
            <Text style={styles.text__info}>{fc.fechaFin}</Text>
          </View>
          {/*Moneda*/}
          <View
            style={[styles.table__body__general__label, { width: "1.4cm" }]}
          >
            <Text style={styles.text__info__bold}>Moneda:</Text>
          </View>
          <View
            style={[
              styles.table__body__general__without__margin,
              { width: "1.4cm" },
            ]}
          >
            <Text style={styles.text__info}>{fc.moneda}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const renderHeaderTable = () => (
  <View style={styles.table__row__container}>
    <View style={[styles.table__header, { width: "1.0cm" }]}>
      <Text style={[styles.table__text__header]}>NRO</Text>
    </View>
    <View style={[styles.table__header, { width: "1.7cm" }]}>
      <Text style={[styles.table__text__header]}>FECHA</Text>
    </View>
    <View style={[styles.table__header, { width: "2.8cm" }]}>
      <Text style={[styles.table__text__header]}>OBSERVACIONES</Text>
    </View>
    <View style={[styles.table__header, { width: "1.6cm" }]}>
      <Text style={[styles.table__text__header]}>ESTADO</Text>
    </View>
    <View style={[styles.table__header, { width: "1.0cm" }]}>
      <Text style={[styles.table__text__header]}>SEC.</Text>
    </View>
    <View style={[styles.table__header, { width: "2.9cm" }]}>
      <Text style={[styles.table__text__header]}>Tipo Movimiento</Text>
    </View>
    <View style={[styles.table__header, { width: "2.0cm" }]}>
      <Text style={[styles.table__text__header]}>Usuario Mov.</Text>
    </View>
    <View style={[styles.table__header, { width: "2.8cm" }]}>
      <Text style={[styles.table__text__header]}>Observaciones</Text>
    </View>
    <View style={[styles.table__header, { width: "2.0cm" }]}>
      <Text style={[styles.table__text__header]}>Mnt. Total</Text>
    </View>
    <View style={[styles.table__header, { width: "1.9cm" }]}>
      <Text style={[styles.table__text__header]}>Fuente</Text>
    </View>
    <View style={[styles.table__header, { width: "2.5cm" }]}>
      <Text style={[styles.table__text__header]}># Doc Transaccion</Text>
    </View>
    <View style={[styles.table__header, { width: "1.4cm" }]}>
      <Text style={[styles.table__text__header]}>Agencia O/D</Text>
    </View>
  </View>
);

const renderBodyTable = (fechas, indicefc, sumas) => (
  <>
    {fechas.map((fecha, indexf) => {
      return (
        <>
          {fecha.movimientos.map((mov, indexm) => (
            <View
              key={`${indexm}-${indicefc}-${fecha.fecha}-${mov.secuencia}`}
              style={styles.table__row__container}
            >
              <View
                style={[styles.table__data, { width: "1.0cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {indexm > 0 ? "" : indexf + 1}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "1.7cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {indexm > 0 ? "" : moment(fecha.fecha).format("DD/MM/yyyy")}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.8cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {indexm > 0 ? "" : fecha.observacion}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "1.6cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {indexm > 0 ? "" : fecha.estado}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "1.0cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>{mov.secuencia}</Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.9cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {mov.tipomovimiento}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.0cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>{mov.usuariomov}</Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.8cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>{mov.observacion}</Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.0cm", border: "1px" }]}
              >
                <Text
                  style={[
                    styles.table__text__body_price,
                    mov.clasemov === "S" ? { color: "red" } : "",
                  ]}
                >
                  {mov.clasemov === "S"
                    ? `( ${separator(Number(mov.montomov).toFixed(2))} )`
                    : separator(Number(mov.montomov).toFixed(2))}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "1.9cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>{mov.fuente}</Text>
              </View>
              <View
                style={[styles.table__data, { width: "2.5cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {mov.docTransaccion}
                </Text>
              </View>
              <View
                style={[styles.table__data, { width: "1.4cm", border: "1px" }]}
              >
                <Text style={styles.table__text__body}>
                  {mov.agenciarelacioanda || ""}
                </Text>
              </View>
            </View>
          ))}
        </>
      );
    })}
    <View
      key={`${indicefc}-${sumas.suma_montointerescancelar}-${sumas.suma_montoprestamocancelar}-${sumas.suma_montocomisioncancelar}-${sumas.suma_montototalcancelar}`}
      style={styles.table__row__container}
    >
      <View style={[styles.table__data, { width: "13cm" }]}>
        <Text style={styles.table__text__body}></Text>
      </View>
      <View style={[styles.table__data, { width: "2.8cm", border: "1px" }]}>
        <Text style={styles.table__text__body}>TOTALES:</Text>
      </View>
      <View style={[styles.table__data, { width: "2.0cm", border: "1px" }]}>
        <Text style={styles.table__text__body_price}>
          {separator(Number(sumas.suma_montototal).toFixed(2))}
        </Text>
      </View>
      <View style={[styles.table__data, { width: "5.8cm" }]}>
        <Text style={styles.table__text__body}></Text>
      </View>
    </View>
  </>
);

const renderTotales = (totalesPxCtotalesFlujoTienda) => (
  <>
    <View style={styles.table__container}>
      <View style={styles.table__row__container}>
        <View style={[styles.table__data, { width: "13cm" }]}>
          <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, { width: "2.8cm", border: "1px" }]}>
          <Text style={styles.table__text__body}>TOTAL:</Text>
        </View>
        <View style={[styles.table__data, { width: "2.0cm", border: "1px" }]}>
          <Text style={styles.table__text__body_price}>
            {separator(
              Number(totalesPxCtotalesFlujoTienda.suma_montototal).toFixed(2)
            )}
          </Text>
        </View>
        <View style={[styles.table__data, { width: "5.8cm" }]}>
          <Text style={styles.table__text__body}></Text>
        </View>
      </View>
    </View>
  </>
);

const renderTable = (movimientos) => {
  return movimientos.map((ft, index) => (
    <>
      {renderDataGeneral(ft, index)}
      <View key={`${index}-${ft.cod}`} style={styles.body__container}>
        <View style={styles.body__section}>
          <View style={styles.table__container}>
            {renderHeaderTable()}
            {renderBodyTable(ft.fechas, index, ft.sumas)}
          </View>
        </View>
      </View>
    </>
  ));
};

const ReporteFlujoCajaTiendaPdf = ({
  general,
  movimientosFlujoTienda,
  totalesFlujoTienda,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {renderHeaderPDF(general)}
      {renderTable(movimientosFlujoTienda)}
      {renderTotales(totalesFlujoTienda)}
    </Page>
  </Document>
);

export default ReporteFlujoCajaTiendaPdf;
