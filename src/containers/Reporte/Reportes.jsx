import React, { useContext } from 'react'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import { Link } from 'react-router-dom'
//Context
import UserContext from '../../context/UserContext/UserContext'

const Reportes = () => {
    //Context
    const { getReportesUsuarios, getUserData } = useContext(UserContext);
    const user = getUserData();
    const reportes = getReportesUsuarios();

  return (
        <ReportContainer>
            <div className="col-12 col-md-12 text-center">
                <h2 className='title-form'>CONSULTAS {user.c_nombres}</h2>
                <div className="card-body">
                    <div className="row">
                        <div className="col table-responsive">
                            <table className="table b-table table-bordered b-table-fixed">
                                <tbody>
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td>Nombre Reporte</td>
                                        <td>Descripción Reporte</td>
                                    </tr>
                                    {/*Comercial*/}
                                    <tr>
                                        <td><b>Comercial</b></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><b>Préstamos</b></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    {
                                        [...reportes].map((item, index) => {
                                            if(item.c_tiporeporte === "CO000001" && item.n_grupo === 2) {
                                                let reporteLink = "";
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 1) reporteLink = '/reporteResumido';
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 2) reporteLink = '/reporteDetallado';
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 3) reporteLink = '/reportePrestamosVencidosyNovencidos';
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 4) reporteLink = '/reporteTransaccionesTienda';
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 5) reporteLink = '/reportePrestamoDetalladoFechaCancelacion';
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 6) reporteLink = '/reporteUbicacionesPrestamos';
                                                return (
                                                    <tr key={`CO000001_2_${index}`}>
                                                        <td></td>
                                                        <td>{item.n_reporte}</td>
                                                        <td><Link to={reporteLink}>{item.c_nombrereporte}</Link></td>
                                                        <td>{item.c_descripcionreporte}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                    <tr>
                                        <td></td>
                                        <td><b>Flujo de Caja</b></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    {
                                        [...reportes].map((item, index) => {
                                            if(item.c_tiporeporte === "CO000001" && item.n_grupo === 3) {
                                                let reporteLink = "";
                                                if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 3 && item.n_reporte === 1) reporteLink = '/reporteFlujoCajaUsuario'
                                                return (
                                                    <tr key={`CO000001_3_${index}`}>
                                                        <td></td>
                                                        <td>{item.n_reporte}</td>
                                                        <td><Link to={reporteLink}>{item.c_nombrereporte}</Link></td>
                                                        <td>{item.c_descripcionreporte}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ReportContainer>
    )
};

export default Reportes;
