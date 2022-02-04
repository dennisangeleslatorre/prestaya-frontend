import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Line } from '@react-pdf/renderer';
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
    //header
    table__header__periodo: {
        width: '1.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__cliente: {
        width: '1.75cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__nombre: {
        width: '3.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__moneda: {
        width: '1.75cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__monto: {
        width: '2.25cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    //body
    table__body__periodo: {
        width: '1.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
    },
    table__body__cliente: {
        width: '1.75cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
    },
    table__body__nombre: {
        width: '3.5cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
    },
    table__body__moneda: {
        width: '1.75cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
    },
    table__body__monto: {
        width: '2.25cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        //borderWidth: '1px',
        margin: '0px'
    },
    //Textos
    table__text__header: {
        fontSize: '0.3cm',
        textAlign: 'center'
    },
    table__text__body: {
        fontSize: '0.25cm',
        textAlign: 'center'
    },
})

const getHeader = () => (
    <View style={styles.table__row__container}>
        <View style={styles.table__header__periodo}>
            <Text style={styles.table__text__header}>Período</Text>
        </View>
        <View style={styles.table__header__cliente}>
            <Text style={styles.table__text__header}>Cliente</Text>
        </View>
        <View style={styles.table__header__nombre}>
            <Text style={styles.table__text__header}>Nombre Completo</Text>
        </View>
        <View style={styles.table__header__moneda}>
            <Text style={styles.table__text__header}>Moneda P.</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Monto Prestamo</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Monto Intereses</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Monto Total P.</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Monto Valor Prod.</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Interes Cancelado</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Monto Prest. Cancelado</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Mnto. Comision Canc.</Text>
        </View>
        <View style={styles.table__header__monto}>
            <Text style={styles.table__text__header}>Mnto. Total Cancelado</Text>
        </View>
    </View>
);

const getColumns = (lineasReporte) => {
    return lineasReporte.map(item => {
        return (
            <>
                <View style={styles.table__body__periodo}>
                    <Text style={styles.table__text__body}>{item.c_periodo}</Text>
                </View>
                <View style={styles.table__body__cliente}>
                    <Text style={styles.table__text__body}>{item.n_cliente}</Text>
                </View>
                <View style={styles.table__body__nombre}>
                    <Text style={styles.table__text__body}>{item.c_nombrescompleto}</Text>
                </View>
                <View style={styles.table__body__moneda}>
                    <Text style={styles.table__text__body}>{item.c_monedaprestamo}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumamontoprestamo||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumamontointereses||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumamontototalprestamo||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumamontovalorproductos||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumainterecamcelado||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_montoprestamocancelado||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumacomisioncancelada||"").toFixed(2)}</Text>
                </View>
                <View style={styles.table__body__monto}>
                    <Text style={styles.table__text__body}>{Number(item.calc_sumamontototalcancelado||"").toFixed(2)}</Text>
                </View>
            </>
        )
    });
};

const getSumas = (periodo) => (
    <>
        <View style={styles.table__body__periodo}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__cliente}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__nombre}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__moneda}>
            <Text style={styles.table__text__body}>Toales x Periodo</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montoprestamo).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montointereses).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montototalprestamo).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montovalorproductos).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montointerecamcelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montoprestamocancelado).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montocomisioncancelada).toFixed(2)}</Text>
        </View>
        <View style={styles.table__body__monto}>
            <Text style={styles.table__text__body}>{Number(periodo.sumaxperiodo_montototalcancelado).toFixed(2)}</Text>
        </View>
    </>
);


const getTable = (dataPorPeriodo) => {
    const keys = Object.keys(dataPorPeriodo);
    return keys.map( key => {
        const periodo = dataPorPeriodo[key];
        return (
            <View style={styles.body__section}>
                <View style={styles.table__container}>
                    {getHeader()}
                    <View style={styles.table__row__container}>
                        {periodo.lineasReporte && getColumns(periodo.lineasReporte)}
                        {getSumas(periodo)}
                    </View>
                </View>
            </View>
        )
    })
};


const ReporteResumidoPDFComponent = ({element}) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            <View fixed style={styles.header__container}>
                <Text style={styles.title__company}>{element.compania}</Text>
                <View style={styles.title_container}>
                    <Text style={styles.title__reportname}>REPORTE RESUMIDO</Text>
                    <Text style={styles.title__reportname}>Período: del {element.periodo.periodoInicio} al {element.periodo.periodoFin}</Text>
                </View>
                <View style={styles.title__company}>
                    <Text style={styles.title__reportname}>Fecha: {moment().format('DD/MM/yyyy')}</Text>
                    <Text render={({pageNumber, totalPages}) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}/>
                </View>
            </View>
            <View style={styles.body__container}>
                {getTable(element.dataPorPeriodo)}
            </View>
        </Page>
    </Document>
)

export default ReporteResumidoPDFComponent;
