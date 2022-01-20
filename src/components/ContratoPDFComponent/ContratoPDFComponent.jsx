import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';

Font.register({
    family: 'Roboto',
    src: 'https://fonts.googleapis.com/css2?family=Roboto:ital@1&display=swap',
    fontStyle: 'sans-serif',
    fontWeight: 400
})

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        padding:'1.5cm',
    },
    title__container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center'
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
    header__text: {
        fontSize: '0.35cm'
    },
    body__container: {
        width: '100%',
        display: 'flex'
    },
    body__section: {
        width: '100%',
        display: 'flex',
        marginTop: '0.8cm'
    },
    body__subtitle__text: {
        marginLeft: '1cm',
        fontSize: '0.35cm',
    },
    body__text: {
        fontSize: '0.35cm'
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
        width: '25%',
        height: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__text: {
        fontSize: '0.4cm',
        textAlign: 'center'
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

/*const arrayI = [
    {
        type: 'Monto mínimo',
        capital: 1000.00,
        interest: 10,
        total: 1100.00
    },
    {
        type: 'Pago total',
        capital: 1000.00,
        interest: 20,
        total: 1200.00
    }
]*/

const ContratoPDFComponent = ({element}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.title__container}>
                <Text style={styles.title__text}>Contrato de Préstamo</Text>
            </View>
            <View style={styles.header__container}>
                <View style={styles.row__header__container}>
                    <View style={styles.column__header__container}>
                        <Text style={styles.header__text}>Agencia       : {element.prestamo.agencianame}</Text>
                    </View>
                    <View style={styles.column__header__container}>
                        <Text style={styles.header__text}>Fecha           : {moment(element.prestamo.d_fechadesembolso).format('DD/MM/yyyy')}</Text>
                    </View>
                </View>
                <View style={styles.row__header__container}>
                    <View style={styles.column__header__container}>
                        <Text style={styles.header__text}>Cliente         : {element.prestamo.c_nombrescompleto}</Text>
                    </View>
                    <View style={styles.column__header__container}>
                        <Text style={styles.header__text}>Contrato        : {element.prestamo.c_prestamo}</Text>
                    </View>
                </View>
                <View style={styles.row__header__container}>
                    <Text style={styles.header__text}>D.O.I            : {element.prestamo.c_numerodocumento}</Text>
                </View>
                <View style={styles.row__header__container}>
                    <Text style={styles.header__text}>Dirección     : {element.prestamo.c_direccioncliente}</Text>
                </View>
            </View>
            <View style={styles.body__container}>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>I)      CONDICIONES</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <Text style={styles.body__text}>Tasa Efectiva Anual      :  {Number(element.prestamo.n_tasainteres).toFixed(2)}%</Text>
                        </View>
                        <View style={styles.column__header__container}>
                            <Text style={styles.body__text}>Moneda   :  {element.prestamo.c_monedaprestamo === "L" ? "Local" : "Extranjero"}</Text>
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <Text style={styles.body__text}>Monto del Préstamo     :  {Number(element.prestamo.n_montoprestamo).toFixed(2)}</Text>
                        </View>
                        <View style={styles.column__header__container}>
                            <Text style={styles.body__text}>Plazo       :  {Number(element.prestamo.n_diasplazo).toFixed(0)} días</Text>
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <View style={styles.column__header__container}>
                            <Text style={styles.body__text}>Fecha de Préstamo      :  {moment(element.prestamo.d_fechadesembolso).format('DD/MM/yyyy')}</Text>
                        </View>
                        <View style={styles.column__header__container}>
                            
                        </View>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__text}>Fecha de Vencimiento  :  {moment(element.prestamo.d_fechavencimiento).format('DD/MM/yyyy')}</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__text}>Pago a la fecha de vencimiento</Text>
                    </View>
                    <View style={styles.table__container}>
                        <View style={styles.table__row__container}>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}></Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>Capital</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>Interés</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>Total</Text>
                            </View>
                        </View>
                                <View style={styles.table__row__container}>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>PAGO MÍNIMO</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{Number(element.prestamo.n_montoprestamo).toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{Number(element.prestamo.n_montointereses).toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{Number(element.prestamo.n_montototalprestamo).toFixed(2)}</Text>
                                    </View>
                                </View>
                                <View style={styles.table__row__container}>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>PAGO TOTAL</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{0}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{0}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{0}</Text>
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
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>UND</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>TIPO</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>DESCRIPCION</Text>
                            </View>
                            <View style={styles.table__column__container}>
                                <Text style={styles.table__text}>OBSERVACIONES</Text>
                            </View>
                        </View>
                        {
                            element.productos.map((item,index) => (
                                <View style={styles.table__row__container} key={index}>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{item.unidadmedidadesc}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{item.tipoproductodesc}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{item.c_descripcionproducto}</Text>
                                    </View>
                                    <View style={styles.table__column__container}>
                                        <Text style={styles.table__text}>{item.c_observaciones}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View style={styles.body__section}>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>III)      CONTRATO DE PRÉSTAMOS CON GARANTIA PRENDARIA</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Conste por el presente documento Contrato de Préstamo con Garantía que celebran en una parte La Empresa EFECTI FACIL S.A.C. con RUC: ${element.compania.c_ruc} y domicilio en {element.compania.c_direccion}, en quien adelante se denominará “LA EMPRESA” y del otro cuyos datos están indicados en este contrato a quien en delante se denominará <strong>“EL CLIENTE”</strong>, en los términos y condiciones siguientes:</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>1.-INTRODUCCION</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>EFECTI FACIL S.A.C. es una empresa cuyo objetivo es otorgar dinero con GARANTIA en joyas de oro, electrodomésticos, vehículos y otros objetos de valor intrínseco dichos préstamos generan intereses, “EL CLIENTE” declara conocer y acepta voluntariamente.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>2.-DEL PRÉSTAMO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Por el presente contrato la empresa otorga a “EL CLIENTE” en calidad de préstamo una suma de dinero y recibe de este bienes en GARANTIA prendaria, según el detalle mencionado. Los bienes son propiedad de “EL CLIENTE” que entrega en prenda constituyen un lote invisible hasta la total cancelación del préstamo.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>3.-DEL CONTRATO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>Al firmar este Contrato “EL CLIENTE” declara estar conforme con todas y cada una de las clausulas y condiciones del mismo, que ha verificad que la descripción de la Prenda es correcta, que la fecha de préstamo y su vencimiento son los pactados y que lo demás en el contenido son los correctos. La empresa no aceptará una vez firmado el contrato, reclamo alguno sobre los términos, condiciones, intereses, comisiones, gastos, etc. Pactados. Asimismo, la empresa no conocerá variaciones, borrones, enmendaduras ni cualquier alteración de la información contenida en el contrato original.</Text>
                        <Text style={styles.body__multi__paragraph}>El ejemplar del contrato que se encuentra en poder de la empresa es el que tendrá valor legal para cualquier caso de duda. El Documento de Identidad es el único documento válido para reclamar la devolución de la prenda y será entregado en las mismas condiciones que fue dejado la prenda el mismo día como como máximo {element.diasDevolucionProducto} días después de realizar LA CANCELACIÓN del contrato</Text>
                        <Text style={styles.body__multi__paragraph}>“EL CLIENTE “no podrá transferir total o parcialmente los derechos derivados del presente contrato a terceros y autoriza expresamente a la empresa a ceder total y parcialmente sus derechos sobre su crédito que por el presente contrato se le otorga.</Text>
                        <Text style={styles.body__multi__paragraph}>Con respectos a electrodomésticos “LA EMPRESA” no se hace responsable de problemas y/o averías técnicas que pudieran presentar las prendas a consecuencia del excesivo de meses en custodia</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>4.-PLAZO</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>El plazo de duración del préstamo es de {Number(element.prestamo.n_diasplazo).toFixed(0)} días calendarios contados a partir de la fecha de este documento a cuyo vencimiento “EL CIENTE “para cumplir con su obligación podrá optar por algunos de las siguientes alternativas.</Text>
                        <Text style={styles.body__multi__paragraph}>a.- cancelación total del préstamo, incluyendo los intereses. Ante cual la empresa devolverá los bienes entregados en garantía.</Text>
                        <Text style={styles.body__multi__paragraph}>b.- Pago parcial o amortización del préstamo con los intereses pactados.</Text>
                        <Text style={styles.body__multi__paragraph}>c.- Renovación del préstamo previo pago de los intereses devengados.</Text>
                        <Text style={styles.body__multi__paragraph}>SOLO SE COBRARÁ PENALIDAD de S/{Number(element.montoPenalidadCancelacion).toFixed(2)}(00/100) soles, si se realizara una Cancelación de contrato en los próximos 1 a {Number(element.diasCobroPenalidad).toFixed(0)} días después de generarse el préstamo.</Text>
                        <Text style={styles.body__multi__paragraph}>          Además de los {Number(element.prestamo.n_diasplazo).toFixed(0)} días de plazo de duración del préstamo “EL PRESTATARIO” cuenta con {Number(element.diasRemate).toFixed(0)} días adicionales antes del remate de su prenda.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__subtitle__text}>5.-DECLARACION JURADA.</Text>
                    </View>
                    <View style={styles.row__header__container}>
                        <Text style={styles.body__paragrah}>“EL CLIENTE “declara bajo juramento ser el único propietario de los bienes dejados en garantía prendaria y que las características de los mismos que detallan en el contrato, realmente le corresponde y no contiene adulteraciones. De determinarse que “EL CLIENTE” no es propietario de los bienes y/o estos no son genuinos y las especificaciones declaradas en el contrato no le corresponden, asumirá toda la responsabilidad civil y/o penal que su acción amerite incluso frente a terceros en perjuicios de ser denunciado personalmente por el delito de estafa.</Text>
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
