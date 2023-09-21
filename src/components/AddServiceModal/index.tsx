import React, { useState} from "react";
import {Modal, Button, Row, Col, Radio, Divider} from 'antd';
import {IconFont} from "@/utils/units";
import './index.less';

interface Props {
    open: boolean,
    onOk: (checkedValue: string) => void,
    onCancel: () => void,
}

interface Option {
    label: string;
    value: string;
    icon: string;
}

interface CustomRadioProps {
    option: Option;
    checked: boolean;
    disabled: boolean;
    onChange: (value: string) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ option, checked, disabled, onChange }) => {
    const handleClick = () => {
        if (!disabled) {
            onChange(option.value);
        }
    };

    return (
        <Radio.Button value={option.value} checked={checked} disabled={disabled} onClick={handleClick} >
            <IconFont type={option.icon} disabled={disabled}/>
            <label onClick={handleClick}>{option.label}</label>
        </Radio.Button>
    );
};

const AddServiceModal: React.FC<Props> = (props) => {
    const [checkedValue, setCheckedValue] = useState('');

    const handleAddService = () => {
        props.onOk(checkedValue)
        setCheckedValue('');
    }

    const handleCancel = () => {
        setCheckedValue('');
        props.onCancel()
    }

    const handleRadioChange = (value: any) => {
        setCheckedValue(value);
    }

    const options = [
        { label: 'Sea Import', value: 'sea-import', icon: 'icon-sea' },
        { label: 'Sea Export', value: 'sea-export', icon: 'icon-sea' },
        { label: 'ForeignVehicle', value: 'foreignVehicle', icon: 'icon-ForeignVehicle' },
        { label: 'Land Forwarder', value: 'land-forwarder', icon: 'icon-LandForwarder' },
        { label: 'Air Import', value: 'air-import', icon: 'icon-air' },
        { label: 'Air Export', value: 'air-export', icon: 'icon-air' },
        { label: 'Local Delivery', value: 'local-delivery', icon: 'icon-LocalDelivery' },
        { label: 'Warehouse', value: 'warehouse', icon: 'icon-Warehouse' },
        { label: 'VAS', value: 'vas', icon: 'icon-VAS' },
        { label: 'CFS', value: 'cfs', icon: 'icon-CFS' },
        { label: 'Supply Chain Finance', value: 'supply-chain-finance', icon: 'icon-SupplyChainFinance' },
        { label: 'Container Leasing', value: 'container-leasing', icon: 'icon-ContainerLeasing' },
    ];

    // 创建三个子数组，分别包含6个、4个和2个选项
    const column1Options = options.slice(0, 6);
    const column2Options = options.slice(6, 10);
    const column3Options = options.slice(10, 12);

    // 渲染单个选项
    const renderOption = (option: Option) => (
        <CustomRadio
            key={option.value}
            option={option}
            checked={checkedValue === option.value}
            onChange={handleRadioChange}
            disabled={options.indexOf(option) > 3 && options.indexOf(option) !== 6}
        />
    );

    // 渲染每一列
    const renderColumn = (columnOptions: any[]) => (
        <Col span={7} key={columnOptions[0].value}>
            <Radio.Group className="antRadio" value={checkedValue}
                         // onChange={(e) => handleRadioChange(e.target.value)}
            >
                {columnOptions.map(renderOption)}
            </Radio.Group>
        </Col>
    );

    return (
        <Modal
            className={'addServiceModal'}
            open={props.open}
            bodyStyle={{height: 500}}
            onOk={handleAddService}
            onCancel={handleCancel}
            title={'Add Service'}
            width={1000}
            footer={[
                <Button htmlType={"button"} key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button htmlType={"button"} key="submit" type="primary" disabled={!checkedValue} onClick={handleAddService}>
                    Next
                </Button>,
            ]}
        >
            <Row gutter={8}>
                {renderColumn(column1Options)}
                <Col span={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {renderColumn(column2Options)}
                <Col span={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {renderColumn(column3Options)}
            </Row>
        </Modal>
    );
};

export default AddServiceModal;
