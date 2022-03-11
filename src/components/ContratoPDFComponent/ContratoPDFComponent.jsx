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
        fontSize: '0.8cm'
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
        marginLeft: '1cm',
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

const ContratoPDFComponent = ({element}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.title__container}>
                <Image
                    src={Logo}
                    style={styles.image}
                />
                <Text style={styles.title__text}>Contrato de Préstamo</Text>
            </View>
            <View style={styles.header__container}>
                <View style={styles.row__header__container}>
                    <View style={styles.column__header__container}>
                        <View style={styles.row__header__container__text}>
                            <Text style={styles.header__text__bold}>Agencia        : </Text>
                            <Text style={styles.header__text}>{element.prestamo.agencianame}</Text>
                        </View>
                    </View>
                    <View style={styles.column__header__container}>
                        <View style={styles.row__header__container__text}>
                            <Text style={styles.header__text__bold}>Fecha             : </Text>
                            <Text style={styles.header__text}>{moment(element.prestamo.d_fechadesembolso).format('DD/MM/yyyy')}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.row__header__container}>
                    <View style={styles.column__header__container}>
                        <View style={styles.row__header__container__text}>
                            <Text style={styles.header__text__bold}>Cliente         : </Text>
                            <Text style={styles.header__text}>{element.prestamo.c_nombrescompleto}</Text>
                        </View>
                    </View>
                    <View style={styles.column__header__container}>
                        <View style={styles.row__header__container__text}>
                            <Text style={styles.header__text__bold}>Contrato        : </Text>
                            <Text style={styles.header__text}>{element.prestamo.c_prestamo}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.row__header__container}>
                    <View style={styles.row__header__container__text}>
                        <Text style={styles.header__text__bold}>D.O.I              : </Text>
                        <Text style={styles.header__text}>{element.prestamo.c_numerodocumento}</Text>
                    </View>
                </View>
                <View style={styles.row__header__container}>
                    <View style={styles.row__header__container__text}>
                        <Text style={styles.header__text__bold}>Dirección     : </Text>
                        <Text style={styles.header__text}>{element.prestamo.c_direccioncliente}</Text>
                    </View>
                </View>
            </View>
            <Svg style={styles.svg_div} height="1">
                <Line
                    x1="0"
                    y1="0"
                    x2="500"
                    y2="0"
                    strokeWidth={2}
                    stroke="rgb(0,0,0)"
                />
            </Svg>
            <View style={styles.body__container}>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>I)      CONDICIONES</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Tasa Efectiva Mensual  :  </Text>
                                <Text style={styles.header__text}>{Number(element.prestamo.n_tasainteres).toFixed(2)}%</Text>
                            </View>
                        </View>
                        <View style={styles.column__header__container}>
                            <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Moneda   :  </Text>
                                <Text style={styles.header__text}>{element.prestamo.c_monedaprestamo === "L" ? "Local" : "Extranjero"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Monto del Préstamo     :  </Text>
                                <Text style={styles.header__text}>{separator(Number(element.prestamo.n_montoprestamo).toFixed(2))}</Text>
                            </View>
                        </View>
                        <View style={styles.column__header__container}>
                            <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Plazo        :  </Text>
                                <Text style={styles.header__text}>{Number(element.prestamo.n_diasplazo).toFixed(0)} días</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Fecha de Préstamo       :  </Text>
                                <Text style={styles.header__text}>{moment(element.prestamo.d_fechadesembolso).format('DD/MM/yyyy')}</Text>
                            </View>
                        </View>
                        <View style={styles.column__header__container}>
                            
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Fecha de Vencimiento  :  </Text>
                                <Text style={styles.header__text}>{moment(element.prestamo.d_fechavencimiento).format('DD/MM/yyyy')}</Text>
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.row__header__container__text}>
                                <Text style={styles.header__text__bold}>Pago a la fecha de vencimiento</Text>
                        </View>
                    </View>
                    <View style={styles.table__container}>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text__header}></Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text__header}>Capital</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text__header}>Interés</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text__header}>Total</Text>
                            </View>
                        </View>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>PAGO MÍNIMO</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{0}</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{separator(Number(element.prestamo.n_montointereses).toFixed(2))}</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{separator(Number(element.prestamo.n_montointereses).toFixed(2))}</Text>
                            </View>
                        </View>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>PAGO TOTAL</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{separator(Number(element.prestamo.n_montoprestamo).toFixed(2))}</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{separator(Number(element.prestamo.n_montointereses).toFixed(2))}</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>{separator(Number(element.prestamo.n_montototalprestamo).toFixed(2))}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>II)      DETALLES DE LA GARANTIA</Text>
                    </View>
                    <View style={styles.table__container}>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container__cnt}>
                                <Text style={styles.table__text__header__dynamic__weight}>CNT</Text>
                            </View>
                            <View style={element.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                <Text style={styles.table__text__header__dynamic__weight}>UND</Text>
                            </View>
                            <View style={element.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                <Text style={styles.table__text__header__dynamic__weight}>TIPO</Text>
                            </View>
                            <View style={element.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                <Text style={styles.table__text__header__dynamic__weight}>DESCRIPCION</Text>
                            </View>
                            <View style={element.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                <Text style={styles.table__text__header__dynamic__weight}>OBSERVACIONES</Text>
                            </View>
                            { element.thereWeight && <>
                                <View style={styles.table__column__container__weight__dynamic__weight}>
                                    <Text style={styles.table__text__header__dynamic__weight}>PESO BRUTO</Text>
                                </View>
                                <View style={styles.table__column__container__weight__dynamic__weight}>
                                    <Text style={styles.table__text__header__dynamic__weight}>PESO NETO</Text>
                                </View>
                            </> }
                        </View>
                        {
                            element.productos.map((item,index) => (
                                <View style={styles.table__row__container} key={index}>
                                    <View style={styles.table__column__container__cnt}>
                                        <Text style={styles.table__text__dynamic__weight}>1</Text>
                                    </View>
                                    <View style={element.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.unidadmedidadesc}</Text>
                                    </View>
                                    <View style={element.thereWeight ? styles.table__column__container__und__dynamic__weight : styles.table__column__container__und}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.tipoproductodesc}</Text>
                                    </View>
                                    <View style={element.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.c_descripcionproducto}</Text>
                                    </View>
                                    <View style={element.thereWeight ? styles.table__column__container__desc__dynamic__weight : styles.table__column__container__desc}>
                                        <Text style={ styles.table__text__dynamic__weight}>{item.c_observaciones}</Text>
                                    </View>
                                    { element.thereWeight && <>
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
                        { element.thereWeight && <View style={styles.table__row__container}>
                            <View style={styles.table__column__container__total__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>TOTALES PESO:</Text>
                            </View>
                            <View style={styles.table__column__container__weight__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>{Number(element.pesobrutototal).toFixed(4)}</Text>
                            </View>
                            <View style={styles.table__column__container__weight__dynamic__weight}>
                                <Text style={styles.table__text__dynamic__weight__bold}>{Number(element.pesonetototal).toFixed(4)}</Text>
                            </View>
                        </View> }
                    </View>
                </View>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>III)      CONTRATO DE PRÉSTAMOS CON GARANTIA PRENDARIA</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Conste por el presente documento Contrato de Préstamo con Garantía que celebran en una parte La Empresa EFECTI FACIL S.A.C. con RUC: {element.compania.c_ruc} y domicilio en {element.compania.c_direccion} {element.compania.distrito}, en quien adelante se denominará <Text style={styles.body__text__bold}>“LA EMPRESA”</Text> y del otro cuyos datos están indicados en este contrato a quien en delante se denominará <Text style={styles.body__text__bold}>“EL CLIENTE”</Text>, en los términos y condiciones siguientes:</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>1.-INTRODUCCION</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>EFECTI FACIL S.A.C. es una empresa cuyo objetivo es otorgar dinero con GARANTIA en joyas de oro, electrodomésticos, vehículos y otros objetos de valor intrínseco dichos préstamos generan intereses, <Text style={styles.body__text__bold}>“EL CLIENTE”</Text> declara conocer y acepta voluntariamente.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>2.-DEL PRÉSTAMO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Por el presente contrato la empresa otorga a <Text style={styles.body__text__bold}>“EL CLIENTE”</Text> en calidad de préstamo una suma de dinero y recibe de <Text style={styles.body__text__bold}>este bienes</Text> en <Text style={styles.body__text__bold}>GARANTIA</Text> prendaria, según el detalle mencionado. Los bienes son propiedad de <Text style={styles.body__text__bold}>“EL CLIENTE”</Text> que entrega en prenda constituyen un lote invisible hasta la total cancelación del préstamo.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>3.-DEL CONTRATO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Al firmar este Contrato <Text style={styles.body__text__bold}>“EL CLIENTE”</Text> declara estar conforme con todas y cada una de las clausulas y condiciones del mismo, que ha verificad que la descripción de la Prenda es correcta, que la fecha de préstamo y su vencimiento son los pactados y que lo demás en el contenido son los correctos. La empresa no aceptará una vez firmado el contrato, reclamo alguno sobre los términos, condiciones, intereses, comisiones, gastos, etc. Pactados. Asimismo, la empresa no conocerá variaciones, borrones, enmendaduras ni cualquier alteración de la información contenida en el contrato original.</Text>
                        <Text style={styles.body__multi__paragraph}>El ejemplar del contrato que se encuentra en poder de la empresa es el que tendrá valor legal para cualquier caso de duda. <Text style={styles.body__text__bold}>El Documento de Identidad</Text> es el único documento válido para reclamar la devolución de la prenda y será entregado en las mismas condiciones que fue dejado la prenda el mismo día como como máximo {Number(element.diasDevolucionProducto).toFixed(0)} días después de realizar LA CANCELACIÓN del contrato</Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>“EL CLIENTE“</Text> no podrá transferir total o parcialmente los derechos derivados del presente contrato a terceros y autoriza expresamente a la empresa a ceder total y parcialmente sus derechos sobre su crédito que por el presente contrato se le otorga.</Text>
                        <Text style={styles.body__multi__paragraph}>Con respectos a electrodomésticos <Text style={styles.body__text__bold}>“LA EMPRESA”</Text> no se hace responsable de problemas y/o averías técnicas que pudieran presentar las prendas a consecuencia del excesivo de meses en custodia</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>4.-PLAZO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>El plazo de duración del préstamo es de {Number(element.prestamo.n_diasplazo).toFixed(0)} días calendarios contados a partir de la fecha de este documento a cuyo vencimiento <Text style={styles.body__text__bold}>“EL CIENTE“</Text> para cumplir con su obligación podrá optar por algunos de las siguientes alternativas.</Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>a.- cancelación total</Text> del préstamo, incluyendo los intereses. Ante cual la empresa devolverá los bienes entregados en garantía.</Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>b.- Pago parcial</Text> o amortización del préstamo con los intereses pactados.</Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>c.- Renovación</Text> del préstamo previo pago de los intereses devengados.</Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>SOLO SE COBRARÁ COMISION de S/{Number(element.montoPenalidadCancelacion).toFixed(2)}(00/100) soles ADICIONALES, si se realizara una cancelación de contrato en el mismo día de efectuarse el préstamo a {Number(element.diasCobroPenalidad).toFixed(0)} días después de generarse el préstamo.</Text></Text>
                        <Text style={styles.body__multi__paragraph}><Text style={styles.body__text__bold}>          Además de los {Number(element.prestamo.n_diasplazo).toFixed(0)} días de plazo de duración del préstamo “EL PRESTATARIO” cuenta con {Number(element.diasRemate).toFixed(0)} días adicionales antes del remate de su prenda.</Text></Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>5.-DECLARACION JURADA.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}><Text style={styles.body__text__bold}>“EL CLIENTE“</Text> declara bajo juramento ser el único propietario de los bienes dejados en garantía prendaria y que las características de los mismos que detallan en el contrato, realmente le corresponde y no contiene adulteraciones. De determinarse que <Text style={styles.body__text__bold}>“EL CLIENTE”</Text> no es propietario de los bienes y/o estos no son genuinos y las especificaciones declaradas en el contrato no le corresponden, asumirá toda la responsabilidad civil y/o penal que su acción amerite incluso frente a terceros en perjuicios de ser denunciado personalmente por el delito de estafa.</Text>
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

export default ContratoPDFComponent
