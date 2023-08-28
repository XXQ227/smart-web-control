import React from 'react';
import {ProCard, ProFormText, ProFormDateTimePicker} from '@ant-design/pro-components';
import {Col, Row, Space, Divider} from 'antd';
import {rowGrid} from "@/utils/units";

interface Props {
    // FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
}


const NonContainerLayout: React.FC<Props> = () => {
    const Origin = () => (
        <>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <ProFormText
                        name='placeOfOrigin'
                        label="Place of Origin"
                        placeholder=''
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <ProFormText
                            name='shippingContact'
                            label="Shipping Contact"
                            placeholder=''
                        />
                        <span className={'siteSpaceSpan'}  />
                        <ProFormText
                            name='shippingContactTelephone'
                            label="Telephone"
                            placeholder=''
                        />
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={22}>
                    <ProFormText
                        name='originAddress'
                        label="Origin Address"
                        placeholder=''
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width='md'
                        name='requiredPickupTime'
                        label="Pickup Time (Required)"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width='md'
                        name='actualPickupTime'
                        label="Pickup Time (Actual)"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width='md'
                        name='departureTime'
                        label="Departure Time (Warehouse)"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
            </Row>
        </>
    );

    const Destination = () => (
        <>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <ProFormText
                        name='placeOfDestination'
                        label="Place of Destination"
                        placeholder=''
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <ProFormText
                            name='receivingContact'
                            label="Receiving Contact"
                            placeholder=''
                        />
                        <span className={'siteSpaceSpan'}  />
                        <ProFormText
                            name='receivingContactTelephone'
                            label="Telephone"
                            placeholder=''
                        />
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={22}>
                    <ProFormText
                        name='destinationAddress'
                        label="Destination Address"
                        placeholder=''
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width='md'
                        name='requiredDeliveryTime'
                        label="Delivery Time (Required)"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width='md'
                        name='actualDeliveryTime'
                        label="Delivery Time (Actual)"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
            </Row>
        </>
    );

    return (
        <ProCard
            className={'nonContainerLayout'}
            title={'Task'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={9}>
                    <Origin/>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={9}>
                    <Destination/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default NonContainerLayout;