import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import Logo from '../../assets/images/logo_login.png';
import moment from 'moment';
import { separator } from '../../utilities/Functions/FormatNumber';

const tipoCancelaciones = {
    'C': 'CANCELACIÓN',
    'A': 'AMORTIZACIÓN',
    'R': 'RENOVACIÓN'
}

const estados = {
  'VI': 'VIGENTE',
  'CA': 'CANCELADO',
  'RE': 'REMATE'
}

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
  }
})

const groupInfo = (label, value) => (
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

const TicketPdfComponent = ({cancelaciones=[], prestamo, productos, nLineasFormatos=[]}) => (
  <Document>
    <Page size={[226.78]} style={styles.page} wrap={false}>
      {/*CADA OPERACIONE ES UN TICKET*/}
      {
        [...cancelaciones].filter(ca => nLineasFormatos.includes(ca.n_linea)).map((item, index) => (
            <View style={styles.ticket__container} key={item.n_linea}>
                <View style={styles.item__ticket__container}>
                <Text style={styles.company_name}>
                    {prestamo.nombreCompania}
                </Text>
                </View>
                <View style={styles.item__ticket__container}><Text style={styles.info_text}>{prestamo.c_ruc}</Text></View>
                <View style={styles.item__ticket__container}><Text style={styles.info_text}>{prestamo.direccionCompania} - {prestamo.nombreDistrito}</Text></View>
                {/*Tabla*/}
                <View style={styles.table__container}>
                {/*Filas*/}
                <View style={styles.table__row__container}>
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupInfo('USUARIO', item.c_usuariooperacion||item.c_usuarioregistro)}
                    {groupInfo('FECHA', moment().format('DD/MM/yyyy HH:mm:ss'))}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {/*Tikcet*/}
                    <View style={styles.table__column__container__big}>
                    <Text style={styles.info_text}>TICKET - {item.n_linea}</Text>
                    </View>
                    {groupInfo('AGENCIA', prestamo.nombreAgencia)}
                    {groupInfo('OPERACION', tipoCancelaciones[item.c_tipocancelacion])}
                    {groupInfo('N° PRESTAMO', prestamo.c_prestamo)}
                    {groupInfo('CLIENTE', `(${prestamo.n_cliente}) ${prestamo.c_nombrescompleto}`)}
                    {groupInfo('N° DOCUMENTO', prestamo.c_numerodocumento)}
                    {/*Productos*/}
                    <View style={styles.table__column__container__big}>
                    <Text style={styles.info_text}>PRODUCTOS</Text>
                    </View>
                    {/*LINEAS DE PRODUCTOS*/}
                    {
                        productos.map(producto => (
                            <>
                                {groupInfo('LÍNEA', producto.n_linea)}
                                {groupInfo('TIPO PRODUCTO', producto.tipoProducto)}
                                {groupInfo('DESCRIPCION', producto.c_descripcionproducto)}
                                {groupInfo('CANTIDAD', Number(producto.n_cantidad).toFixed(0))}
                            </>
                        ))
                    }
                    {item.c_estado !== "CA" && groupInfo('ESTADO', estados[item.c_estado])}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('PRESTAMO', separator(Number(prestamo.n_montoprestamo).toFixed(2)), true, true)}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('SALDO CAPITAL', separator(Number(item.n_montoprestamo).toFixed(2)), true, false)}
                    {groupNumber('AMORTIZACION', separator(Number(item.n_montoprestamocancelar).toFixed(2)), true, false)}
                    {groupNumber('INTERESES', separator(Number(item.n_montointeresescancelar).toFixed(2)), true, false)}
                    {groupNumber('COMISION', separator(Number(item.n_montocomisioncancelar).toFixed(2)), true, false)}
                    {groupNumber('MORA', '0.00', true, false)}
                    {groupNumber('TOTAL PAGO', separator(Number(Number(item.n_montoprestamocancelar).toFixed(2)) + Number(Number(item.n_montointeresescancelar).toFixed(2)) + Number(Number(item.n_montocomisioncancelar).toFixed(2))), true, true)}
                    {groupNumber('F. VENCIMIENTO', moment(item.d_fechavencimiento).format('DD/MM/yyyy'), true, false)}
                    {groupNumber('F. OPERACIÓN', item.d_fechacancelacion ? moment(item.d_fechacancelacion).format('DD/MM/yyyy') : "", true, false)}
                    {groupNumber('DIAS TRANS', item.n_diastranscurridos, true, false)}
                    {/*LINEA DE SEPARACIÓN*/}
                    {renderLine()}
                    {groupNumber('NUEVO SALDO', cancelaciones[item.n_linea] ? Number(cancelaciones[item.n_linea].n_montoprestamo).toFixed(2) : "0.00", true, false)}
                    {groupNumber('INTERESES', cancelaciones[item.n_linea] ? Number(cancelaciones[item.n_linea].n_montointereses).toFixed(2) : "0.00", true, false)}
                    {groupNumber('F. PROX VCTO', cancelaciones[item.n_linea] ? moment(cancelaciones[item.n_linea].d_fechavencimiento).format('DD/MM/yyyy') : "", true, false)}
                    {groupNumber('PLAZO', nLineasFormatos.length !== index + 1 ? prestamo.n_diasplazo : "", true, false)}
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
        ))
      }
    </Page>
  </Document>
)

export default TicketPdfComponent