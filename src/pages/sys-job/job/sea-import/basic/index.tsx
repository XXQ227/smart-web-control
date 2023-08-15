import React from 'react';
import {Col, Divider, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormDatePicker, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import SearchProFormSelect from "@/components/SearchProFormSelect";

interface Props {
    title: string,
    form: any
}

const Basic: React.FC<Props> = (props) => {
    const  {form} = props;

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
        const setValueObj: any = {[filedName]: val};
        switch (filedName) {
            case 'switchBlAgentId':
                setValueObj.switchBlAgentNameCn = option?.nameFullCn || option?.nameFullEn;
                setValueObj.switchBlAgentNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.switchBlAgentOracleId = option?.oracleSupplierCode;
                break;
            case 'carrierId':
                setValueObj.carrierNameCn = option?.nameFullCn || option?.nameFullEn;
                setValueObj.carrierNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.carrierOracleId = option?.oracleSupplierCode;
                break;
            case 'polAgentId':
                setValueObj.polAgentNameCn = option?.nameFullCn || option?.nameFullEn;
                setValueObj.polAgentNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.polAgentOracleId = option?.oracleSupplierCode;
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
                <Col xs={24} sm={24} md={24} lg={8} xl={5} xxl={4}>
                    <ProFormText name="mblNum" label="MB/L No." width="md" placeholder=""/>
                    <ProFormText name="hblNum" label="HB/L No." width="md" placeholder=""/>
                </Col>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={10}>
                    {/* 换单代理、船公司 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                id={'switchBlAgentId'}
                                name={'switchBlAgentId'}
                                label={"Switch B/L Agent"}
                                filedValue={'id'} filedLabel={'nameFullEn'}
                                url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                query={{branchId: '1665596906844135426', buType: 1}}
                                handleChangeData={(val: any, option: any) => handleChange('switchBlAgentId', val, option)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <SearchProFormSelect
                                qty={5}
                                id={'carrierId'}
                                name={'carrierId'}
                                isShowLabel={true}
                                label={"Shipping Line (Carrier)"}
                                filedValue={'id'} filedLabel={'nameFullEn'}
                                query={{branchId: '1665596906844135426', buType: 1}}
                                url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                handleChangeData={(val: any, option: any) => handleChange('carrierId', val, option)}
                            />
                        </Col>
                    </Row>
                    {/* 船名、航次、B/L Type */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormText name="vesselName" label="Vessel Name" width="md" placeholder=""/>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormText name="voyageName" label="Voyage" width="md" placeholder=""/>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                            <ProFormSelect
                                name="blTypeId"
                                label="B/L Type"
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
                        id={'polAgentId'}
                        isShowLabel={true}
                        name={'polAgentId'}
                        label={"POL Agent"}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('polAgentId', val, option)}
                    />
                    <ProFormText width="md" name="tradeContractNum" label="Trade Contract No." placeholder=""/>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/* 业务完成日 */}
                <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4} className={'completeDate'}>
                    <ProFormDatePicker
                        required rules={[{required: true, message: 'COMPLETE DATE'}]}
                        width="md" name="completeDate" label="COMPLETE DATE" placeholder=""
                    />
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    {/* // TODO: 订舱代理 */}
                    <ProFormText hidden={true} width="md" name={'switchBlAgentNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'switchBlAgentNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'switchBlAgentOracleId'}/>

                    {/* // TODO: 船公司 */}
                    <ProFormText hidden={true} width="md" name={'carrierNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'carrierNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'carrierOracleId'}/>

                    {/* // TODO: 目的港代理 */}
                    <ProFormText hidden={true} width="md" name={'polAgentNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'polAgentNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'polAgentOracleId'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Basic;