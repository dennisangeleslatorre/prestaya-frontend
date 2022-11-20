//USUARIO
import Home from '../../containers/Home/Home'
import Users from '../../containers/User/Users'
import UserForm from '../../containers/User/UserForm'
//PERFIL
import Perfiles from '../../containers/Perfil/Perfiles'
import PerfilForm from '../../containers/Perfil/PerfilForm'
//MAESTROS
//TIPO DE DOCUMENTO
import TiposDocumento from '../../containers/TipoDocumento/TiposDocumento'
import TipoDocumentoForm from '../../containers/TipoDocumento/TipoDocumentoForm'
//TIPO DE PRODUCTO
import TiposProducto from '../../containers/TipoProducto/TiposProducto'
import TipoProductoForm from '../../containers/TipoProducto/TipoProductoForm'
//UNIDAD DE MEDIDA
import UnidadesMedida from '../../containers/UnidadMedida/UnidadesMedida'
import UnidadMedidaForm from '../../containers/UnidadMedida/UnidadMedidaForm'
//TIPO DE PRODUCTO
import TiposMovimientosCaja from '../../containers/TipoMovimientoCaja/TiposMovimientosCaja'
import TipoMovimientoCajaForm from '../../containers/TipoMovimientoCaja/TipoMovimientoCajaForm'
//COMPAÑIA
import Companias from '../../containers/Compania/Companias'
import CompaniaForm from '../../containers/Compania/CompaniaForm'
//AGENCIA
import Agencias from '../../containers/Agencia/Agencias'
import AgenciaForm from '../../containers/Agencia/AgenciaForm'
//PAIS
import Paises from '../../containers/Pais/Paises'
import PaisForm from '../../containers/Pais/PaisForm'
//DEPARTAMENTO
import Departamentos from '../../containers/Departamento/Departamentos'
import DepartamentoForm from '../../containers/Departamento/DepartamentoForm'
//PROVINCIA
import Provincias from '../../containers/Provincia/Provincias'
import ProvinciaForm from '../../containers/Provincia/ProvinciaForm'
//DISTRITO
import Distritos from '../../containers/Distrito/Distritos'
import DistritoForm from '../../containers/Distrito/DistritoForm'
//PARAMETROS
import Parametros from '../../containers/Parametro/Parametros'
import ParametroForm from '../../containers/Parametro/ParametroForm'
//PERIODOS
import Periodos from '../../containers/Periodo/Periodos'
import PeriodoForm from '../../containers/Periodo/PeriodoForm'
//CLIENTES
import Clientes from '../../containers/Cliente/Clientes'
import ClienteForm from '../../containers/Cliente/ClienteForm'
//PRESTAMOS
import Prestamos from '../../containers/Prestamo/Prestamos'
import PrestamoForm from '../../containers/Prestamo/PrestamoForm'
//FORMATO PRÉSTAMO
import Contrato from '../../containers/Contrato/Contrato'
//CANCELACIONES
import Cancelaciones from '../../containers/Cancelar/Cancelaciones'
import FormatoRecibos from '../../containers/Cancelar/FormatoRecibos'
import FormatoCancelaciones from '../../containers/Cancelar/FormatoCancelaciones'
//REPORTE
import Reportes from '../../containers/Reporte/Reportes'
import ReporteDetallado from '../../containers/Reporte/ReporteDetallado'
import ReporteResumido from '../../containers/Reporte/ReporteResumido'
import ReporteFlujoCaja from '../../containers/Reporte/ReporteFlujoCaja'
import ReportePrestamosVencidos from '../../containers/Reporte/ReportePrestamosVencidos'
//FLUJO CAJA
import BusquedaFlujoCaja from '../../containers/FlujoCaja/BusquedaFlujoCaja'
import FormCajaChicaUsuario from '../../containers/FlujoCaja/FormCajaChicaUsuario'
import FormCajaChicaUsuarioxDiaMov from '../../containers/FlujoCaja/FormCajaChicaUsuarioxDiaMov'

export default{
    initialPages: [
        {
            component: Home,
            path: '/inicio',
            exact: true,
            name: 'INICIO'
        }],
    allPages: [
        {
            component: Home,
            path: '/inicio',
            exact: true,
            name: 'INICIO'
        },{
            component: Perfiles,
            path: '/perfiles',
            exact: true,
            name: 'PERFILES'
        },{
            component: PerfilForm,
            path: '/nuevoPerfil',
            exact: true,
            name: 'AGREGAR PERFIL'
        },{
            component: PerfilForm,
            path: '/editarPerfil/:id',
            exact: true,
            name: 'ACTUALIZAR PERFIL'
        },{
            component: PerfilForm,
            path: '/visualizarPerfil/:id',
            exact: true,
            name: 'VISUALIZAR PERFIL'
        },{
            component: Users,
            path: '/usuarios',
            exact: true,
            name: 'USUARIOS'
        },{
            component: UserForm,
            path: '/nuevoUsuario',
            exact: true,
            name: 'AGREGAR USUARIO'
        },{
            component: UserForm,
            path: '/editarUsuario/:id',
            exact: true,
            name: 'ACTUALIZAR USUARIO'
        },{
            component: UserForm,
            path: '/visualizarUsuario/:id',
            exact: true,
            name: 'VISUALIZAR USUARIO'
        },{
            component: TiposDocumento,
            path: '/tiposDocumento',
            exact: true,
            name: 'TIPOS DE DOCUMENTO'
        },{
            component: TipoDocumentoForm,
            path: '/nuevoTipoDocumento',
            exact: true,
            name: 'AGREGAR TIPO DE DOCUMENTO'
        },{
            component: TipoDocumentoForm,
            path: '/editarTipoDocumento/:id',
            exact: true,
            name: 'ACTUALIZAR TIPO DE DOCUMENTO'
        },{
            component: TipoDocumentoForm,
            path: '/visualizarTipoDocumento/:id',
            exact: true,
            name: 'VISUALIZAR TIPO DE DOCUMENTO'
        },{
            component: TiposProducto,
            path: '/tiposProducto',
            exact: true,
            name: 'TIPOS DE PRODUCTO'
        },{
            component: TipoProductoForm,
            path: '/nuevoTipoProduto',
            exact: true,
            name: 'AGREGAR TIPO DE PRODUCTO'
        },{
            component: TipoProductoForm,
            path: '/editarTipoProduto/:id',
            exact: true,
            name: 'ACTUALIZAR TIPO DE PRODUCTO'
        },{
            component: TipoProductoForm,
            path: '/visualizarTipoProduto/:id',
            exact: true,
            name: 'VISUALIZAR TIPO DE PRODUCTO'
        },{
            component: TiposMovimientosCaja,
            path: '/tiposMovimientosCaja',
            exact: true,
            name: 'TIPOS DE MOVIMIENTOS DE CAJA'
        },{
            component: TipoMovimientoCajaForm,
            path: '/nuevoTipoMovimientoCaja',
            exact: true,
            name: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA'
        },{
            component: TipoMovimientoCajaForm,
            path: '/editarTipoMovimientoCaja/:id',
            exact: true,
            name: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA'
        },{
            component: TipoMovimientoCajaForm,
            path: '/visualizarTipoMovimientoCaja/:id',
            exact: true,
            name: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA'
        },{
            component: UnidadesMedida,
            path: '/unidadesMedida',
            exact: true,
            name: 'UNIDADES DE MEDIDA'
        },{
            component: UnidadMedidaForm,
            path: '/nuevaUnidadMedida',
            exact: true,
            name: 'AGREGAR UNIDAD DE MEDIDA'
        },{
            component: UnidadMedidaForm,
            path: '/editarUnidadMedida/:id',
            exact: true,
            name: 'ACTUALIZAR UNIDAD DE MEDIDA'
        },{
            component: UnidadMedidaForm,
            path: '/visualizarUnidadMedida/:id',
            exact: true,
            name: 'VISUALIZAR UNIDAD DE MEDIDA'
        },{
            component: Companias,
            path: '/companias',
            exact: true,
            name: 'COMPAÑÍAS'
        },{
            component: CompaniaForm,
            path: '/nuevaCompania',
            exact: true,
            name: 'AGREGAR COMPAÑÍA'
        },{
            component: CompaniaForm,
            path: '/editarCompania/:id',
            exact: true,
            name: 'ACTUALIZAR COMPAÑÍA'
        },{
            component: CompaniaForm,
            path: '/visualizarCompania/:id',
            exact: true,
            name: 'VISUALIZAR COMPAÑÍA'
        },{
            component: Paises,
            path: '/paises',
            exact: true,
            name: 'PAÍSES'
        },{
            component: PaisForm,
            path: '/nuevoPais',
            exact: true,
            name: 'AGREGAR PAÍS'
        },{
            component: PaisForm,
            path: '/editarPais/:id',
            exact: true,
            name: 'ACTUALIZAR PAÍS'
        },{
            component: PaisForm,
            path: '/visualizarPais/:id',
            exact: true,
            name: 'VISUALIZAR PAÍS'
        },{
            component: Departamentos,
            path: '/departamentos',
            exact: true,
            name: 'DEPARTAMENTOS'
        },{
            component: DepartamentoForm,
            path: '/nuevoDepartamento',
            exact: true,
            name: 'AGREGAR DEPARTAMENTO'
        },{
            component: DepartamentoForm,
            path: '/editarDepartamento/:id',
            exact: true,
            name: 'ACTUALIZAR DEPARTAMENTO'
        },{
            component: DepartamentoForm,
            path: '/visualizarDepartamento/:id',
            exact: true,
            name: 'VISUALIZAR DEPARTAMENTO'
        },{
            component: Provincias,
            path: '/provincias',
            exact: true,
            name: 'PROVINCIAS'
        },{
            component: ProvinciaForm,
            path: '/nuevaProvincia',
            exact: true,
            name: 'AGREGAR PROVINCIA'
        },{
            component: ProvinciaForm,
            path: '/editarProvincia/:id',
            exact: true,
            name: 'ACTUALIZAR PROVINCIA'
        },{
            component: ProvinciaForm,
            path: '/visualizarProvincia/:id',
            exact: true,
            name: 'VISUALIZAR PROVINCIA'
        },{
            component: Distritos,
            path: '/distritos',
            exact: true,
            name: 'DISTRITOS'
        },{
            component: DistritoForm,
            path: '/nuevoDistrito',
            exact: true,
            name: 'AGREGAR DISTRITO'
        },{
            component: DistritoForm,
            path: '/editarDistrito/:id',
            exact: true,
            name: 'ACTUALIZAR DISTRITO'
        },{
            component: DistritoForm,
            path: '/visualizarDistrito/:id',
            exact: true,
            name: 'VISUALIZAR DISTRITO'
        },{
            component: Agencias,
            path: '/agencias',
            exact: true,
            name: 'AGENCIAS'
        },{
            component: AgenciaForm,
            path: '/nuevoAgencia',
            exact: true,
            name: 'AGREGAR AGENCIA'
        },{
            component: AgenciaForm,
            path: '/editarAgencia/:id',
            exact: true,
            name: 'ACTUALIZAR AGENCIA'
        },{
            component: AgenciaForm,
            path: '/visualizarAgencia/:id',
            exact: true,
            name: 'VISUALIZAR AGENCIA'
        },{
            component: Parametros,
            path: '/parametros',
            exact: true,
            name: 'PARÁMETROS'
        },{
            component: ParametroForm,
            path: '/nuevoParametro',
            exact: true,
            name: 'AGREGAR PARÁMETRO'
        },{
            component: ParametroForm,
            path: '/editarParametro/:id',
            exact: true,
            name: 'ACTUALIZAR PARÁMETRO'
        },{
            component: ParametroForm,
            path: '/visualizarParametro/:id',
            exact: true,
            name: 'VISUALIZAR PARÁMETRO'
        },{
            component: Periodos,
            path: '/periodos',
            exact: true,
            name: 'PERÍODOS'
        },{
            component: PeriodoForm,
            path: '/nuevoPeriodo',
            exact: true,
            name: 'AGREGAR PERÍODO'
        },{
            component: PeriodoForm,
            path: '/editarPeriodo/:id',
            exact: true,
            name: 'ACTUALIZAR PERÍODO'
        },{
            component: PeriodoForm,
            path: '/visualizarPeriodo/:id',
            exact: true,
            name: 'VISUALIZAR PERÍODO'
        },{
            component: Clientes,
            path: '/clientes',
            exact: true,
            name: 'CLIENTES'
        },{
            component: ClienteForm,
            path: '/nuevoCliente/:id',
            exact: true,
            name: 'AGREGAR CLIENTE'
        },{
            component: ClienteForm,
            path: '/editarCliente/:id',
            exact: true,
            name: 'ACTUALIZAR CLIENTE'
        },{
            component: ClienteForm,
            path: '/visualizarCliente/:id',
            exact: true,
            name: 'VISUALIZAR CLIENTE'
        },{
            component: Prestamos,
            path: '/prestamos',
            exact: true,
            name: 'PRÉSTAMOS'
        },{
            component: PrestamoForm,
            path: '/nuevoPrestamo/:id',
            exact: true,
            name: 'AGREGAR PRÉSTAMO'
        },{
            component: PrestamoForm,
            path: '/editarPrestamo/:id',
            exact: true,
            name: 'ACTUALIZAR PRÉSTAMO'
        },{
            component: PrestamoForm,
            path: '/visualizarPrestamo/:id',
            exact: true,
            name: 'VISUALIZAR PRÉSTAMO'
        },{
            component: PrestamoForm,
            path: '/anularPrestamo/:id',
            exact: true,
            name: 'ANULAR PRÉSTAMO'
        },{
            component: PrestamoForm,
            path: '/vigentePrestamo/:id',
            exact: true,
            name: 'VIGENTE PRÉSTAMO'
        },{
            component: PrestamoForm,
            path: '/entregarPrestamo/:id',
            exact: true,
            name: 'ENTREGAR'
        },{
            component: PrestamoForm,
            path: '/rematePrestamo/:id',
            exact: true,
            name: 'REMATE'
        },{
            component: Contrato,
            path: '/formatoPrestamo/:id',
            exact: true,
            name: 'FORMATO PRÉSTAMO'
        },{
            component: Cancelaciones,
            path: '/cancelaciones/:id',
            exact: true,
            name: 'CANCELACIONES'
        },{
            component: FormatoRecibos,
            path: '/formatoRecibos/:id/:nLineas',
            exact: true,
            name: 'FORMATO RECIBOS CANCELACIONES'
        },{
            component: FormatoCancelaciones,
            path: '/formatoCancelaciones/:id',
            exact: true,
            name: 'FORMATO CANCELACIONES'
        },{
            component: BusquedaFlujoCaja,
            path: '/flujousuarios',
            exact: true,
            name: 'FLUJO CAJA USUARIOS'
        },{
            component: FormCajaChicaUsuario,
            path: '/nuevaCajaChicaUsuario/:companycode',
            exact: true,
            name: 'NUEVA CAJA CHICA USUARIO'
        },{
            component: FormCajaChicaUsuario,
            path: '/actualizarCajaChicaUsuario/:companycode/:nrocorrelativo',
            exact: true,
            name: 'MODIFICAR CAJA CHICA USUARIO'
        },{
            component: FormCajaChicaUsuarioxDiaMov,
            path: '/nuevaCUxDiaMovimiento/:companycode',
            exact: true,
            name: 'NUEVA CAJA C. U. X DÍA MOVIMIENTOS'
        },{
            component: FormCajaChicaUsuarioxDiaMov,
            path: '/actualizarCUxDiaMovimiento/:companycode',
            exact: true,
            name: 'MODIFICAR CAJA C. U. X DÍA MOVIMIENTOS'
        },{
            component: Reportes,
            path: '/reportes',
            exact: true,
            name: 'REPORTES'
        },{
            component: ReporteDetallado,
            path: '/reporteDetallado',
            exact: true,
            name: 'REPORTE DETALLADO'
        },{
            component: ReporteResumido,
            path: '/reporteResumido',
            exact: true,
            name: 'REPORTE RESUMIDO'
        },{
            component: ReporteFlujoCaja,
            path: '/reporteFlujoCajaUsuario',
            exact: true,
            name: 'REPORTE FLUJO DE CAJA USUARIOS'
        },{
            component: ReportePrestamosVencidos,
            path: '/reportePrestamosVencidosyNovencidos',
            exact: true,
            name: 'REPORTE PRESTAMOS VENCIDOS Y NO VENCIDOS'
        }
    ]
}