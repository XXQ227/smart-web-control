import React from 'react';
import styles from "@/pages/sys-job/job/style.less";
import {Col, Divider, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {
    ProCard,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText
} from "@ant-design/pro-components";
import {getUserID} from "@/utils/auths";
import SearchProFormSelect from "@/components/SearchProFormSelect";

interface Props {
    title: string,
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
}

const Basic: React.FC<Props> = (props) => {
    const  {
        Carrier, HouseBill
    } = props;
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={styles.seaExportBasic}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* MB/L No.、HB/L No. */}
                <Col xs={24} sm={24} md={24} lg={8} xl={5} xxl={4}>
                    <ProFormText
                        name="MBOLNum"
                        label="MB/L No."
                        placeholder=""
                        initialValue={Carrier?.MBOLNum}
                    />
                    <ProFormText
                        name="HBOLNum"
                        label="HB/L No."
                        placeholder=""
                        initialValue={Carrier?.HBOLNum}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={10}>
                    {/* 换单代理、船公司 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                required={false}
                                label="Switch B/L Agent"
                                id={'BookingAgentID'}
                                name={'BookingAgentID'}
                                url={'/apiLocal/MCommon/GetCTNameShortByStrOrType'}
                                valueObj={{value: Carrier?.BookingAgentID, label: Carrier?.BookingAgentName}}
                                query={{
                                    UserID: getUserID(),
                                    CTType: 2,
                                    CTTypeItemID: 4,
                                    SystemID: 4
                                }}
                                // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                required={false}
                                label="Shipping Line (Carrier)"
                                id={'FreighterID'}
                                name={'FreighterID'}
                                url={'/apiLocal/MCommon/GetCTNameShortByStrOrType'}
                                valueObj={{value: Carrier?.FreighterID, label: Carrier?.FreighterName}}
                                query={{
                                    UserID: getUserID(),
                                    CTType: 2,
                                    CTTypeItemID: 5,
                                    SystemID: 4
                                }}
                                // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                            />
                        </Col>
                    </Row>
                    {/* 船名、航次、B/L Type */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormText
                                name="VesselName"
                                label="Vessel Name"
                                placeholder=""
                                initialValue={Carrier?.VesselName}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormText
                                name="VoyageNum"
                                label="Voyage"
                                placeholder=""
                                initialValue={Carrier?.VoyageNum}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormSelect
                                name="SignMethodID"
                                label="B/L Type"
                                initialValue={{ value: HouseBill?.SignMethodID || 2 }}
                                options={[
                                    {label: 'Original B/L', value: 1},
                                    {label: 'Telex Release', value: 2},
                                    {label: 'Sea Waybill', value: 3},
                                ]}
                            />
                        </Col>
                    </Row>
                </Col>
                {/* 外港代理、外贸合同号 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
                    <SearchProFormSelect
                        qty={5}
                        isShowLabel={true}
                        required={false}
                        label="POL Agent"
                        id={'POLAgentID'}
                        name={'POLAgentID'}
                        url={'/apiLocal/MCommon/GetCTNameShortByStrOrType'}
                        valueObj={{value: Carrier?.BookingAgentID, label: Carrier?.BookingAgentName}}
                        query={{
                            UserID: getUserID(),
                            CTType: 2,
                            CTTypeItemID: 4,
                            SystemID: 4
                        }}
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                    <ProFormText
                        name="tradeContractNum"
                        label="Trade Contract No."
                        placeholder=""
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* 业务完成日 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4} className={styles.completeDate}>
                    <ProFormDatePicker
                        width="md"
                        name="LockDate"
                        label="COMPLETE DATE"
                        placeholder=""
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Basic;