import React from 'react';
import {
    ProCard,
    ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import {Col, Row} from 'antd';
import {rowGrid} from '@/utils/units';

interface Props {
    title: string,
}

const Cargo: React.FC<Props> = (props) => {
    const {title,} = props;

    return (
        <ProCard title={title} bordered={true} headerBordered collapsible className={'ant-card'}>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                            <ProFormRadio.Group
                                label="Cargo Type"
                                name={'cargoType'}
                                // initialValue={NBasicInfo?.OceanTransportTypeID}
                                options={[
                                    {label: 'FCL', value: 1,},
                                    {label: 'LCL', value: 2,},
                                    {label: 'BULK', value: 3,},
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                            <ProFormText placeholder='' label="HS Code" name={['cargoInformationParam', 'hsCode']}/>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6} className={'custom-input'}>
                            <ProFormDigit
                                placeholder='' label={'Chargeable Weight'} min={0}
                                name={['cargoInformationParam', 'chargeableWeight']} fieldProps={{addonAfter: 'HKD'}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6} className={'custom-input'}>
                            <ProFormDigit placeholder='' label={'QTY'} name={['cargoInformationParam', 'qty']} min={0}/>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={5} className={'custom-input'}>
                            <ProFormDigit
                                placeholder='' label={'G.W.'} min={0}
                                name={['cargoInformationParam', 'grossWeight']} fieldProps={{addonAfter: 'KG'}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={5} className={'custom-input'}>
                            <ProFormDigit
                                placeholder='' label={'N.W.'} min={0}
                                name={['cargoInformationParam', 'netWeight']} fieldProps={{addonAfter: 'KG'}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={5} className={'custom-input'}>
                            <ProFormDigit
                                placeholder='' label={'Cargo Value'} min={0}
                                name={['cargoInformationParam', 'cargoValue']} fieldProps={{addonAfter: 'KG'}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={5} className={'custom-input'}>
                            <ProFormDigit
                                placeholder='' label={'Meas. (cbm)'} min={0}
                                name={['cargoInformationParam', 'measurement']} fieldProps={{addonAfter: 'CBM'}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={4}>
                            <ProFormSelect
                                placeholder=''
                                name={['cargoInformationParam', 'packagingMethodId']}
                                label="Packaging Methods"
                                options={[
                                    {label: 'Wooden Boxes', value: 1},
                                    {label: 'Stack Pack', value: 2},
                                    {label: 'Palletizing', value: 3},
                                ]}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        label='Shipping Mark'
                        fieldProps={{rows: 5}}
                        name={['cargoInformationParam', 'shippingMark']}
                        // initialValue={cargoInfo?.marks}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        fieldProps={{rows: 5}}
                        label="Description of Goods"
                        name={['cargoInformationParam', 'descriptionOfGoods']}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        fieldProps={{rows: 5}}
                        label="Description of Goods (CN)"
                        name={['cargoInformationParam', 'descriptionOfGoodsCn']}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <ProFormText hidden={true} width="md" name={['cargoInformationParam', 'id']}/>
                    <ProFormText hidden={true} width="md" name={['cargoInformationParam', 'jobId']}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Cargo;