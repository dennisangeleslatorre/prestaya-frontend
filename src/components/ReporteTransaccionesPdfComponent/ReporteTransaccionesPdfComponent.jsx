import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Line } from '@react-pdf/renderer';
import moment from 'moment'
import { formatPeriodo } from '../../utilities/Functions/FormatPeriodo';
import { separator } from '../../utilities/Functions/FormatNumber';

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        padding:'1.5cm',
    },
    header__container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    title__company: {
        fontSize: '0.5cm',
        width: '6.5cm'
    },
    title_container: {
        width: '14cm',
        textAlign:'center'
    },
    title__reportname: {
        fontSize: '0.5cm',
        marginBottom: '0.1cm'
    },
    //tabla
    table__container: {
        marginTop: '0.5cm',
        width: '100%',
        display: 'flex',
    },
    table__row__container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    body__container: {
        width: '100%',
        display: 'flex',
        marginTop: '0.35cm'
    },
    body__section: {
        width: '100%',
        display: 'flex',
        marginTop: '0.15cm'
    },
    //header
    table__header__agencia: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__tipo: {
        width: '0.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__numero_doc: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__fecha: {
        width: '1.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__periodo: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__cliente: {
        width: '1.80cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__prestamo: {
        width: '1.65cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__moneda: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__observaciones: {
        width: '1.25cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__linea: {
        width: '1cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__producto: {
        width: '1.65cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__descripcion__producto: {
        width: '1.85cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__unidad: {
        width: '1.14cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__cantidad: {
        width: '0.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__precio: {
        width: '1.13cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__monto__total: {
        width: '1.13cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    //body
    table__body__agencia: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__tipo: {
        width: '0.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__numero_doc: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__fecha: {
        width: '1.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__periodo: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__cliente: {
        width: '1.80cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__prestamo: {
        width: '1.65cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__moneda: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__observaciones: {
        width: '1.25cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__linea: {
        width: '1cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__producto: {
        width: '1.65cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__descripcion__producto: {
        width: '1.85cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__unidad: {
        width: '1.14cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__cantidad: {
        width: '0.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__precio: {
        width: '1.13cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    table__body__monto__total: {
        width: '1.13cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
    },
    //Textos
    table__text__header: {
        fontSize: '0.25cm',
        textAlign: 'center'
    },
    table__text__body: {
        fontSize: '0.20cm',
        textAlign: 'center'
    },
})

const getHeader = () => (
    <View style={styles.table__row__container}>
        <View style={styles.table__header__agencia}>
            <Text style={styles.table__text__header}>Agencia</Text>
        </View>
        <View style={styles.table__header__producto}>
            <Text style={styles.table__text__header}>Producto</Text>
        </View>
        <View style={styles.table__header__descripcion__producto}>
            <Text style={styles.table__text__header}>Descripcion Producto</Text>
        </View>
        <View style={styles.table__header__unidad}>
            <Text style={styles.table__text__header}>Unidad M.</Text>
        </View>
        <View style={styles.table__header__tipo}>
            <Text style={styles.table__text__header}>T</Text>
        </View>
        <View style={styles.table__header__numero_doc}>
            <Text style={styles.table__text__header}>Numero Doc.</Text>
        </View>
        <View style={styles.table__header__fecha}>
            <Text style={styles.table__text__header}>Fecha Doc</Text>
        </View>
        <View style={styles.table__header__periodo}>
            <Text style={styles.table__text__header}>Periodo</Text>
        </View>
        <View style={styles.table__header__cliente}>
            <Text style={styles.table__text__header}>Cliente</Text>
        </View>
        <View style={styles.table__header__prestamo}>
            <Text style={styles.table__text__header}># Prestamo</Text>
        </View>
        <View style={styles.table__header__moneda}>
            <Text style={styles.table__text__header}>Mnf.</Text>
        </View>
        <View style={styles.table__header__observaciones}>
            <Text style={styles.table__text__header}>Observaciones Cab.</Text>
        </View>
        <View style={styles.table__header__linea}>
            <Text style={styles.table__text__header}>Linea</Text>
        </View>
        <View style={styles.table__header__cantidad}>
            <Text style={styles.table__text__header}>Cnt.</Text>
        </View>
        <View style={styles.table__header__precio}>
            <Text style={styles.table__text__header}>Precio</Text>
        </View>
        <View style={styles.table__header__monto__total}>
            <Text style={styles.table__text__header}>Monto total</Text>
        </View>
        <View style={styles.table__header__precio}>
            <Text style={styles.table__text__header}>U. Oper</Text>
        </View>
        <View style={styles.table__header__cantidad}>
            <Text style={styles.table__text__header}>% G.</Text>
        </View>
        <View style={styles.table__header__precio}>
            <Text style={styles.table__text__header}>Precio H.</Text>
        </View>
        <View style={[styles.table__header__cantidad, {width: '0.8cm'}]}>
            <Text style={styles.table__text__header}>M. Margen</Text>
        </View>
        <View style={styles.table__header__cantidad}>
            <Text style={styles.table__text__header}>% H.</Text>
        </View>
        <View style={styles.table__header__observaciones}>
            <Text style={styles.table__text__header}>Observaciones Det.</Text>
        </View>
    </View>
)

const getColumns = (data, key) => {
    return data.map((item, index) => (
        <View key={key + index} style={styles.table__row__container}>
            <View style={styles.table__body__agencia}>
                <Text style={styles.table__text__body}>{item.c_agencia_desc}</Text>
            </View>
            <View style={styles.table__body__producto}>
                <Text style={styles.table__text__body}>{item.c_item}</Text>
            </View>
            <View style={styles.table__body__descripcion__producto}>
                <Text style={styles.table__text__body}>{item.c_descripcionproducto}</Text>
            </View>
            <View style={styles.table__body__unidad}>
                <Text style={styles.table__text__body}>{item.c_unidadmedida}</Text>
            </View>
            <View style={styles.table__body__tipo}>
                <Text style={styles.table__text__body}>{item.c_tipodocumento}</Text>
            </View>
            <View style={styles.table__body__numero_doc}>
                <Text style={styles.table__text__body}>{item.c_numerodocumento}</Text>
            </View>
            <View style={styles.table__body__fecha}>
                <Text style={styles.table__text__body}>{item.d_fechadocumento ? moment(item.d_fechadocumento).format('DD/MM/yyyy') : ""}</Text>
            </View>
            <View style={styles.table__body__periodo}>
                <Text style={styles.table__text__body}>{item.c_periodo ? formatPeriodo(item.c_periodo) : ""}</Text>
            </View>
            <View style={styles.table__body__cliente}>
                <Text style={styles.table__text__body}>{item.c_nombrescompleto}</Text>
            </View>
            <View style={styles.table__body__prestamo}>
                <Text style={styles.table__text__body}>{item.c_prestamo ? item.c_prestamo : ""}</Text>
            </View>
            <View style={styles.table__body__moneda}>
                <Text style={styles.table__text__body}>{item.c_moneda}</Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}>{item.c_obsv_cabecera}</Text>
            </View>
            <View style={styles.table__body__linea}>
                <Text style={styles.table__text__body}>{item.n_linea}</Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}>{item.n_cantidad ? Number(item.n_cantidad).toFixed(0) : ""}</Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={[styles.table__text__body, item.c_tipodocumento === 'NS' && {color:'red'}, {textAlign: 'right'}]}>
                    { item.n_precio ?
                        (item.c_tipodocumento === 'NS' ? `(${separator(Number(item.n_precio).toFixed(2))})` : separator(Number(item.n_precio).toFixed(2)))
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__monto__total}>
                <Text style={[styles.table__text__body, item.c_tipodocumento === 'NS' && {color:'red'}, {textAlign: 'right'}]}>
                     { item.n_montototal ?
                        (item.c_tipodocumento === 'NS' ? `(${separator(Number(item.n_montototal).toFixed(2))})` : separator(Number(item.n_montototal).toFixed(2)))
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>{item.c_usuariooperacion}</Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}>{item.n_porcremate ? Number(item.n_porcremate).toFixed(2) : ""}</Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>
                    {item.n_preciobasehist ? separator(Number(item.n_preciobasehist).toFixed(2)) : ""}
                </Text>
            </View>
            <View style={[styles.table__body__precio, {width: '0.8cm'}]}>
                <Text style={styles.table__text__body}>
                    {item.n_montomargen ? separator(Number(item.n_montomargen).toFixed(2)) : ""}
                </Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}>{item.n_porcrematehist ? Number(item.n_porcrematehist).toFixed(2) : ""}</Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}>{item.c_observacionesdet}</Text>
            </View>
        </View>
    ))
}

const getSumas = (element) => (
    <>
        <View key={element.key+'L'} style={styles.table__row__container}>
            <View style={styles.table__body__agencia}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__descripcion__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__unidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__tipo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__numero_doc}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__fecha}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__periodo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cliente}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__prestamo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__moneda}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__linea}>
                <Text style={styles.table__text__body}>Total Cantidad:</Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}>{element.cantidad}</Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total Local:</Text>
            </View>
            <View style={styles.table__body__monto__total}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaLocal) < 0 && {color: "red"}]}>
                    { element.sumaLocal ?
                        Number(element.sumaLocal) < 0 ? `(${separator(Number(Number(element.sumaLocal) * -1).toFixed(2))})` : separator(element.sumaLocal)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Mnt. Margen Local</Text>
            </View>
            <View style={[styles.table__body__precio, {width: '0.8cm'}]}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaMargenLocal) < 0 && {color: "red"}]}>
                    { element.sumaMargenLocal ?
                        Number(element.sumaMargenLocal) < 0 ? `(${separator(Number(Number(element.sumaMargenLocal) * -1).toFixed(2))})` : separator(element.sumaMargenLocal)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
        </View>
        <View key={element.key+'S'} style={styles.table__row__container}>
            <View style={styles.table__body__agencia}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__descripcion__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__unidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__tipo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__numero_doc}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__fecha}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__periodo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cliente}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__prestamo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__moneda}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__linea}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total Exterior:</Text>
            </View>
            <View style={styles.table__body__monto__total}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaExterior) < 0 && {color: "red"}]}>
                    { element.sumaExterior ?
                        Number(element.sumaExterior) < 0 ? `(${separator(Number(Number(element.sumaExterior) * -1).toFixed(2))})` : separator(element.sumaExterior)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Mnt. Margen Ext.</Text>
            </View>
            <View style={[styles.table__body__precio, {width: '0.8cm'}]}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaMargenExterior) < 0 && {color: "red"}]}>
                    { element.sumaMargenExterior ?
                        Number(element.sumaMargenExterior) < 0 ? `(${separator(Number(Number(element.sumaMargenExterior) * -1).toFixed(2))})` : separator(element.sumaMargenExterior)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
        </View>
    </>
)

const getSumasTotal = (element) => (
    <>
        <View key={element.key+'L'+'total_general'} style={[styles.table__row__container, {marginTop: '0.5cm'}]}>
            <View style={styles.table__body__agencia}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__descripcion__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__unidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__tipo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__numero_doc}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__fecha}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__periodo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cliente}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__prestamo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__moneda}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__linea}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total General Local:</Text>
            </View>
            <View style={styles.table__body__monto__total}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaLocal) < 0 && {color: "red"}]}>
                    { element.sumaLocal ?
                        Number(element.sumaLocal) < 0 ? `(${separator(Number(Number(element.sumaLocal) * -1).toFixed(2))})` : separator(element.sumaLocal)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total M. Margen L.</Text>
            </View>
            <View style={[styles.table__body__precio, {width: '0.8cm'}]}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaMargenLocal) < 0 && {color: "red"}]}>
                    { element.sumaMargenLocal ?
                        Number(element.sumaMargenLocal) < 0 ? `(${separator(Number(Number(element.sumaMargenLocal) * -1).toFixed(2))})` : separator(element.sumaMargenLocal)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
        </View>
        <View key={element.key+'S'+'total_general'} style={styles.table__row__container}>
            <View style={styles.table__body__agencia}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__descripcion__producto}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__unidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__tipo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__numero_doc}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__fecha}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__periodo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cliente}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__prestamo}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__moneda}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__linea}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total General Exterior:</Text>
            </View>
            <View style={styles.table__body__monto__total}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaExterior) < 0 && {color: "red"}]}>
                    { element.sumaExterior ?
                        Number(element.sumaExterior) < 0 ? `(${separator(Number(Number(element.sumaExterior) * -1).toFixed(2))})` : separator(element.sumaExterior)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__precio}>
                <Text style={styles.table__text__body}>Total M. Margen Ext.</Text>
            </View>
            <View style={[styles.table__body__precio, {width: '0.8cm'}]}>
                <Text style={[styles.table__text__body, {textAlign: 'right'}, Number(element.sumaMargenExterior) < 0 && {color: "red"}]}>
                    { element.sumaMargenExterior ?
                        Number(element.sumaMargenExterior) < 0 ? `(${separator(Number(Number(element.sumaMargenExterior) * -1).toFixed(2))})` : separator(element.sumaMargenExterior)
                        : "0.00" }
                </Text>
            </View>
            <View style={styles.table__body__cantidad}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={styles.table__body__observaciones}>
                <Text style={styles.table__text__body}></Text>
            </View>
        </View>
    </>
)

const getTable = (elements) => {
    const keys = Object.keys(elements);
    return keys.map( key => {
        const element = elements[key];
        return (
            <View style={styles.body__section}>
                <View style={styles.table__container}>
                    {getHeader()}
                    <View style={styles.table__row__container}>
                        {getColumns(element.data, key)}
                        {getSumas(element)}
                    </View>
                </View>
            </View>
        )
    })
}

const ReporteTransaccionesPdfComponent = ({data, dataHeadPdf, total}) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            <View fixed style={styles.header__container}>
                <Text style={styles.title__company}>{dataHeadPdf.company_name}</Text>
                <View style={styles.title_container}>
                    <Text style={styles.title__reportname}>REPORTE TRANSACCIONES TIENDA</Text>
                    { dataHeadPdf.fecha_descripcion && (
                        <Text style={styles.title__reportname}>{dataHeadPdf.fecha_descripcion}</Text>
                    ) }
                    { dataHeadPdf.periodo_descripcion && (
                        <Text style={styles.title__reportname}>{dataHeadPdf.periodo_descripcion}</Text>
                    ) }
                    <Text style={styles.title__reportname}>Tipo: {dataHeadPdf.tipo_descripcion}</Text>
                </View>
                <View style={styles.title__company}>
                    <Text style={styles.title__reportname}>Fecha: {moment().format('DD/MM/yyyy')}</Text>
                    <Text render={({pageNumber, totalPages}) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}/>
                </View>
            </View>
            <View style={styles.body__container}>
                {getTable(data)}
                {getSumasTotal(total)}
            </View>
        </Page>
    </Document>
)

export default ReporteTransaccionesPdfComponent