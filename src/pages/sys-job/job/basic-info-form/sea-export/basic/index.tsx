import React from 'react';
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import {Col, Divider, Row, Space} from "antd";
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
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
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
                {/* 订舱代理、目的港代理 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                    <SearchProFormSelect
                        qty={5}
                        isShowLabel={true}
                        required={false}
                        label="Booking Agent"
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
                    <SearchProFormSelect
                        qty={5}
                        isShowLabel={true}
                        required={false}
                        label="Destination Agent"
                        id={'PODAgentID'}
                        name={'PODAgentID'}
                        url={'/api/MCommon/GetCTNameShortByStrOrType'}
                        valueObj={{value: Carrier?.PODAgentID, label: Carrier?.PODAgentName}}
                        query={{
                            UserID: getUserID(),
                            CTType: 2,
                            CTTypeItemID: 7,
                            SystemID: 4
                        }}
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                </Col>
                {/* 船公司、船代 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                    <SearchProFormSelect
                        qty={5}
                        isShowLabel={true}
                        required={false}
                        label="Shipping Line (Carrier)"
                        id={'FreighterID'}
                        name={'FreighterID'}
                        url={'/api/MCommon/GetCTNameShortByStrOrType'}
                        valueObj={{value: Carrier?.FreighterID, label: Carrier?.FreighterName}}
                        query={{
                            UserID: getUserID(),
                            CTType: 2,
                            CTTypeItemID: 5,
                            SystemID: 4
                        }}
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                    <SearchProFormSelect
                        qty={5}
                        isShowLabel={true}
                        required={false}
                        label="Shipping Agent"
                        id={'ShippingName'}
                        name={'ShippingName'}
                        url={'/api/MCommon/GetCTNameShortByStrOrType'}
                        // valueObj={{value: Carrier?.ShippingName, label: Carrier?.ShippingName}}
                        /*query={{
                            UserID: getUserID(),
                            CTType: 2,
                            CTTypeItemID: 5,
                            SystemID: 4
                        }}*/
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* 业务完成日 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4} className={styles.completeDate}>
                    <ProFormDatePicker
                        width="md"
                        name="LockDate"
                        label="COMPLETE DATE"
                        placeholder=""
                    />
                </Col>
            </Row>

            <Row gutter={rowGrid} style={{ marginTop: 15 }}>
                {/* 船名、船公司约号 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                    <ProFormText
                        name="VesselName"
                        label="Vessel Name"
                        placeholder=""
                        initialValue={Carrier?.VesselName}
                    />
                    <ProFormText
                        name="ContactNum"
                        label="Service Contract No."
                        placeholder=""
                        initialValue={Carrier?.ContactNum}
                    />
                </Col>
                {/* 航次、码头 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                    <ProFormText
                        name="VoyageNum"
                        label="Voyage"
                        placeholder=""
                        initialValue={Carrier?.VoyageNum}
                    />
                    <ProFormText
                        name="TERMINAL"
                        label="Wharf"
                        placeholder=""
                        initialValue={Carrier?.Terminal}
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* ETD、截关 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="ETD"
                        label="ETD"
                        initialValue={Carrier?.ETD || null}
                        placeholder=""
                    />
                    <ProFormDatePicker
                        width="md"
                        name="CutCustoms"
                        label="Closing Time"
                        initialValue={Carrier?.CutCustoms || null}
                        placeholder=""
                    />
                </Col>
                {/* ATD、截港/截重柜 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="ATD"
                        label="ATD"
                        initialValue={Carrier?.ATD || null}
                        placeholder=""
                    />
                    <ProFormDatePicker
                        width="md"
                        name="CutVGM"
                        label="CY Closing DATE"
                        initialValue={Carrier?.CutVGM || null}
                        placeholder=""
                    />
                </Col>
                {/* ETA、截提单补料 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={3}>
                    <ProFormDatePicker
                        width="md"
                        name="ETAPOD"
                        label="ETA"
                        initialValue={Carrier?.ETAPOD || null}
                        placeholder=""
                    />
                    <ProFormDatePicker
                        width="md"
                        name="CutSingle"
                        label="SI CUT OFF Time"
                        initialValue={Carrier?.CutSingle || null}
                        placeholder=""
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* B/L Type、B/L QTY、Place and Date of Issue */}
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={5}>
                    <div className={'proFormTextContainer'}>
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
                        <ProFormSelect
                            name="SignBillQTY"
                            label="B/L QTY"
                            initialValue={{ value: HouseBill?.SignBillQTY || 3 }}
                            options={[
                                {label: '0', value: 0},
                                {label: '1', value: 1},
                                {label: '2', value: 2},
                                {label: '3', value: 3},
                            ]}
                        />
                    </div>
                    <label style={{ display: 'block', marginBottom: 8 }}>Place and Date of Issue</label>
                    <Space direction="horizontal" align="center" className={styles.siteSpace}>
                        <SearchProFormSelect
                            qty={5}
                            isShowLabel={true}
                            required={false}
                            id={'IssuePlaceID'}
                            name={'IssuePlaceID'}
                            url={'/api/MCommon/GetCityByStr/'}
                            valueObj={{value: HouseBill?.IssuePlaceID, label: HouseBill?.IssuePlaceName}}
                            // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                        />
                        <span className={styles.siteSpaceSpan}/>
                        <ProFormDatePicker
                            name="IssueDate"
                            initialValue={HouseBill?.IssueDate || null}
                            placeholder=""
                        />
                    </Space>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Basic;