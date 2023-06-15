import React from 'react';
import {Col, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormTextArea} from "@ant-design/pro-components";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import {getUserID} from "@/utils/auths";
import SearchSelectInput from "@/components/SearchSelectInput";

interface Props {
    title: string,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
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
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="bookingRemarkForAgent"
                        label="Booking Remark (for Agent)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="bookingRemarkForCustomer"
                        label="Booking Remark (for Customer)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                    <ProFormTextArea
                        placeholder=''
                        name="operationRemarkForSelf"
                        label="Operation Remark (for Self)"
                        fieldProps={{rows: 4}}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Remark;