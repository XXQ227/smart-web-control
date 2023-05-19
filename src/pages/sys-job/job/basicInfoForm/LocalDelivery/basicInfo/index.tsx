import React, {useState} from 'react';
import {ProCard, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Col, Row, InputNumber, Select, Divider} from 'antd';
import {rowGrid} from '@/utils/units';
import styles from "@/pages/sys-job/job/basicInfoForm/style.less";
import ContainerLayout from "@/pages/sys-job/job/basicInfoForm/LocalDelivery/basicInfo/ContainerLayout";

interface Props {
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
    CTNPlanList?: APIModel.ContainerList[],
    NBasicInfo: APIModel.NBasicInfo,
}

const { Option } = Select;

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        batchNo, data,
        CTNPlanList, NBasicInfo
    } = props;

    const [isContainer, setIsContainer] = useState(data?.vehicleType === '集装箱运输货车');

    const selectAfter = (
        <Select defaultValue="KG" style={{ width: 70 }}>
            <Option value="KG">KG</Option>
        </Select>
    );

    return (
        <div style={{ marginTop: 20 }}>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={5} className={'custom-input'}>
                    <ProFormText
                        name={`shipmentNo${batchNo}`}
                        initialValue={data?.shipmentNo}
                        label="Shipment No."
                    />
                    <label>G.W.</label>
                    <InputNumber
                        name={`grossWeight${batchNo}`}
                        addonAfter={selectAfter}
                        defaultValue={data?.grossWeight}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={5}>
                    <ProFormSelect
                        name={`truckingCompany${batchNo}`}
                        label="Trucking Company"
                        initialValue={data?.truckingCompany}
                        options={[
                            {label: '深圳鸿邦物流', value: '深圳鸿邦物流'},
                            {label: '威盛运输企业有限公司', value: '威盛运输企业有限公司'},
                            {label: '招商局建瑞运输有限公司', value: '招商局建瑞运输有限公司'},
                        ]}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            name={`Measurement${batchNo}`}
                            initialValue={data?.measurement}
                            label="Meas. (cbm)"
                        />
                        <ProFormText
                            name={`Pieces${batchNo}`}
                            initialValue={data?.pieces}
                            label="QTY."
                        />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={5}>
                    <ProFormSelect
                        name={`TransportVehicleType${batchNo}`}
                        label="Transport Vehicle Type"
                        // initialValue={data?.vehicleType}
                        initialValue={data?.vehicleType}
                        options={[
                            {label: '平板货车 platform truck(flat bed truck)', value: '平板货车'},
                            {label: '通用货车 general -purpose vehicle', value: '通用货车'},
                            {label: '集装箱运输货车 container carrier', value: '集装箱运输货车'},
                            {label: '厢式货车 van', value: '厢式货车'},
                        ]}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            name={`plateNo${batchNo}`}
                            initialValue={data?.plateNo}
                            label="License Plate No."
                        />
                        <ProFormText
                            name={`driverName${batchNo}`}
                            initialValue={data?.driverName}
                            label="Driver Name"
                        />
                    </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {
                    isContainer ?
                        <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={5}>
                            <ProFormText
                                name={`receivingContac${batchNo}`}
                                initialValue={data?.receivingContac}
                                label="Receiving Contac"
                            />
                            <ProFormText
                                name={`phone${batchNo}`}
                                initialValue={data?.phone}
                                label="Telephone"
                            />
                        </Col>
                        : null
                }
            </Row>

            {
                isContainer ?
                    <ContainerLayout
                        CTNPlanList={CTNPlanList}
                        NBasicInfo={NBasicInfo}
                        batchNo={batchNo}
                        data={data}
                    />
                    : null
            }

            <ProCard
                className={styles.remark}
                title={'Remark'}
                headerBordered
                collapsible
            >

            </ProCard>

        </div>
        /*<ProCard
            title={title}
            bordered={true}
            className={styles.proFormBasicInfo}
            headerBordered
            collapsible
        >
            {/!*<Tabs
                type="editable-card"
                activeKey={tabList.length > 0 ? tabList[0].key : undefined}
                onChange={handleTabChange}
                onEdit={onEdit}
            >
                {tabList.map(tab => (
                    <Tabs.TabPane key={tab.key} tab={tab.label} closable={tab.closable}>
                        {tab.content}
                    </Tabs.TabPane>
                ))}
            </Tabs>*!/}
            {/!*<Tabs
                type="editable-card"
                onChange={handleTabChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={tabList}
            />*!/}
            {/!*<Tabs
                type="editable-card"
                onEdit={onEdit}
            >
                {batchData.map((batch, index) => (
                    <TabPane tab={`Batch ${index + 1}`} key={index}>
                        <ProFormText
                            name="ShipmentNo"
                            initialValue={batch.shipmentNo}
                            label="Shipment No."
                        />

                    </TabPane>
                ))}
            </Tabs>*!/}
            {/!*<Row gutter={rowGrid}>
                <Col>
                    <Tabs
                        type="editable-card"
                        onChange={handleTabChange}
                        activeKey={activeKey}
                        onEdit={onEdit}
                        items={tabList}
                    />
                </Col>
            </Row>*!/}
        </ProCard>*/
    )
}
export default BasicInfo;