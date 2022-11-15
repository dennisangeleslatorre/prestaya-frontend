import React from 'react';
import { Button, Space } from 'antd'
let xlsx = require('json-as-xlsx')

const ButtonDownloadExcel = (props) => {
    const { fileName, sheet, columns=[], content=[] } = props;

    const prepareSettings = () => {
        return {
            fileName: fileName,
            extraLength: 3, // A bigger number means that columns will be wider
            writeOptions: {}
        };
    };

    const prepareData = () => {
        let data = [];
        let element = {}
        element.sheet = sheet;
        element.columns = columns;
        element.content = content;
        data.push(element)
        return data;
    };

    const ExportToExcel = () => {
        const settings = prepareSettings();
        console.log("settings", settings);
        const data = prepareData();
        console.log("data", data);
        xlsx(data, settings)
    }

    return (
        <div className="row">
            <div className="col-12">
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={ExportToExcel}>Export To XLSX</Button>
                </Space>
            </div>
        </div>
    )
};

export default ButtonDownloadExcel;