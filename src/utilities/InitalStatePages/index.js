//USUARIO
import MiPerfil from '../../containers/MiPerfil/MiPerfil'
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

export default{
    initialPages: [
        {
            component: MiPerfil,
            path: '/miPerfil',
            exact: true,
            name: 'MI PERFIL'
        }],
    allPages: [
        {
            component: MiPerfil,
            path: '/miPerfil',
            exact: true,
            name: 'MI PERFIL'
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
        }
    ]
}