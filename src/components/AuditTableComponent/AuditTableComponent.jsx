import React from 'react'

const AuditTableComponent = (props) => {
    const { c_usuarioregistro="", d_fecharegistro="", c_ultimousuario="", d_ultimafechamodificacion="", usuarioRetornarPendiente="", fechaRetornarPendiente="", c_usuariovigente="", d_fechavigente="",
            c_usuarioEntrega="", d_fechaEntregaUS="", c_usuarioRemate="", d_fechaRemateUS="", c_usuarioanulacion="", d_fechaanulacion="", c_usuariocancelacion="", d_fechacancelacion="" } = props;
    return (
        <div className="col table-responsive">
            <table className="table b-table table-bordered b-table-fixed">
                {/*Body de la tabla*/}
                <tbody>
                    <tr>
                        <td className='header-data'>Usuario Registro</td>
                        <td className='header-label'>{c_usuarioregistro}</td>
                        <td className='header-data'>Fecha Registro</td>
                        <td className='header-data'>{d_fecharegistro}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Último Usuario</td>
                        <td className='header-label'>{c_ultimousuario}</td>
                        <td className='header-data'>Fecha Modificación</td>
                        <td className='header-data'>{d_ultimafechamodificacion}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Vigente</td>
                        <td className='header-label'>{c_usuariovigente}</td>
                        <td className='header-data'>Fecha Vigente</td>
                        <td className='header-data'>{d_fechavigente}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Retornar Pendiente</td>
                        <td className='header-label'>{usuarioRetornarPendiente}</td>
                        <td className='header-data'>Fecha Retornar Pendiente</td>
                        <td className='header-data'>{fechaRetornarPendiente}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Cancelación</td>
                        <td className='header-label'>{c_usuariocancelacion}</td>
                        <td className='header-data'>Fecha Cancelación</td>
                        <td className='header-data'>{d_fechacancelacion}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Entrega</td>
                        <td className='header-label'>{c_usuarioEntrega}</td>
                        <td className='header-data'>Fecha Entrega</td>
                        <td className='header-data'>{d_fechaEntregaUS}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Remate</td>
                        <td className='header-label'>{c_usuarioRemate}</td>
                        <td className='header-data'>Fecha Remate</td>
                        <td className='header-data'>{d_fechaRemateUS}</td>
                    </tr>
                    <tr>
                        <td className='header-data'>Usuario Anulación</td>
                        <td className='header-label'>{c_usuarioanulacion}</td>
                        <td className='header-data'>Fecha Anulación</td>
                        <td className='header-data'>{d_fechaanulacion}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default AuditTableComponent
