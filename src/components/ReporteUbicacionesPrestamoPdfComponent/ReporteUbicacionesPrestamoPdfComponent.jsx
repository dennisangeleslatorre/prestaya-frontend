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
        width: '1.14cm',
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
        width: '1.05cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px',
        backgroundColor: 'gray',
        color: 'white'
    },
    table__header__column__tiny: {
        width: '0.85cm',
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
        width: '1.14cm',
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
        width: '1.05cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__body__column__tiny: {
        width: '0.85cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        borderWidth: '1px',
        margin: '0px'
    },
    table__body__column__without__border: {
        width: '1.14cm',
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
        width: '1.05cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px'
    },
    table__body__column__tiny__without__border: {
        width: '0.85cm',
        minHeight: '0.7cm',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px'
    },
    //Textos
    table__text__header: {
        fontSize: '0.22cm',
        textAlign: 'center'
    },
    table__text__body: {
        fontSize: '0.18cm',
        textAlign: 'center'
    },
})

const getHeader = () => (
    <View style={styles.table__row__container}>
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Agencia</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Ubiacion</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Desc. ubicación</Text>
    </View>

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
    {/*<View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Moneda</Text>
    </View>*/}
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto Prestamo</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto Intereses</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Monto Total P.</Text>
    </View>
    {/*<View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Dias PT</Text>
    </View>*/}
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>F. Vcto. Reprog.</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>F. Cancelacion</Text>
    </View>
    <View style={styles.table__header__column__tiny}>
        <Text style={styles.table__text__header}>D. Venc</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Vencido</Text>
    </View>
    <View style={styles.table__header__column__short}>
        <Text style={styles.table__text__header}>Estado</Text>
    </View>

    <View style={styles.table__header__column__tiny}>
        <Text style={styles.table__text__header}>Linea</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Producto</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Unidad</Text>
    </View>
    <View style={styles.table__header__column__tiny}>
        <Text style={styles.table__text__header}>Cnt</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Peso Bruto</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Peso Neto</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Observaciones</Text>
    </View>
    <View style={styles.table__header__column}>
        <Text style={styles.table__text__header}>Obs. ubicación</Text>
    </View>
</View>
);

const getColumns = (lineasReporte) => {
    let agencia = '';
    let ubicacion = '';
    let prestamo = '';
    let cliente = '';
    return lineasReporte.map((item, index) => {
        let isNotBlankPrestamo = true;
        let isNotBlankUbicacion = true;
        if(prestamo === item.c_prestamo && cliente === item.n_cliente) isNotBlankPrestamo = false;
        else {
            cliente = item.n_cliente;
            prestamo = item.c_prestamo;
        }
        if(agencia === item.c_agenciadesc && ubicacion === item.c_ubicacion) isNotBlankUbicacion = false;
        else {
            agencia = item.c_agenciadesc;
            ubicacion = item.c_ubicacion;
        }
        return (
            <View style={styles.table__row__container} key={'linea'+index}>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{isNotBlankUbicacion ? item.c_agenciadesc : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlankUbicacion ? item.c_ubicacion : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlankUbicacion ? item.c_ubicaciondescripcion : ""}</Text>
                </View>

                <View style={styles.table__body__column__cod}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.c_prestamo : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.n_cliente : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.c_nombrescompleto : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? (item.d_fechadesembolso ? moment(item.d_fechadesembolso).format("DD/MM/yyyy") : "") : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? (item.d_fechavencimientoprestamo ? moment(item.d_fechavencimientoprestamo).format("DD/MM/yyyy") : "") : ""}</Text>
                </View>
                {/*<View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? item.c_monedaprestamo : ""}</Text>
                </View>*/}
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? separator(Number(item.n_montoprestapres).toFixed(2)) : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? separator(Number(item.n_montointeresespres).toFixed(2)) : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? separator(Number(item.n_montototalprestamopres).toFixed(2)) : ""}</Text>
                </View>
                {/*<View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? item.n_diastranscurridos : ""}</Text>
                </View>*/}
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>
                        { isNotBlankPrestamo ? (item.d_fechavencimiento_reprog ? moment(item.d_fechavencimiento_reprog).format('DD/MM/yyyy'): '') : ""}
                    </Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{ isNotBlankPrestamo ? (item.d_fechacancelacionmaxdet ? moment(item.d_fechacancelacionmaxdet).format('DD/MM/yyyy'): '') : ""}</Text>
                </View>
                <View style={styles.table__body__column__tiny}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.n_diasvencidos : ""}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.c_vencido : ""}</Text>
                </View>
                <View style={styles.table__body__column__short}>
                    <Text style={styles.table__text__body}>{isNotBlankPrestamo ? item.c_estadoprestamo : ""}</Text>
                </View>

                <View style={styles.table__body__column__tiny}>
                    <Text style={styles.table__text__body}>{item.n_lineaproducto}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{item.c_descripcionproducto}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{item.c_unidadmedida}</Text>
                </View>
                <View style={styles.table__body__column__tiny}>
                    <Text style={styles.table__text__body}>{Number(item.n_cantidad).toFixed(0)}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{Number(item.n_pesobruto).toFixed(4)}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{Number(item.n_pesoneto).toFixed(4)}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{item.c_observaciones}</Text>
                </View>
                <View style={styles.table__body__column}>
                    <Text style={styles.table__text__body}>{item.c_observacionubicacion||""}</Text>
                </View>
            </View>
        )
    })
}

const getSumas = (element) => (
    <View style={styles.table__row__container}>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
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
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__tiny__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__short__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>

        <View style={styles.table__body__column__tiny__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}></Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>TOTALES</Text>
        </View>
        <View style={styles.table__body__column__tiny__without__border}>
            <Text style={styles.table__text__body}>{element?.suma_cantidad}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{element?.suma_peso_bruto}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
            <Text style={styles.table__text__body}>{element?.suma_peso_neto}</Text>
        </View>
        <View style={styles.table__body__column__without__border}>
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
                {element?.lineasReporte && getColumns(element?.lineasReporte)}
                {getSumas(element)}
            </View>
        </View>
    </View>
)

const ReporteUbicacionesPrestamoPdfComponent = ({element, general}) => (
    <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
        <View fixed style={styles.header__container}>
            <Text style={styles.title__company}>{element?.compania}</Text>
            <View style={styles.title_container}>
                <Text style={styles.title__reportname}>REPORTE UBICACIONES DE PRESTAMOS</Text>
                <Text style={styles.title__reportFilters}>Agencia: {general.agencia}</Text>
                <Text style={styles.title__reportFilters}>Ubicación: {general.ubicacion}</Text>
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

export default ReporteUbicacionesPrestamoPdfComponent