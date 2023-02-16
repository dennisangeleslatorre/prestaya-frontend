import {React, useState, useRef} from 'react'
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tooltip  } from 'antd';
import Highlighter from 'react-highlight-words';

const SearchComponentTable = ({flujosCajaDetalleTabla=[], rowSelection, selectedRowKeys=[] }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
            style={{
                padding: 8,
            }}
            >
            <Input
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{
                marginBottom: 8,
                display: 'block',
                }}
            />
            <Space>
                <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                    width: 90,
                }}
                >
                Search
                </Button>
                <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                    width: 90,
                }}
                >
                Reset
                </Button>
                <Button
                type="link"
                size="small"
                onClick={() => {
                    confirm({
                    closeDropdown: false,
                    });
                    setSearchText(selectedKeys[0]);
                    setSearchedColumn(dataIndex);
                }}
                >
                Filter
                </Button>
            </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
            style={{
                color: filtered ? '#1890ff' : undefined,
            }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
            ) : (
            text
            ),
    });
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            ellipsis: {
                showTitle: false,
            },
            width: 130,
        },{
            title: 'Fecha',
            dataIndex: 'd_fechamov_format',
            ellipsis: {
                showTitle: false,
            },
            width: 140,
            ...getColumnSearchProps('d_fechamov_format'),
        },{
            title: 'Observaciones',
            dataIndex: 'c_observaciones',
            ellipsis: {
                showTitle: true,
            },
            width: 200,
            render: (c_observaciones) => (
                <Tooltip placement="topLeft" title={c_observaciones}>
                    {c_observaciones}
                </Tooltip>
            ),
        },{
            title: 'Estado',
            dataIndex: 'c_estado_desc',
            ellipsis: {
                showTitle: false,
            },
            width: 130,
        },{
            title: 'Saldo',
            dataIndex: 'saldodia',
            ellipsis: {
                showTitle: false,
            },
            width: 130,
            render: (saldo) => (
                <span className='justify-content-end d-flex'>{Number(saldo).toFixed(2)}</span>
            )
        },{
            title:() => <label className='text-audit-table'>U. Registro</label>,
            dataIndex: 'c_usuarioregistro',
            ellipsis: {
                showTitle: false,
            },
            width: 155,
            className: 'table-audit-column text-audit-table',
        },{
            title:() => <label className='text-audit-table'>F. Registro</label>,
            dataIndex: 'd_fecharegistro',
            ellipsis: {
                showTitle: false,
            },
            width: 180,
            className: 'table-audit-column text-audit-table',
        },{
            title:() => <label className='text-audit-table'>U. Modificación</label>,
            dataIndex: 'c_ultimousuario',
            ellipsis: {
                showTitle: false,
            },
            width: 155,
            className: 'table-audit-column text-audit-table',
        },{
            title:() => <label className='text-audit-table'>F. Modificación</label>,
            dataIndex: 'd_ultimafechamodificacion',
            ellipsis: {
                showTitle: false,
            },
            width: 180,
            className: 'table-audit-column text-audit-table',
        }
    ]

    return (
        <Table
            classForm
            rowSelection={{
                type: "radio",
                ...rowSelection,
                selectedRowKeys,
            }}
            columns={columns}
            dataSource={flujosCajaDetalleTabla}
            pagination={{ pageSize: 50 }}
        />
    )
}

export default SearchComponentTable