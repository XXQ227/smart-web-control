import React from 'react';
import {Col, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormTextArea} from "@ant-design/pro-components";
import styles from "@/pages/sys-job/job/style.less";

interface Props {
    type?: string,
    title: string,
}

const Remark: React.FC<Props> = (props) => {

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={styles.seaExportBillOfLoading}
            headerBordered
            collapsible
        >
            <Row hidden={props.type === 'import'} gutter={rowGrid}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="agentBookingRemark"
                        label="Booking Remark (for Agent)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="customerBookingRemark"
                        label="Booking Remark (for Customer)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
            </Row>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="operationRemark"
                        label="Operation Remark (for Self)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Remark;