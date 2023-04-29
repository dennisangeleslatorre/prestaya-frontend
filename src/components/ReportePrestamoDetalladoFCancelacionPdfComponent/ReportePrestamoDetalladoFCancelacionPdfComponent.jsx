import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment'
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
        width: '1.17cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__column__cod: {
        width: '1.41cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__column__short: {
        width: '1.08cm',
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
        width: '1.17cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__body__column__cod: {
        width: '1.41cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__body__column__short: {
        width: '1.08cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__body__column__without__border: {
        width: '1.17cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px'
    },
    table__body__column__cod__without__border: {
        width: '1.41cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px'
    },
    table__body__column__short__without__border: {
        width: '1.08cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px'
    },
    //Textos
    table__text__header: {
        fontSize: '0.24cm',
        textAlign: 'center'
    },
    table__text__body: {
        fontSize: '0.19cm',
        textAlign: 'center'
    },
})

const getHeader = () => (
    <View style={styles.table__row__container}>
    <View style={styles.table__header__column__cod}>
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
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Moneda</Text>
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
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Dias PT</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>F. Vcto. Reprog.</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>F. Cancelacion</Text>
    </View>
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>D. Venc</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Vencido</Text>
    </View>

    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Tipo CA.</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Fecha CA DET</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Interes Cancelado</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto P. Can</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto Comi. Can</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto Total Ca.</Text>
    </View>

    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Estado</Text>
    </View>
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Agencia</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Producto</Text>
    </View>
</View>
);

const getColumns = (lineasReporte) => {
    let agencia = '';
    let prestamo = '';
    let compania = '';
    return lineasReporte.map((item, index) => {
        let isNotBlank = true;
        if(agencia === item.c_agenciadesc && prestamo === item.c_prestamo && compania === item.c_compania) isNotBlank = false;
        else {
            agencia = item.c_agenciadesc;
            prestamo = item.c_prestamo;
            compania = item.c_compania;
        }
        return (
            <View style={styles.table__row__container} key={'linea'+index}>
                <View style={styles.table__body__column__cod}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.c_prestamo : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.n_cliente : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.c_nombrescompleto : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? (item.d_fechadesembolso ? moment(item.d_fechadesembolso).format("DD/MM/yyyy") : "") : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? (item.d_fechavencimientoprestamo ? moment(item.d_fechavencimientoprestamo).format("DD/MM/yyyy") : "") : ""}</Text>
                </View>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? item.c_monedaprestamo : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? separator(Number(item.n_montoprestamo).toFixed(2)) : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? separator(Number(item.n_montointereses).toFixed(2)) : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? separator(Number(item.n_montototalprestamopres).toFixed(2)) : ""}</Text>
                </View>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? item.n_diastranscurridos : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>
                        { isNotBlank ? (item.d_fechavencimiento_reprog ? moment(item.d_fechavencimiento_reprog).format('DD/MM/yyyy'): '') : ""}
                    </Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlank ? (item.d_fechacancelacion ? moment(item.d_fechacancelacion).format('DD/MM/yyyy'): '') : ""}</Text>
                </View>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.DIAS_VENCIDOS : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.VENCIDOS : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{item.c_tipocancelacion}</Text>
                </View>

                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>
                        {item.d_fechacancelaciondet ? moment(item.d_fechacancelaciondet).format('DD/MM/yyyy') : ''}
                    </Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{separator(Number(item.n_montointeresescancelar).toFixed(2))}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{separator(Number(item.n_montoprestamocancelar).toFixed(2))}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{separator(Number(item.n_montocomisioncancelar).toFixed(2))}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{separator(Number(item.n_montototalcancelar).toFixed(2))}</Text>
                </View>

                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.estado_prestamo : ""}</Text>
                </View>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.c_agenciadesc : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlank ? item.c_descripcionproducto : ""}</Text>
                </View>
            </View>
        )
    })
}

const getSumas = (element) => (
    <View style={styles.table__row__container}>
        <View style={styles.table__body__column__cod__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>

        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>TOTALES</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{separator(Number(element.suma_montointerescancelar).toFixed(2))}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{separator(Number(element.suma_montoprestamocancelar).toFixed(2))}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{separator(Number(element.suma_montocomisioncancelar).toFixed(2))}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{separator(Number(element.suma_montototalcancelar).toFixed(2))}</Text>
        </View>

        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
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

const ReportePrestamoDetalladoFCancelacionPdfComponent = ({element, general}) => (
    <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
        <View fixed style={styles.header__container}>
            <Text style={styles.title__company}>{element.compania}</Text>
            <View style={styles.title_container}>
                <Text style={styles.title__reportname}>REPORTE DE PRESTAMOS DETALLADO POR PERIODO</Text>
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

export default ReportePrestamoDetalladoFCancelacionPdfComponent