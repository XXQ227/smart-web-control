import React, {useState} from 'react';
import {Col, Divider, Form, Row, Space} from "antd";
import {rowGrid} from "@/utils/units";
import {
    ProCard,
    ProFormDateTimePicker ,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText
} from "@ant-design/pro-components";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import SearchTable from '@/components/SearchTable'

interface Props {
    title: string,
    form: any,
    serviceInfo: any,
}

const Basic: React.FC<Props> = (props) => {
    const {form, serviceInfo} = props;
    const [isOriginal, setIsOriginal] = useState(serviceInfo?.blTypeId === '1');

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/7/26
     * @param filedName 操作的数据字段
     * @param val       修改的值
     * @param option    其他数据
     * @returns
     */
    const handleChange = (filedName: string, val: any, option?: any) => {
        console.log(val, filedName, option);
        const setValueObj: any = {[filedName]: val};
        switch (filedName) {
            case 'bookingAgentId':
                setValueObj.bookingAgentNameCn = option?.nameFullCn;
                setValueObj.bookingAgentNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.bookingAgentOracleId = option?.oracleSupplierCode;
                break;
            case 'carrierId':
                setValueObj.carrierNameCn = option?.nameFullCn;
                setValueObj.carrierNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.carrierOracleId = option?.oracleSupplierCode;
                break;
            case 'destinationAgentId':
                setValueObj.destinationAgentNameCn = option?.nameFullCn;
                setValueObj.destinationAgentNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.destinationAgentOracleId = option?.oracleSupplierCode;
                break;
            case 'shippingAgentId':
                setValueObj.shippingAgentNameCn = option?.nameFullCn;
                setValueObj.shippingAgentNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.shippingAgentOracleId = option?.oracleSupplierCode;
                break;
            case 'placeOfIssueCode':
                setValueObj.placeOfIssueNameEn = option?.name;
                break;
            default: break;
        }
        form.setFieldsValue(setValueObj);
    }

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={'ant-card seaExportBasic'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* MB/L No.、HB/L No. */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                    <ProFormText name="mblNum" label="MB/L No." placeholder=""/>
                    <ProFormText name="hblNum" label="HB/L No." placeholder=""/>
                </Col>
                {/* 订舱代理、目的港代理 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={8}>
                    <SearchProFormSelect
                        required
                        qty={5}
                        isShowLabel={true}
                        label="Booking Agent"
                        id={'bookingAgentId'}
                        name={'bookingAgentId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        valueObj={{value: serviceInfo?.bookingAgentId, label: serviceInfo?.bookingAgentNameEn}}
                        handleChangeData={(val: any, option: any) => handleChange('bookingAgentId', val, option)}
                    />
                    <SearchProFormSelect
                        required
                        qty={5}
                        isShowLabel={true}
                        label="Destination Agent"
                        id={'destinationAgentId'}
                        name={'destinationAgentId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        valueObj={{value: serviceInfo?.destinationAgentId, label: serviceInfo?.destinationAgentNameEn}}
                        handleChangeData={(val: any, option: any) => handleChange('destinationAgentId', val, option)}
                    />
                </Col>
                {/* 船公司、船代 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={8}>
                    <SearchProFormSelect
                        required
                        qty={5}
                        isShowLabel={true}
                        label="Shipping Line (Carrier)"
                        id={'carrierId'}
                        name={'carrierId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        valueObj={{value: serviceInfo?.carrierId, label: serviceInfo?.carrierNameEn}}
                        handleChangeData={(val: any, option: any) => handleChange('carrierId', val, option)}
                    />
                    <SearchProFormSelect
                        required
                        qty={5}
                        isShowLabel={true}
                        label="Shipping Agent"
                        id={'shippingAgentId'}
                        name={'shippingAgentId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        valueObj={{value: serviceInfo?.shippingAgentId, label: serviceInfo?.shippingAgentNameEn}}
                        handleChangeData={(val: any, option: any) => handleChange('shippingAgentId', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* 业务完成日 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={3} className={'completeDate'}>
                    <ProFormDatePicker width="md" name="complateDate" label="COMPLETE DATE" placeholder=""/>
                </Col>
            </Row>

            <Row gutter={rowGrid} style={{ marginTop: 15 }}>
                {/* 船名、船公司约号 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                    <ProFormText name="vesselName" label="Vessel Name" placeholder=""/>
                    <ProFormText name="serviceContractNum" label="Service Contract No." placeholder=""/>
                </Col>
                {/* 航次、码头 */}
                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                    <ProFormText name="voyageName" label="Voyage" placeholder=""/>
                    <ProFormText name="wharf" label="Wharf" placeholder=""/>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* ETD、截关 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width="md" name="etd" label="ETD" placeholder=""/>
                    <ProFormDateTimePicker
                        fieldProps={{format: 'YYYY-MM-DD hh:mm'}}
                        width="md" name="closingTime" label="Closing Time" placeholder=""
                    />
                </Col>
                {/* ATD、截港/截重柜 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width="md" name="atd" label="ATD" placeholder=""/>
                    <ProFormDateTimePicker
                        fieldProps={{format: 'YYYY-MM-DD hh:mm'}}
                        width="md" name="cyClosingDate" label="CY Closing DATE" placeholder=""
                    />
                </Col>
                {/* ETA、截提单补料 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={3}>
                    <ProFormDatePicker width="md" name="eta" label="ETA" placeholder=""/>
                    <ProFormDateTimePicker
                        fieldProps={{format: 'YYYY-MM-DD hh:mm'}}
                        width="md" name="siCutOffTime" label="SI CUT OFF Time" placeholder=""
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* B/L Type、B/L QTY、Place and Date of Issue */}
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={5}>
                    <div className={'proFormTextContainer'}>
                        <ProFormSelect
                            name="blTypeId"
                            label="B/L Type"
                            placeholder=''
                            style={{minWidth: 150}}
                            options={[
                                {label: 'Original B/L', value: '1'},
                                {label: 'Telex Release', value: '2'},
                                {label: 'Sea Waybill', value: '3'},
                            ]}
                            fieldProps={{
                                onChange: (e) => setIsOriginal(e === '1')
                            }}
                        />
                        {isOriginal ? <ProFormText label="B/L QTY" name={'blQty'}/> : null}
                    </div>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <Form.Item name={'placeOfIssueCode'} label={'Place and Date of Issue'}>
                            <SearchTable
                                qty={10}
                                rowKey={'code'}
                                modalWidth={950}
                                showHeader={true}
                                title={'Payable AT'}
                                text={serviceInfo?.placeOfIssueNameEn}
                                url={"/apiBase/sea/querySeaCommon"}
                                handleChangeData={(val: any, option: any) => handleChange('placeOfIssueCode', val, option)}
                            />
                        </Form.Item>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormDatePicker name="placeOfDate" placeholder=""/>
                    </Space>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    {/* // TODO: 订舱代理 */}
                    <ProFormText hidden={true} width="md" name={'bookingAgentNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'bookingAgentNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'bookingAgentOracleId'}/>

                    {/* // TODO: 船公司 */}
                    <ProFormText hidden={true} width="md" name={'carrierNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'carrierNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'carrierOracleId'}/>

                    {/* // TODO: 目的港代理 */}
                    <ProFormText hidden={true} width="md" name={'destinationAgentNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'destinationAgentNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'destinationAgentOracleId'}/>

                    {/* // TODO: 船代 */}
                    <ProFormText hidden={true} width="md" name={'shippingAgentNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'shippingAgentNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'shippingAgentOracleId'}/>

                    {/* // TODO: 签收地点 */}
                    <ProFormText hidden={true} width="md" name={'placeOfIssueNameEn'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Basic;