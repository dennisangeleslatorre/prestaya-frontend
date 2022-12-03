import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import Logo from '../../assets/images/logo_login.png';
import moment from 'moment';
import { separator } from '../../utilities/Functions/FormatNumber';

Font.register(
    { family: 'Roboto',
    fonts: [
        {   src: 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf' },
        {   fontWeight: 'bold',
            src: 'http://fonts.gstatic.com/s/roboto/v15/bdHGHleUa-ndQCOrdpfxfw.ttf' },
        {   fontWeight: 'semibold',
            src: 'http://fonts.gstatic.com/s/roboto/v15/Uxzkqj-MIMWle-XP2pDNAA.ttf' },
        {   fontWeight: 'bold',
            fontStyle: 'italic',
            src: 'http://fonts.gstatic.com/s/roboto/v15/daIfzbEw-lbjMyv4rMUUTqCWcynf_cDxXwCLxiixG1c.ttf' }
    ]}
  );

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
    //Tabla
    body__container: {
        width: '100%',
        display: 'flex'
    },
    body__section: {
        width: '100%',
        display: 'flex',
        marginTop: '0.5cm'
    },
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
    //Header Productos
    table__header__cnt: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__und: {
        width: '2.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__tipo: {
        width: '2.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__descripcion: {
        width: '4.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__peso: {
        width: '3.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__text__header: {
        fontSize: '0.30cm',
        textAlign: 'center'
    },
    //Body Productos
    table__body__cnt: {
        width: '1.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__und: {
        width: '2.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__tipo: {
        width: '2.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__descripcion: {
        width: '4.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__peso: {
        width: '3.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__text__body: {
        fontSize: '0.22cm',
        textAlign: 'center'
    },
    //Header Cancelaciones
    table__header__linea: {
        width: '0.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__fechaVencimiento: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__montoPrestamo: {
        width: '2.3cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mntIntereses: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__tipoCancelacion: {
        width: '1.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__fechaCancelacion: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__diasTranscurridos: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mtInteresDiario: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mntInteresesCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mntPrestamoCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mntComision: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__mntTotalCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__observaciones: {
        width: '3.2cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__estado: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__text__header__cancelacion: {
        fontSize: '0.24cm',
        textAlign: 'center'
    },
    //Table Body
    table__body__linea: {
        width: '0.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__fechaVencimiento: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__montoPrestamo: {
        width: '2.3cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mntIntereses: {
        width: '1.6cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__tipoCancelacion: {
        width: '1.8cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__fechaCancelacion: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__diasTranscurridos: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mtInteresDiario: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mntInteresesCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mntPrestamoCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mntComision: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__mntTotalCancelar: {
        width: '2.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__observaciones: {
        width: '3.2cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__body__estado: {
        width: '1.7cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    table__text__body__right: {
        fontSize: '0.22cm',
        textAlign: 'right'
    },
    table__border: {
        borderWidth: '1px'
    },
    table__body__general: {
        display: 'flex',
        margin: '0px',
        marginTop: '0.3cm',
        marginRight: '0.1cm'
    },
    text__prestamo: {
        fontSize: '0.34cm',
        fontFamily: 'Roboto',
    },
    text__prestamo__bold: {
        fontSize: '0.36cm',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    table__title: {
        fontSize: '0.4cm',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    }
});

const getHeaderPage = (prestamo) => (
    <View fixed style={styles.header__container}>
        <Text style={styles.title__company}>{prestamo.nombreCompania}</Text>
        <View style={styles.title_container}>
            <Text style={styles.title__reportname}>FORMATO DE CANCELACIONES</Text>
        </View>
        <View style={styles.title__company}>
            <Text style={styles.title__reportname}>Fecha: {moment().format('DD/MM/yyyy')}</Text>
            <Text render={({pageNumber, totalPages}) => (
                `Página ${pageNumber} de ${totalPages}`
            )}/>
        </View>
    </View>
)

const getPrestamoData = (prestamo, estadosPrestamo) => (
    <View style={styles.body__container}>
        <View style={styles.body__section}>
            <View style={styles.table__container}>
                <View style={styles.table__row__container}>
                    {/*Agencia*/}
                    <View style={[styles.table__body__general, {width:'1.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Agencia:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'4.2cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.nombreAgencia}</Text>
                    </View>
                    {/*Prestamo*/}
                    <View style={[styles.table__body__general, {width:'2.4cm'}]}>
                        <Text style={styles.text__prestamo__bold}>N° Prestamo:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.5cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.c_prestamo}</Text>
                    </View>
                    {/*Estado*/}
                    <View style={[styles.table__body__general, {width:'1.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Estado:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.1cm'}]}>
                        <Text style={styles.text__prestamo}>{estadosPrestamo[prestamo.c_estado]}</Text>
                    </View>
                    {/*Cliente*/}
                    <View style={[styles.table__body__general, {width:'1.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Cliente:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'6.7cm'}]}>
                        <Text style={styles.text__prestamo}>({prestamo.n_cliente}) {prestamo.c_nombrescompleto}</Text>
                    </View>
                </View>
                <View style={styles.table__row__container}>
                    {/*Tipo Documeto*/}
                    <View style={[styles.table__body__general, {width:'3.0cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Tipo documento:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'4.5cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.descripcionTipoDoc}</Text>
                    </View>
                    {/*N° Documeto*/}
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>N° documento:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.c_numerodocumento}</Text>
                    </View>
                    {/*Direccion*/}
                    <View style={[styles.table__body__general, {width:'1.9cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Dirección:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'7.3cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.c_direccioncliente}</Text>
                    </View>
                    {/*País*/}
                    <View style={[styles.table__body__general, {width:'1.5cm'}]}>
                        <Text style={styles.text__prestamo__bold}>País:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.5cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.nombrePais}</Text>
                    </View>
                </View>
                <View style={styles.table__row__container}>
                    {/*Departamento*/}
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Departamento:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'3.0cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.nombreDepartamento}</Text>
                    </View>
                    {/*Provincia*/}
                    <View style={[styles.table__body__general, {width:'1.9cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Provincia:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'4.8cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.nombreProvincia}</Text>
                    </View>
                    {/*Distrito*/}
                    <View style={[styles.table__body__general, {width:'1.7cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Distrito:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'4.8cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.nombreDistrito}</Text>
                    </View>
                    {/*Telefono*/}
                    <View style={[styles.table__body__general, {width:'1.7cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Teléfono:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.c_telefono1}</Text>
                    </View>
                </View>
                <View style={styles.table__row__container}>
                    {/*Moneda*/}
                    <View style={[styles.table__body__general, {width:'1.7cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Moneda:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.3cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.c_monedaprestamo === "L" ? "LOCAL" : "EXTRANJERO"}</Text>
                    </View>
                    {/*Monto Prestamo*/}
                    <View style={[styles.table__body__general, {width:'3.0cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Monto Préstamo:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.9cm'}]}>
                        <Text style={styles.text__prestamo}>{separator(Number(prestamo.n_montoprestamo).toFixed(2))}</Text>
                    </View>
                    {/*Tasa Interes*/}
                    <View style={[styles.table__body__general, {width:'2.3cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Tasa Interes:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.4cm'}]}>
                        <Text style={styles.text__prestamo}>{separator(Number(prestamo.n_tasainteres).toFixed(2))}</Text>
                    </View>
                    {/*Monto intereses*/}
                    <View style={[styles.table__body__general, {width:'3.0cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Monto intereses:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.5cm'}]}>
                        <Text style={styles.text__prestamo}>{separator(Number(prestamo.n_montointereses).toFixed(2))}</Text>
                    </View>
                    {/*Mnt. Total P.*/}
                    <View style={[styles.table__body__general, {width:'2.4cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Mnt. Total P.:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.5cm'}]}>
                        <Text style={styles.text__prestamo}>{separator(Number(prestamo.n_montototalprestamo).toFixed(2))}</Text>
                    </View>
                </View>
                <View style={styles.table__row__container}>
                    {/*Mnt. interés Diario*/}
                    <View style={[styles.table__body__general, {width:'3.2cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Mnt. interés Diario:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.2cm'}]}>
                        <Text style={styles.text__prestamo}>{separator(Number(prestamo.n_montointeresesdiario).toFixed(2))}</Text>
                    </View>
                    {/*F. Desembolso*/}
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>F. Desembolso:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'2.0cm'}]}>
                        <Text style={styles.text__prestamo}>{moment(prestamo.d_fechadesembolso).format('DD/MM/yyyy')}</Text>
                    </View>
                    {/*Plazo (días)*/}
                    <View style={[styles.table__body__general, {width:'2.3cm'}]}>
                        <Text style={styles.text__prestamo__bold}>Plazo (días):</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'0.8cm'}]}>
                        <Text style={styles.text__prestamo}>{prestamo.n_diasplazo}</Text>
                    </View>
                    {/*F. Vencimiento*/}
                    <View style={[styles.table__body__general, {width:'2.6cm'}]}>
                        <Text style={styles.text__prestamo__bold}>F. Vencimiento:</Text>
                    </View>
                    <View style={[styles.table__body__general, {width:'1.5cm'}]}>
                        <Text style={styles.text__prestamo}>{moment(prestamo.d_fechavencimiento).format('DD/MM/yyyy')}</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
)

const getTableProductos = (productos, productosConPeso) => {
    let sumaPesoNeto=0.00;
    let sumaPesoBruto=0.00;
    console.log("AAA", productosConPeso)
    return (
        <View style={styles.body__container}>
            <View style={styles.body__section}>
                <View style={styles.table__container}>
                <Text style={styles.table__title}>LISTADO DE PRODUCTOS</Text>
                    {/*Header*/}
                    <View style={styles.table__row__container}>
                        <View style={styles.table__header__cnt}>
                            <Text style={styles.table__text__header}>CNT</Text>
                        </View>
                        <View style={styles.table__header__und}>
                            <Text style={styles.table__text__header}>UND</Text>
                        </View>
                        <View style={styles.table__header__tipo}>
                            <Text style={styles.table__text__header}>TIPO</Text>
                        </View>
                        <View style={styles.table__header__descripcion}>
                            <Text style={styles.table__text__header}>DESCRIPCIÓN</Text>
                        </View>
                        <View style={styles.table__header__descripcion}>
                            <Text style={styles.table__text__header}>OBSERVACIONES</Text>
                        </View>
                        { productosConPeso.length > 0 &&
                        <>
                            <View style={styles.table__header__peso}>
                                <Text style={styles.table__text__header}>PESO BRUTO</Text>
                            </View>
                            <View style={styles.table__header__peso}>
                                <Text style={styles.table__text__header}>PESO NETO</Text>
                            </View>
                        </> }
                    </View>
                    {/*Body*/}
                    {productos.map((item, index) => {
                        sumaPesoNeto += Number(Number(item.n_pesobruto).toFixed(4));
                        sumaPesoBruto += Number(Number(item.n_pesobruto).toFixed(4));
                        return (
                            <View style={styles.table__row__container} key={index}>
                                <View style={[styles.table__body__cnt, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{Number(item.n_cantidad).toFixed(0)}</Text>
                                </View>
                                <View style={[styles.table__body__und, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.unidadmedidadesc}</Text>
                                </View>
                                <View style={[styles.table__body__tipo, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.tipoProducto}</Text>
                                </View>
                                <View style={[styles.table__body__descripcion, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.c_descripcionproducto}</Text>
                                </View>
                                <View style={[styles.table__body__descripcion, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.c_observaciones}</Text>
                                </View>
                                { productosConPeso.length > 0 &&
                                <>
                                    <View style={[styles.table__body__peso, styles.table__border]}>
                                        <Text style={styles.table__text__body}>{item.n_pesobruto ? Number(item.n_pesobruto).toFixed(4) : "0.0000"}</Text>
                                    </View>
                                    <View style={[styles.table__body__peso, styles.table__border]}>
                                        <Text style={styles.table__text__body}>{item.n_pesoneto ? Number(item.n_pesoneto).toFixed(4) : "0.0000"}</Text>
                                    </View>
                                </>
                                }
                            </View>
                        )
                    })}
                    {productosConPeso.length > 0 &&
                    <>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__body__cnt}>
                                <Text style={styles.table__text__body}></Text>
                            </View>
                            <View style={styles.table__body__und}>
                                <Text style={styles.table__text__body}></Text>
                            </View>
                            <View style={styles.table__body__tipo}>
                                <Text style={styles.table__text__body}></Text>
                            </View>
                            <View style={styles.table__body__descripcion}>
                                <Text style={styles.table__text__body}></Text>
                            </View>
                            <View style={[styles.table__body__descripcion, styles.table__border]}>
                                <Text style={styles.table__text__body}>TOTALES PESO:</Text>
                            </View>
                            <View style={[styles.table__body__peso, styles.table__border]}>
                                <Text style={styles.table__text__body}>{sumaPesoBruto.toFixed(4)}</Text>
                            </View>
                            <View style={[styles.table__body__peso, styles.table__border]}>
                                <Text style={styles.table__text__body}>{sumaPesoNeto.toFixed(4)}</Text>
                            </View>
                        </View>
                    </>
                    }
                </View>
            </View>
        </View>
    )
}

const getTableCancelaciones = (cancelaciones) => {
    let sumaIntDiario = 0.00;
    let sumaIntCancelar = 0.00;
    let sumaIntPrestamoCancelar = 0.00;
    let sumaComision = 0.00;
    let sumaMontoTotalCancelar = 0.00;
    return (
        <View style={styles.body__container}>
            <View style={styles.body__section}>
                <View style={styles.table__container}>
                    <Text style={styles.table__title}>LISTADO DE CANCELACIONES</Text>
                    {/*Header*/}
                    <View style={styles.table__row__container}>
                        <View style={styles.table__header__linea}>
                            <Text style={styles.table__text__header__cancelacion}>Linea</Text>
                        </View>
                        <View style={styles.table__header__fechaVencimiento}>
                            <Text style={styles.table__text__header__cancelacion}>Fecha Vencimiento</Text>
                        </View>
                        <View style={styles.table__header__montoPrestamo}>
                            <Text style={styles.table__text__header__cancelacion}>Monto Prestamo</Text>
                        </View>
                        <View style={styles.table__header__mntIntereses}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Intereses</Text>
                        </View>
                        <View style={styles.table__header__tipoCancelacion}>
                            <Text style={styles.table__text__header__cancelacion}>Tipo Cancelación</Text>
                        </View>
                        <View style={styles.table__header__fechaCancelacion}>
                            <Text style={styles.table__text__header__cancelacion}>Fecha Cancelación</Text>
                        </View>
                        <View style={styles.table__header__diasTranscurridos}>
                            <Text style={styles.table__text__header__cancelacion}>Días Transcurridos</Text>
                        </View>
                        <View style={styles.table__header__mtInteresDiario}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Intereses Diario</Text>
                        </View>
                        <View style={styles.table__header__mntInteresesCancelar}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Intereses a Cancelar</Text>
                        </View>
                        <View style={styles.table__header__mntPrestamoCancelar}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Prestamo a Cancelar</Text>
                        </View>
                        <View style={styles.table__header__mntComision}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Comisión</Text>
                        </View>
                        <View style={styles.table__header__mntTotalCancelar}>
                            <Text style={styles.table__text__header__cancelacion}>Mnt. Total Cancelar</Text>
                        </View>
                        <View style={styles.table__header__observaciones}>
                            <Text style={styles.table__text__header__cancelacion}>Observaciones</Text>
                        </View>
                        <View style={styles.table__header__estado}>
                            <Text style={styles.table__text__header__cancelacion}>Estado</Text>
                        </View>
                    </View>
                    {/*Body*/}
                    {cancelaciones.map((item, index) => {
                        sumaIntDiario += item.n_montointeresesdiario ? Number(item.n_montointeresesdiario) : 0;
                        sumaIntCancelar += item.n_montointeresescancelar ? Number(item.n_montointeresescancelar) : 0;
                        sumaIntPrestamoCancelar += item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar) : 0;
                        sumaComision += item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar) : 0;
                        sumaMontoTotalCancelar += item.n_montototalcancelar ? Number(item.n_montototalcancelar) : 0;
                        return (
                            <View style={styles.table__row__container} key={index}>
                                <View style={[styles.table__body__linea, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.n_linea}</Text>
                                </View>
                                <View style={[styles.table__body__fechaVencimiento, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.d_fechavencimiento_format}</Text>
                                </View>
                                <View style={[styles.table__body__montoPrestamo, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{separator(item.n_montoprestamo)}</Text>
                                </View>
                                <View style={[styles.table__body__mntIntereses, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{separator(item.n_montointereses)}</Text>
                                </View>
                                <View style={[styles.table__body__tipoCancelacion, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.c_tipocancelacion}</Text>
                                </View>
                                <View style={[styles.table__body__fechaCancelacion, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.d_fechacancelacion_format}</Text>
                                </View>
                                <View style={[styles.table__body__diasTranscurridos, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.n_diastranscurridos}</Text>
                                </View>
                                <View style={[styles.table__body__mtInteresDiario, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{item.n_montointeresesdiario ? separator(item.n_montointeresesdiario) : "0.00"}</Text>
                                </View>
                                <View style={[styles.table__body__mntInteresesCancelar, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{item.n_montointeresescancelar ? separator(item.n_montointeresescancelar) : "0.00"}</Text>
                                </View>
                                <View style={[styles.table__body__mntPrestamoCancelar, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{item.n_montoprestamocancelar ? separator(item.n_montoprestamocancelar) : "0.00"}</Text>
                                </View>
                                <View style={[styles.table__body__mntComision, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{item.n_montocomisioncancelar ? separator(item.n_montocomisioncancelar) : "0.00"}</Text>
                                </View>
                                <View style={[styles.table__body__mntTotalCancelar, styles.table__border]}>
                                    <Text style={styles.table__text__body__right}>{item.n_montototalcancelar ? separator(item.n_montototalcancelar) : "0.00"}</Text>
                                </View>
                                <View style={[styles.table__body__observaciones, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.c_observacionescancelar}</Text>
                                </View>
                                <View style={[styles.table__body__estado, styles.table__border]}>
                                    <Text style={styles.table__text__body}>{item.c_estado}</Text>
                                </View>
                            </View>
                        )
                    })}
                    <View style={styles.table__row__container}>
                        <View style={styles.table__body__linea}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                        <View style={styles.table__body__fechaVencimiento}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                        <View style={styles.table__body__montoPrestamo}>
                            <Text style={styles.table__text__body__right}></Text>
                        </View>
                        <View style={styles.table__body__mntIntereses}>
                            <Text style={styles.table__text__body__right}></Text>
                        </View>
                        <View style={styles.table__body__tipoCancelacion}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                        <View style={styles.table__body__fechaCancelacion}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                        <View style={[styles.table__body__diasTranscurridos, styles.table__border]}>
                            <Text style={styles.table__text__body}>TOTALES:</Text>
                        </View>
                        <View style={[styles.table__body__mtInteresDiario, styles.table__border]}>
                            <Text style={styles.table__text__body__right}>{separator(sumaIntDiario.toFixed(2))}</Text>
                        </View>
                        <View style={[styles.table__body__mntInteresesCancelar, styles.table__border]}>
                            <Text style={styles.table__text__body__right}>{separator(sumaIntCancelar.toFixed(2))}</Text>
                        </View>
                        <View style={[styles.table__body__mntPrestamoCancelar, styles.table__border]}>
                            <Text style={styles.table__text__body__right}>{separator(sumaIntPrestamoCancelar)}</Text>
                        </View>
                        <View style={[styles.table__body__mntComision, styles.table__border]}>
                            <Text style={styles.table__text__body__right}>{separator(sumaComision.toFixed(2))}</Text>
                        </View>
                        <View style={[styles.table__body__mntTotalCancelar, styles.table__border]}>
                            <Text style={styles.table__text__body__right}>{separator(sumaMontoTotalCancelar.toFixed(2))}</Text>
                        </View>
                        <View style={styles.table__body__observaciones}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                        <View style={styles.table__body__estado}>
                            <Text style={styles.table__text__body}></Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const CancelacionesPdfComponent = ({cancelaciones=[], prestamo, productos, estadosPrestamo, productosConPeso}) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            {prestamo && (
                <>
                    {getHeaderPage(prestamo)}
                    {getPrestamoData(prestamo, estadosPrestamo)}
                    {getTableProductos(productos, productosConPeso)}
                    {getTableCancelaciones(cancelaciones)}
                </>
            )}
        </Page>
    </Document>
)

export default CancelacionesPdfComponent