import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { separator } from '../../utilities/Functions/FormatNumber';
import moment from 'moment';

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
    title__reportFilters: {
        fontSize: '0.4cm',
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
        marginTop: '0.3cm',
        width: '100%',
        display: 'flex',
    },
    table__row__container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    table__body__general__label: {
        display: 'flex',
        margin: '0px',
        marginTop: '0.3cm',
    },
    table__body__general__data: {
        display: 'flex',
        margin: '0px',
        marginTop: '0.3cm',
        marginRight: '0.3cm',
        textAlign: 'center',
        border:'1px'
    },
    table__body__general__without__margin: {
        display: 'flex',
        margin: '0px',
        marginTop: '0.3cm',
        textAlign: 'center',
        border:'1px'
    },
    //Header Table
    table__header: {
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    //Body Table
    table__data: {
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px',
    },
    //Textos
    text__info: {
        fontSize: '0.30cm',
    },
    text__info__bold: {
        fontSize: '0.32cm',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    table__text__header: {
        fontSize: '0.26cm',
        textAlign: 'center'
    },
    table__text__body: {
        fontSize: '0.22cm',
        textAlign: 'center'
    },
    table__text__body_price: {
        fontSize: '0.22cm',
        textAlign: 'right'
    }
})

const renderHeaderPDF = (general) => (
    <View fixed style={styles.header__container}>
        <Text style={styles.title__company}>{general.companianame}</Text>
        <View style={styles.title_container}>
            <Text style={styles.title__reportname}>REPORTE DE FLUJO CAJA USUARIO</Text>
            <Text style={styles.title__reportFilters}>Fecha movimiento: del {general.fechaMovimientoInicio} al {general.fechaMovimientoFinal}</Text>
            <Text style={styles.title__reportFilters}>Clase Tipo Mov: {general.clase}</Text>
            <Text style={styles.title__reportFilters}>Usuario Flujo Caja: {general.usuarioFC}</Text>
        </View>
        <View style={styles.title__company}>
            <Text style={styles.title__reportname}>Fecha: {moment().format('DD/MM/yyyy')}</Text>
            <Text render={({pageNumber, totalPages}) => (
                `Página ${pageNumber} de ${totalPages}`
            )}/>
        </View>
    </View>
)

const renderDataGeneral = (fc) => (
    <View style={styles.body__container}>
    <View style={styles.body__section}>
        <View style={styles.table__container}>
            <View style={styles.table__row__container}>
                {/*Agencia*/}
                <View style={[styles.table__body__general__label, {width:'1.4cm'}]}>
                    <Text style={styles.text__info__bold}>Agencia:</Text>
                </View>
                <View style={[styles.table__body__general__data, {width:'3.8cm'}]}>
                    <Text style={styles.text__info}>{fc.agencia}</Text>
                </View>
                {/*Usuario flujo caja*/}
                <View style={[styles.table__body__general__label, {width:'2.8cm'}]}>
                    <Text style={styles.text__info__bold}>Usuario Flujo Caja:</Text>
                </View>
                <View style={[styles.table__body__general__data, {width:'1.8cm'}]}>
                    <Text style={styles.text__info}>{fc.usuarioFlujoCaja}</Text>
                </View>
                {/*Tipo Caja Usuario*/}
                <View style={[styles.table__body__general__label, {width:'2.7cm'}]}>
                    <Text style={styles.text__info__bold}>Tipo Caja Usuario:</Text>
                </View>
                <View style={[styles.table__body__general__data, {width:'1.9cm'}]}>
                    <Text style={styles.text__info}>{fc.tipoCajaUsuario}</Text>
                </View>
                {/*Fecha Movimiento*/}
                <View style={[styles.table__body__general__label, {width:'2.8cm'}]}>
                    <Text style={styles.text__info__bold}>Fecha movimiento:</Text>
                </View>
                <View style={[styles.table__body__general__without__margin, {width:'1.9cm'}]}>
                    <Text style={styles.text__info}>{fc.fechaInicio}</Text>
                </View>
                <View style={[styles.table__body__general__data, {width:'1.9cm'}]}>
                    <Text style={styles.text__info}>{fc.fechaFin}</Text>
                </View>
                {/*Moneda*/}
                <View style={[styles.table__body__general__label, {width:'1.4cm'}]}>
                    <Text style={styles.text__info__bold}>Moneda:</Text>
                </View>
                <View style={[styles.table__body__general__without__margin, {width:'1.4cm'}]}>
                    <Text style={styles.text__info}>{fc.moneda}</Text>
                </View>
            </View>
        </View>
    </View>
</View>
)

const renderHeaderTable = () => (
    <View style={styles.table__row__container}>
        <View style={[styles.table__header, {width:'0.8cm'}]}>
            <Text style={[styles.table__text__header]}>NRO</Text>
        </View>
        <View style={[styles.table__header, {width:'1.5cm'}]}>
            <Text style={[styles.table__text__header]}>FECHA</Text>
        </View>
        <View style={[styles.table__header, {width:'2.4cm'}]}>
            <Text style={[styles.table__text__header]}>OBSERVACIONES</Text>
        </View>
        <View style={[styles.table__header, {width:'1.4cm'}]}>
            <Text style={[styles.table__text__header]}>ESTADO</Text>
        </View>
        <View style={[styles.table__header, {width:'0.8cm'}]}>
            <Text style={[styles.table__text__header]}>SEC.</Text>
        </View>
        <View style={[styles.table__header, {width:'2.7cm'}]}>
            <Text style={[styles.table__text__header]}>Tipo Movimiento</Text>
        </View>
        <View style={[styles.table__header, {width:'1.85cm'}]}>
            <Text style={[styles.table__text__header]}>Usuario Mov.</Text>
        </View>
        <View style={[styles.table__header, {width:'2.6cm'}]}>
            <Text style={[styles.table__text__header]}>Observaciones</Text>
        </View>
        <View style={[styles.table__header, {width:'1.85cm'}]}>
            <Text style={[styles.table__text__header]}>Mnt. Interes a Cancelar</Text>
        </View>
        <View style={[styles.table__header, {width:'2.1cm'}]}>
            <Text style={[styles.table__text__header]}>Mnt. Prestamo a Cancelar</Text>
        </View>
        <View style={[styles.table__header, {width:'1.85cm'}]}>
            <Text style={[styles.table__text__header]}>Mnt. Comision</Text>
        </View>
        <View style={[styles.table__header, {width:'1.8cm'}]}>
            <Text style={[styles.table__text__header]}>Mnt. Total</Text>
        </View>
        <View style={[styles.table__header, {width:'1.5cm'}]}>
            <Text style={[styles.table__text__header]}>Fuente</Text>
        </View>
        <View style={[styles.table__header, {width:'1.7cm'}]}>
            <Text style={[styles.table__text__header]}>CP</Text>
        </View>
        <View style={[styles.table__header, {width:'0.7cm'}]}>
            <Text style={[styles.table__text__header]}>%G</Text>
        </View>
        <View style={[styles.table__header, {width:'1.0cm'}]}>
            <Text style={[styles.table__text__header]}>Agencia O/D</Text>
        </View>
    </View>
)

const renderBodyTable = (fechas, indicefc, sumas) => (
    <>
        { fechas.map((fecha, indexf) => {
            return (
                <>
                    {fecha.movimientos.map((mov, indexm) => (
                        <View key={`${indexm}-${indicefc}-${fecha.fecha}-${mov.secuencia}`} style={styles.table__row__container}>
                            <View style={[styles.table__data, {width: '0.8cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{indexm > 0 ? "" : indexf+1}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.5cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{indexm > 0 ? "" : moment(fecha.fecha).format("DD/MM/yyyy")}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '2.4cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{indexm > 0 ? "" : fecha.observacion}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.4cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{indexm > 0 ? "" : (fecha.estado)}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '0.8cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.secuencia}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '2.7cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.tipomovimiento}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.usuariomov}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '2.6cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.observacion}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
                                <Text style={styles.table__text__body_price}>{mov.montointerescancelar ? separator(Number(mov.montointerescancelar).toFixed(2)) : ""}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '2.1cm', border:'1px'}]}>
                                <Text style={styles.table__text__body_price}>{mov.montoprestamocancelar ? separator(Number(mov.montoprestamocancelar).toFixed(2)) : ""}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
                                <Text style={styles.table__text__body_price}>{mov.montocomisioncancelar ? separator(Number(mov.montocomisioncancelar).toFixed(2)) : ""}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.8cm', border:'1px'}]}>
                                <Text style={[styles.table__text__body_price, mov.clasemov === 'S' ? {color:'red'} : '']}>{mov.clasemov === 'S' ? `( ${separator(Number(mov.montomov).toFixed(2))} )` : separator(Number(mov.montomov).toFixed(2))}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.5cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.fuente}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.7cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.c_prestamo}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '0.7cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{Number(mov.percent_ganancia).toFixed(2)}</Text>
                            </View>
                            <View style={[styles.table__data, {width: '1.0cm', border:'1px'}]}>
                                <Text style={styles.table__text__body}>{mov.otraagenciadesc || ""}</Text>
                            </View>
                        </View>
                    ))}
                </>
            )
        })
        }
        <View key={`${indicefc}-${sumas.suma_montointerescancelar}-${sumas.suma_montoprestamocancelar}-${sumas.suma_montocomisioncancelar}-${sumas.suma_montototalcancelar}`} style={styles.table__row__container}>
            <View style={[styles.table__data, {width: '0.8cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '1.5cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '2.4cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '1.4cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '0.8cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '2.7cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '1.85cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '2.6cm', border:'1px'}]}>
                <Text style={styles.table__text__body}>TOTALES S/. X FLUJO C.U.:</Text>
            </View>
            <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
                <Text style={styles.table__text__body_price}>{separator(Number(sumas.suma_montointerescancelar).toFixed(2))}</Text>
            </View>
            <View style={[styles.table__data, {width: '2.1cm', border:'1px'}]}>
                <Text style={styles.table__text__body_price}>{separator(Number(sumas.suma_montoprestamocancelar).toFixed(2))}</Text>
            </View>
            <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
                <Text style={styles.table__text__body_price}>{separator(Number(sumas.suma_montocomisioncancelar).toFixed(2))}</Text>
            </View>
            <View style={[styles.table__data, {width: '1.8cm', border:'1px'}]}>
                <Text style={[styles.table__text__body_price, Number(sumas.suma_montototalcancelar) < 0 && {color:'red'}]}>
                    { Number(sumas.suma_montototalcancelar) > 0 ? separator(Number(sumas.suma_montototalcancelar).toFixed(2)) : `( ${separator(Number(sumas.suma_montototalcancelar * -1).toFixed(2))} )` }
                </Text>
            </View>
            <View style={[styles.table__data, {width: '1.5cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '1.7cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '0.7cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
            <View style={[styles.table__data, {width: '1.0cm'}]}>
                <Text style={styles.table__text__body}></Text>
            </View>
        </View>
    </>
)

const renderTotales = (totalesPxC, totalesFC) => (
    <View key={"totales"} style={styles.table__row__container}>
        <View style={[styles.table__data, {width: '0.8cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '1.5cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '2.4cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '1.4cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '0.8cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '2.7cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '1.85cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '2.6cm', border:'1px'}]}>
            <Text style={styles.table__text__body}>TOTALES:</Text>
        </View>
        <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
            <Text style={styles.table__text__body_price}>{separator(Number(totalesPxC.suma_montointerescancelar + totalesFC.suma_montointerescancelar).toFixed(2))}</Text>
        </View>
        <View style={[styles.table__data, {width: '2.1cm', border:'1px'}]}>
            <Text style={styles.table__text__body_price}>{separator(Number(totalesPxC.suma_montoprestamocancelar + totalesFC.suma_montoprestamocancelar).toFixed(2))}</Text>
        </View>
        <View style={[styles.table__data, {width: '1.85cm', border:'1px'}]}>
            <Text style={styles.table__text__body_price}>{separator(Number(totalesPxC.suma_montocomisioncancelar + totalesFC.suma_montocomisioncancelar).toFixed(2))}</Text>
        </View>
        <View style={[styles.table__data, {width: '1.8cm', border:'1px'}]}>
            <Text style={[styles.table__text__body_price,  Number(totalesPxC.suma_montototalcancelar + totalesFC.suma_montototalcancelar) < 0 && {color:'red'}]}>
            {Number(totalesPxC.suma_montototalcancelar + totalesFC.suma_montototalcancelar) > 0 ?
                separator(Number(totalesPxC.suma_montototalcancelar + totalesFC.suma_montototalcancelar).toFixed(2)) :
                `( ${separator(Number((totalesPxC.suma_montototalcancelar + totalesFC.suma_montototalcancelar)*-1).toFixed(2))} )` }
            </Text>
        </View>
        <View style={[styles.table__data, {width: '1.5cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '1.7cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '0.7cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={[styles.table__data, {width: '1.0cm'}]}>
            <Text style={styles.table__text__body}></Text>
        </View>
    </View>
)

const renderTable = (movimientosFC) => {
    return movimientosFC.map((fc, index) => (
        <>
            {renderDataGeneral(fc)}
            <View key={`${index}-${fc.cod}`} style={styles.body__container}>
                <View style={styles.body__section}>
                    <View style={styles.table__container}>
                        {renderHeaderTable()}
                        {renderBodyTable(fc.fechas, index, fc.sumas)}
                    </View>
                </View>
            </View>
        </>
    ))
}

const ReporteFlujoCajaPDFComponent = ({general, movsFlujoCaja, movsPxC, totalesPxC, totalesFC}) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            {renderHeaderPDF(general)}
            {renderTable(movsFlujoCaja)}
            {renderTable(movsPxC)}
            {renderTotales(totalesPxC, totalesFC)}
        </Page>
    </Document>
)

export default ReporteFlujoCajaPDFComponent;