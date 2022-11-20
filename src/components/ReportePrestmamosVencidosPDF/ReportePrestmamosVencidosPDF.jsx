import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment'

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
        display: 'flex'
    },
    body__section: {
        width: '100%',
        display: 'flex',
        marginTop: '0.5cm'
    },
    //Header
    table__header__column: {
        width: '1.19cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    //Body
    table__body__column: {
        width: '1.19cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
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
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}># Prestamo</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Cliente</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Nombre Completo</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>F. Desembolso</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>F. Vencimiento</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Moneda P.</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Monto Prestamo</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Monto Intereses</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Monto Total P.</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Dias Plazo Totales</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>F. Vcto. Reprog.</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>F. Cancelacion</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Dias Vencido</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Vencido</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Interes Cancelado</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Monto Prest. Cancelado</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Mnto. Comision Canc.</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Mnto. Total Cancelado</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Estado</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Agencia</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Producto</Text>
        </View>
        <View style={styles.table__header__column}>
            <Text style={styles.table__text__header}>Teléfono</Text>
        </View>
    </View>
);

const getColumns = (lineasReporte) => {
    return lineasReporte.map(item => (
        <View style={styles.table__row__container}>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_prestamo}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.n_cliente}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_nombrescompleto}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.d_fechadesembolso}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.d_fechavencimiento}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_monedaprestamo}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.n_montoprestamo).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.n_montointereses).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.n_montototalprestamo).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.calc_diasplazototales}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.d_fechavencimientoreprogramada}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.ultimafechacancelacionregistrada}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.calc_diasvencido}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.esvencido === 'N' ? 'NO' : 'SI'}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.calc_sumainterescancelado).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.calc_sumamontoprestamocancelado).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.calc_sumamontocomisioncancelada).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{Number(item.calc_sumamontotalcancelado).toFixed(2)}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_estado}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.agenciadesc}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_descripcionproducto}</Text>
            </View>
            <View style={styles.table__body__column}>
                <Text style={styles.table__text__body}>{item.c_telefono1}</Text>
            </View>
        </View>
    ))
}

const getSumas = (element) => (
    <View style={styles.table__row__container}>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>Totales</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montoprestamo).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>Totales</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montointereses).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montototalprestamo).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montovalorproductos).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>Totales</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_interescancelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montoprestamocancelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montocomisioncancelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}>{Number(element.suma_montototalcancelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column}>
            <Text style={styles.table__text__body}></Text>
        </View>
    </View>
)

const getTable = (element) => (
    <View style={styles.body__section}>
        <View style={styles.table__container}>
            {getHeader()}
            <View style={styles.table__row__container}>
                {element.lineasReporte && getColumns(element.lineasReporte)}
                {getSumas(element)}
            </View>
        </View>
    </View>
)

const ReporteDetalladoPDFComponent = ({element, general}) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            <View fixed style={styles.header__container}>
                <Text style={styles.title__company}>{element.compania}</Text>
                <View style={styles.title_container}>
                    <Text style={styles.title__reportname}>REPORTE VENCIDOS Y NO VENCIDOS</Text>
                    <Text style={styles.title__reportFilters}>Vencido: {general.esVencido}</Text>
                    <Text style={styles.title__reportFilters}>Fecha actual: {moment( general.fechaActual).format("DD/MM/yyyy")}</Text>
                    <Text style={styles.title__reportFilters}>Estado: {general.estado}</Text>
                </View>
                <View style={styles.title__company}>
                    <Text style={styles.title__reportname}>Fecha: {moment().format('DD/MM/yyyy')}</Text>
                    <Text render={({pageNumber, totalPages}) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}/>
                </View>
            </View>
            <View style={styles.body__container}>
                {getTable(element)}
            </View>
        </Page>
    </Document>
)

export default ReporteDetalladoPDFComponent;