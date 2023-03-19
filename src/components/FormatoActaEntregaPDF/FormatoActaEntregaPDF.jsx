import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Line, Image } from '@react-pdf/renderer';
import moment from 'moment';
import Logo from '../../assets/images/logo_login.png'
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

// Create styles
const styles = StyleSheet.create({
    image: {
        objectFit: 'contain',
        height: '1.0cm',
        marginRight:'1.6cm'
    },
    page: {
        backgroundColor: 'white',
        padding:'1.5cm',
    },
    title__container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    title__text: {
        fontSize: '0.5cm',
    },
    header__container: {
        marginTop: '0.5cm',
        width: '100%',
        display: 'flex'
    },
    row__header__container: {
        marginTop: '0.5cm',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    column__header__container: {
        width: '50%',
        display: 'flex'
    },
    row__header__container__text: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    header__text__bold: {
        fontSize: '0.35cm',
        fontFamily: 'Roboto',
        fontWeight: 'semibold'
    },
    header__text: {
        fontSize: '0.35cm',
    },
    body__container: {
        width: '100%',
        display: 'flex'
    },
    body__section: {
        width: '100%',
        display: 'flex',
        marginTop: '0.5cm'
    },
    body__subtitle__text: {
        marginLeft: '1cm',
        fontSize: '0.35cm',
        fontFamily: 'Roboto',
        fontWeight: 'bold'
    },
    body__text: {
        fontSize: '0.35cm'
    },
    body__text__bold: {
        fontSize: '0.35cm',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    body__paragrah: {
        //marginLeft: '1cm',
        fontSize: '0.35cm',
        textAlign: 'justify'
    },
    body__multi__paragraph: {
        marginLeft: '1cm',
        fontSize: '0.35cm',
        textAlign: 'justify',
        marginTop: '0.3cm'
    },
    svg_div: {
        marginTop: '0.3cm'
    },
    //table
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
    table__column__container: {
        width: '4.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__cnt: {
        width: '1cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__und: {
        width: '3.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__desc: {
        width: '5.0cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__und__dynamic__weight: {
        width: '1.9cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__desc__dynamic__weight: {
        width: '4.2cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__weight__dynamic__weight: {
        width: '2.4cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__column__container__total__dynamic__weight: {
        width: '4.2cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '9cm'
    },
    table__text: {
        fontSize: '0.35cm',
        textAlign: 'center'
    },
    table__text__header: {
        fontSize: '0.4cm',
        textAlign: 'center'
    },
    table__text__header__dynamic__weight: {
        fontSize: '0.33cm',
        textAlign: 'center'
    },
    table__text__dynamic__weight: {
        fontSize: '0.30cm',
        textAlign: 'center'
    },
    table__text__dynamic__weight__bold: {
        fontSize: '0.30cm',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
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
        borderTopWidth: 1
    }

});

const FormatoActaEntregaPDF = ({prestamo={}}) => {
  return (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.title__container}>
                <Image
                    src={Logo}
                    style={styles.image}
                />
                <Text style={styles.title__text}>ACTA DE DEVOLUCIÓN DE LA GARANTÍA</Text>
            </View>
            <View style={styles.body__container}>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            Conste por el presente documento, el Acta de Entrega y Recepción, que describen de una parte <Text style={styles.body__text__bold}>{prestamo.compania_desc}</Text> con RUC {prestamo.compania_ruc} con domicilio en {prestamo.compania_direccion}, {prestamo.compania_distrito}, representada para efectos de este instrumento por {prestamo.usuarioentrega_nombre} con DNI {prestamo.usuarioentrega_dni}, en adelante <Text style={styles.body__text__bold}>{prestamo.compania_desc}</Text> y de la otra el SR/SRA {prestamo.cliente_nombrescompleto} identificado con {prestamo.cliente_tipodocumento}: {prestamo.cliente_numerodocumento} en adelante <Text style={styles.body__text__bold}>EL CLIENTE</Text> en los términos siguientes:
                        </Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            <Text style={styles.body__text__bold}>PRIMERO: EL CLIENTE</Text> suscribió con <Text style={styles.body__text__bold}>{prestamo.compania_desc}</Text> un Contrato de Préstamos por S/{Number(prestamo.n_montoprestamo).toFixed(2)} soles de fecha {prestamo.d_fechadesembolso} constituyendo Garantía Mobiliaria sobre el bien(es) de su propiedad que se describe a continuación.
                        </Text>
                    </View>
                </View>
                <View style={styles.body__section}>
                    <View style={styles.table__container}>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container__cnt}>
                                <Text style={styles.table__text__header__dynamic__weight}>CNT</Text>
                            </View>
                            <View style={prestamo.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                <Text style={styles.table__text__header__dynamic__weight}>UND</Text>
                            </View>
                            <View style={prestamo.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                <Text style={styles.table__text__header__dynamic__weight}>TIPO</Text>
                            </View>
                            <View style={prestamo.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                <Text style={styles.table__text__header__dynamic__weight}>DESCRIPCION</Text>
                            </View>
                            <View style={prestamo.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                <Text style={styles.table__text__header__dynamic__weight}>OBSERVACIONES</Text>
                            </View>
                            { prestamo.thereWeight && <>
                                <View style={styles.table__column__container__weight__dynamic__weight}>
                                    <Text style={styles.table__text__header__dynamic__weight}>PESO BRUTO</Text>
                                </View>
                                <View style={styles.table__column__container__weight__dynamic__weight}>
                                    <Text style={styles.table__text__header__dynamic__weight}>PESO NETO</Text>
                                </View>
                            </> }
                        </View>
                        {
                            prestamo.productos?.map((item,index) => (
                                <View style={styles.table__row__container} key={index}>
                                    <View style={styles.table__column__container__cnt}>
                                        <Text style={styles.table__text__dynamic__weight}>1</Text>
                                    </View>
                                    <View style={prestamo.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.unidadmedidadesc}</Text>
                                    </View>
                                    <View style={prestamo.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.tipoproductodesc}</Text>
                                    </View>
                                    <View style={prestamo.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.c_descripcionproducto}</Text>
                                    </View>
                                    <View style={prestamo.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.c_observaciones}</Text>
                                    </View>
                                    { prestamo.thereWeight && <>
                                        <View style={styles.table__column__container__weight__dynamic__weight}>
                                            <Text style={styles.table__text__dynamic__weight}>{Number(item.n_pesobruto).toFixed(4)}</Text>
                                        </View>
                                        <View style={styles.table__column__container__weight__dynamic__weight}>
                                            <Text style={styles.table__text__dynamic__weight}>{Number(item.n_pesoneto).toFixed(4)}</Text>
                                        </View>
                                    </>}
                                </View>
                            ))
                        }
                        { prestamo.thereWeight && <View style={styles.table__row__container}>
                            <View style={styles.table__column__container__total__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>TOTALES PESO:</Text>
                            </View>
                            <View style={styles.table__column__container__weight__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>{Number(prestamo.pesobrutototal).toFixed(4)}</Text>
                            </View>
                            <View style={styles.table__column__container__weight__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>{Number(prestamo.pesonetototal).toFixed(4)}</Text>
                            </View>
                        </View> }
                    </View>
                </View>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            <Text style={styles.body__text__bold}>SEGUNDO:</Text> Considerando, que el préstamo mencionado líneas arriba ha sido cancelado en su integridad eñ día {prestamo.fechaultimacancelacion} <Text style={styles.body__text__bold}>{prestamo.compania_desc}</Text> procede a entregar a <Text style={styles.body__text__bold}>EL CLIENTE</Text> el(los) artículos descritos precedentemente, manifestando este último su conformidad.
                        </Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            <Text style={styles.body__text__bold}>TERCERO:</Text> La suscripción del presente documento constituye un reconocimiento expreso, de liberar a <Text style={styles.body__text__bold}>{prestamo.compania_desc}</Text> de cualquier responsibilidad de orden legal, que se produzca por reclamos que pudieran plantarse presente y/o futuros relacionados al artículo por <Text style={styles.body__text__bold}>estado de conversación física, funcionamiento, accesorios, cualquier otra situación particular relacionada a la custodia del artículo.</Text>
                        </Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            La persona que recoge el producto {prestamo.c_nombrepersonarecogio} con {prestamo.c_tipodocumentopr} {prestamo.c_numerodocumentopr}
                        </Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>
                            Ambas partes suscriben la presente Acta en señal de conformidad y aceptación de todos y cada uno de los términos expuestos en la misma, en {prestamo.compania_distrito} {prestamo.fechaentregaformateada}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.signatures__container}>
                <View style={styles.signature__container}>
                        <Text style={styles.signature__text}>LA EMPRESA</Text>
                </View>
                <View style={styles.signature__container}>
                        <Text style={styles.signature__text}>EL CLIENTE</Text>
                </View>
            </View>
        </Page>
    </Document>
  )
}

export default FormatoActaEntregaPDF