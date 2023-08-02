import React from 'react';
import {Col, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {
    ProCard,
    ProFormDatePicker,
    ProFormText
} from "@ant-design/pro-components";

interface Props {
    title: string,
    Carrier?: APIModel.Carrier,
}

const Pickup: React.FC<Props> = (props) => {
    const  {
        Carrier
    } = props;
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* 提 货/箱 地址 */}
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormText
                        label="Pickup Address"
                        placeholder=""
                        name={['pickup', 'pickupAddress']}
                        initialValue={Carrier?.PackAddress}
                    />
                </Col>
                {/* 送 货/箱 地址 */}
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                    <ProFormText
                        placeholder=""
                        label="Delivery Address"
                        name={['pickup', 'deliveryAddress']}
                        initialValue={Carrier?.DeliveryAddress}
                    />
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        placeholder=""
                        label="Pickup Date"
                        name={['pickup', 'pickupDate']}
                        initialValue={Carrier?.PODTerminalPickupDate || null}
                    />
                </Col>
                {/* 货/箱 抵港日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        placeholder=""
                        label="POL Terminal Receipt"
                        name={['pickup', 'polTerminalReceipt']}
                        initialValue={Carrier?.POLTerminalReceiptDate || null}
                    />
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        placeholder=""
                        label="Loading Date"
                        name={['pickup', 'loadingDate']}
                        initialValue={Carrier?.PackDate || null}
                    />
                </Col>
            </Row>

        </ProCard>
    )
}
export default Pickup;