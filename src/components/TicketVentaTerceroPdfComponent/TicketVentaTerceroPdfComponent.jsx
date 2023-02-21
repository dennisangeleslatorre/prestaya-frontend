import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import Logo from '../../assets/images/logo_login.png';
import moment from 'moment';
import { separator } from '../../utilities/Functions/FormatNumber';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
  },
  ticket__container: {
    padding:'0.3cm',
    marginTop: '2.0cm',
    width: '100%',
  },
  item__ticket__container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.05cm',
  },
  line__container: {
    display: 'flex',
  },
  company_name: {
    fontSize: '0.35cm',
  },
  info_text: {
    fontSize: '0.30cm',
  },
  table__container: {
    marginVertical: '0.15cm',
    width: '100%',
    display: 'flex',
  },
  table__row__container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  table__column__container: {
    width: '3.55cm',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.15cm',
    marginRight: '0.05cm'
  },
  table__column__container__end: {
    width: '3.55cm',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.15cm',
    marginRight: '0.05cm',
    justifyContent: 'flex-end'
  },
  table__column__text: {
    width: '86%',
    fontSize: '0.30cm',
  },
  container__text__end: {
    textAlign: 'right',
    width: '14%',
  },
  table__column__container__big: {
    width: '7.10cm',
    display: 'flex',
    marginTop: '0.15cm'
  },
  container__image : {
    width: '7.10cm',
  },
  image: {
    objectFit: 'contain',
    height: '1.4cm',
  },
})

const groupInfo = (label, value, separation) => (
  <>
    <View style={styles.table__column__container}>
      <Text style={styles.table__column__text}>{label}</Text>
      <View style={styles.container__text__end}>
        <Text style={styles.info_text}>:</Text>
      </View>
    </View>
    <View style={styles.table__column__container}>
      <Text style={styles.info_text}>{value}</Text>
    </View>
    {separation && <View style={styles.table__column__container}></View>}
  </>
)

const groupNumber = (label, value, isMoney, isSymbol ) => (
  <>
    <View style={styles.table__column__container}>
      <Text style={styles.table__column__text}>{label}</Text>
      <View style={styles.container__text__end}>
        <Text style={styles.info_text}>{isSymbol && 'S/.'}:</Text>
      </View>
    </View>
    <View style={styles.table__column__container__end}>
      <Text style={styles.info_text}>{value}</Text>
    </View>
  </>
)

const renderLine = () => (
  <View style={styles.line__container}>
    <Text style={styles.info_text}>..........................................................................................</Text>
  </View>
)

const TicketVentaTerceroPdfComponent = ({dataTickets}) => (
  <Document>
    <Page size={[226.78]} style={styles.page} wrap={false}>
        {dataTickets.map((item, index) => (
            <View style={styles.ticket__container} key={item.n_cliente}>
                <View style={styles.item__ticket__container}>
                <Text style={styles.company_name}>
                    {item.compania_desc}
                </Text>
                </View>
                <View style={styles.item__ticket__container}><Text style={styles.info_text}>{item.compania_ruc}</Text></View>
                <View style={styles.item__ticket__container}><Text style={styles.info_text}>{item.compnaia_direccion} - {item.compania_distrito}</Text></View>
                {/*Tabla*/}
                <View style={styles.table__container}>
                {/*Filas*/}
                <View style={styles.table__row__container}>
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupInfo('USUARIO', item.c_ultimousuarioventa)}
                    {groupInfo('FECHA', moment(item.d_fecha_remate_registrada).format('DD/MM/yyyy HH:mm:ss'))}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {/*Tikcet*/}
                    <View style={styles.table__column__container__big}>
                    <Text style={styles.info_text}>TICKET - {index}</Text>
                    </View>
                    {groupInfo('AGENCIA', item.agencia_nombre)}
                    {groupInfo('OPERACION', "VENTA TERCERO")}
                    {groupInfo('N° PRESTAMO', item.c_prestamo)}
                    {groupInfo('CLIENTE', `(${item.n_cliente}) ${item.c_nombrescompleto}`)}
                    {groupInfo('N° DOCUMENTO', item.c_numerodocumento)}
                    {/*Productos*/}
                    <View style={styles.table__column__container__big}>
                    <Text style={styles.info_text}>PRODUCTOS</Text>
                    </View>
                    {/*LINEAS DE PRODUCTOS*/}
                    {
                        item.productos.map(producto => (
                            <View style={styles.table__row__container} key={producto.n_linea}>
                                {groupInfo('LÍNEA', producto.n_linea)}
                                {groupInfo('TIPO PRODUCTO', producto.tipo_producto_descripcion)}
                                {groupInfo('DESCRIPCION', producto.c_descripcionproducto)}
                                {groupInfo('CANTIDAD', Number(producto.n_cantidad).toFixed(0), true)}
                            </View>
                        ))
                    }
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('TOTAL', separator(Number(item.total).toFixed(2)), true, true)}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('OTROS', separator(Number(0.00).toFixed(2)), true, false)}
                    {groupNumber('IGV', separator(Number(0.00).toFixed(2)), true, false)}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('TOTAL FINAL', separator(Number(item.total).toFixed(2)), true, true)}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                </View>
                {/*Filas Fin*/}
                </View>
                {/*Tabla Fin*/}
                <View style={styles.container__image}>
                <Image
                    src={Logo}
                    style={styles.image}
                />
                </View>
            </View>
        ))}
    </Page>
  </Document>
)

export default TicketVentaTerceroPdfComponent