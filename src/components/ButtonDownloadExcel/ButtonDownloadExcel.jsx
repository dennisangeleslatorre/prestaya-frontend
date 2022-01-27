import React from 'react';
import { Button } from 'antd'
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
        <Button onClick={ExportToExcel}>Export To XLSX</Button>
    )
};

export default ButtonDownloadExcel;