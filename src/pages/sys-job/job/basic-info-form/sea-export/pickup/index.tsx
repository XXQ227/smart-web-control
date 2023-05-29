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
                <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={7}>
                    <ProFormText
                        name="PackAddress"
                        label="Pickup Address"
                        placeholder=""
                        initialValue={Carrier?.PackAddress}
                    />
                </Col>
                {/* 送 货/箱 地址 */}
                <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={7}>
                    <ProFormText
                        name="DeliveryAddress"
                        label="Delivery Address"
                        placeholder=""
                        initialValue={Carrier?.DeliveryAddress}
                    />
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="PODTerminalPickupDate"
                        label="Pickup Date"
                        initialValue={Carrier?.PODTerminalPickupDate || null}
                        placeholder=""
                    />
                </Col>
                {/* 货/箱 抵港日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="POLTerminalReceiptDate"
                        label="POL Terminal Receipt"
                        initialValue={Carrier?.POLTerminalReceiptDate || null}
                        placeholder=""
                    />
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="PackDate"
                        label="Loading Date"
                        initialValue={Carrier?.PackDate || null}
                        placeholder=""
                    />
                </Col>
            </Row>

        </ProCard>
    )
}
export default Pickup;