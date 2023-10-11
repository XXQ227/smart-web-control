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
}

const Pickup: React.FC<Props> = (props) => {
    const  {} = props;
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={'ant-card'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* 提 货/箱 地址 */}
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormText label="Pickup Address" placeholder="" name={'pickupAddress'}/>
                </Col>
                {/* 送 货/箱 地址 */}
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                    <ProFormText placeholder="" label="Delivery Address" name={'deliveryAddress'}/>
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width={'md'} placeholder="" label="Pickup Date" name={'pickupDate'}/>
                </Col>
                {/* 货/箱 抵港日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width={'md'} placeholder="" label="POL Terminal Receipt" name='polTerminalReceiptDate'/>
                </Col>
                {/* 提 货/箱 日期 */}
                <Col xs={24} sm={24} md={8} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width={'md'} placeholder="" label="Loading Date" name={'loadingDate'}/>
                </Col>
            </Row>

        </ProCard>
    )
}
export default Pickup;