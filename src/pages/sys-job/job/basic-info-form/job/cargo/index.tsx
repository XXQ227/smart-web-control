import React, {useEffect, useMemo, useState} from 'react';
import {ProCard,  ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import {Col, Row, InputNumber, Select} from 'antd';
import {rowGrid} from '@/utils/units';

const { Option } = Select;
interface Props {
    formRef?: any,
    formCurrent?: any,
    title: string,
    CargoInfo: APIModel.CargoInfo,
    NBasicInfo: APIModel.NBasicInfo,
}

const Cargo: React.FC<Props> = (props) => {
    const  {
        title,
        CargoInfo,
        NBasicInfo,
    } = props;

    const [cargoInfo, setCargo] = useState<APIModel.CargoInfo>(CargoInfo);

    useMemo(()=> {

    }, [])

    useEffect(() => {

    }, [])

    const selectAfter = (
        <Select defaultValue="KG" style={{ width: 70 }}>
            <Option value="KG">KG</Option>
        </Select>
    );
    const selectCargoValue = (
        <Select defaultValue="HKD" style={{ width: 70 }}>
            <Option value="HKD">HKD</Option>
        </Select>
    );

    return (
        <ProCard
            title={title}
            bordered={true}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={4}>
                    <ProFormRadio.Group
                        name="OceanTransportTypeID"
                        label="Cargo Type"
                        initialValue={NBasicInfo?.OceanTransportTypeID}
                        options={[
                            {
                                label: 'FCL',
                                value: 1,
                            },
                            {
                                label: 'LCL',
                                value: 2,
                            },
                            {
                                label: 'BULK',
                                value: 3,
                            },
                        ]}
                    />
                    <ProFormText
                        name="HSCode"
                        initialValue={cargoInfo?.HSCode}
                        label="HS Code"
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                    <ProFormTextArea
                        fieldProps={{rows: 5}}
                        name="DescriptionEN"
                        label="Description of Goods"
                        initialValue={cargoInfo?.Description}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                    <ProFormTextArea
                        fieldProps={{rows: 5}}
                        name="DescriptionCN"
                        label="Description of Goods (CN)"
                        initialValue={cargoInfo?.DescriptionCN}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                    <ProFormTextArea
                        fieldProps={{rows: 5}}
                        name="Mark"
                        label="Shipping Mark"
                        initialValue={cargoInfo?.Mark}
                    />
                </Col>
            </Row>
            <Row gutter={rowGrid} style={{ marginTop: 7 }}>
                <Col xs={13} sm={13} md={8} lg={7} xl={6} xxl={4} className={'custom-input'}>
                    <label>G.W.</label>
                    <InputNumber
                        addonAfter={selectAfter}
                        defaultValue={cargoInfo?.GrossWeight}
                    />
                    <label>Chargeable Weight</label>
                    <InputNumber
                        addonAfter={selectAfter}
                        defaultValue={cargoInfo?.GrossWeight}
                    />
                </Col>
                <Col xs={13} sm={13} md={8} lg={7} xl={6} xxl={4} className={'custom-input'}>
                    <label>N.W.</label>
                    <InputNumber
                        addonAfter={selectAfter}
                        defaultValue={cargoInfo?.GrossWeight}
                    />
                    <label>Cargo Value</label>
                    <InputNumber
                        addonAfter={selectCargoValue}
                        defaultValue={cargoInfo?.GrossWeight}
                    />
                </Col>
                <Col xs={13} sm={13} md={8} lg={7} xl={6} xxl={4}>
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            name="Measurement"
                            initialValue={cargoInfo?.Measurement}
                            label="Meas. (cbm)"
                        />
                        <ProFormText
                            name="Pieces"
                            initialValue={cargoInfo?.Pieces}
                            label="QTY."
                        />
                    </div>
                    <ProFormSelect
                        name="PackagingMethods"
                        label="Packaging Methods"
                        initialValue={{label: 'Wooden Boxes', value: 'Measurement'}}
                        options={[
                            {label: 'Wooden Boxes', value: 'Measurement'},
                            {label: 'Stack Pack', value: 'GrossWeight'},
                            {label: 'Palletizing', value: 'NetWeight'},
                        ]}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Cargo;