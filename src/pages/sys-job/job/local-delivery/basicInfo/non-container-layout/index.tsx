import React from 'react';
import {ProCard, ProFormText, ProFormDateTimePicker} from '@ant-design/pro-components';
import {Col, Row, Space, Divider} from 'antd';
import styles from "@/pages/sys-job/job/style.less";
import {rowGrid} from "@/utils/units";

interface Props {
    // FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
}


const NonContainerLayout: React.FC<Props> = (props) => {
    const  {
        batchNo
    } = props;

    const Origin = () => (
        <>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <ProFormText
                        name={`Origin${batchNo}`}
                        label="Place of Origin"
                        placeholder={''}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <ProFormText
                            name={`ShippingContact${batchNo}`}
                            label="Shipping Contact"
                            placeholder={''}
                        />
                        <span className={'siteSpaceSpan'}  />
                        <ProFormText
                            name={`Origin_Telephone${batchNo}`}
                            label="Telephone"
                            placeholder={''}
                        />
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={22}>
                    <ProFormText
                        name={`OriginAddress${batchNo}`}
                        label="Origin Address"
                        placeholder={''}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width={"md"}
                        name={`PickupTimeRequired${batchNo}`}
                        label="Pickup Time (Required)"
                        initialValue={'2023-02-19 00:00:10'}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width={"md"}
                        name={`PickupTimeActual${batchNo}`}
                        label="Pickup Time (Actual)"
                        initialValue={'2023-02-18 00:00:10'}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width={"md"}
                        name={`DepartureTime${batchNo}`}
                        label="Departure Time (Warehouse)"
                        initialValue={'2023-02-19 10:00:10'}
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
                        name={`Destination${batchNo}`}
                        label="Place of Destination"
                        placeholder={''}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <ProFormText
                            name={`ReceivingContact${batchNo}`}
                            label="Receiving Contact"
                            placeholder={''}
                        />
                        <span className={'siteSpaceSpan'}  />
                        <ProFormText
                            name={`Destination_Telephone${batchNo}`}
                            label="Telephone"
                            placeholder={''}
                        />
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={22}>
                    <ProFormText
                        name={`DestinationAddress${batchNo}`}
                        label="Destination Address"
                        placeholder={''}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width={"md"}
                        name={`DeliveryTimeRequired${batchNo}`}
                        label="Delivery Time (Required)"
                        initialValue={'2023-02-19 00:00:10'}
                    />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                    <ProFormDateTimePicker
                        width={"md"}
                        name={`DeliveryTimeActual${batchNo}`}
                        label="Delivery Time (Actual)"
                        initialValue={'2023-02-18 00:00:10'}
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