import React, {useEffect, useMemo} from 'react';
import {ProCard, ProFormSelect, ProFormTextArea} from '@ant-design/pro-components';
import {Col, Row, Space} from 'antd';
import {IconFont, rowGrid} from '@/utils/units';
import SearchModal from '@/components/SearchModal';
import SearchTable from '@/components/SearchTable';
import styles from "@/pages/sys-job/job/basic-info-form/style.less";

interface Props {
    formRef?: any,
    formCurrent?: any,
    title: string,
    NBasicInfo?: APIModel.NBasicInfo,
}

const Incoterms = [
    { IncotermsID: 1, IncotermsName: 'CFR - COST AND FREIGHT' },
    { IncotermsID: 2, IncotermsName: 'CIF - COST,INSURANCE AND FREIGHT' },
    { IncotermsID: 3, IncotermsName: 'FAS - FREE ALONGSIDE SHIP' },
    { IncotermsID: 4, IncotermsName: 'FOB - FREE ON BOARD' },
    { IncotermsID: 5, IncotermsName: 'CIP - CARRIAGE AND INSURANCE PAID' },
    { IncotermsID: 6, IncotermsName: 'CPT - CARRIAGE PAID TO' },
    { IncotermsID: 7, IncotermsName: 'DAP - DELIVERED AT PLACE' },
    { IncotermsID: 8, IncotermsName: 'DAT - DELIVERED AT TERMINAL' },
    { IncotermsID: 9, IncotermsName: 'DDP - DELIVERED DUTY PAID' },
    { IncotermsID: 10, IncotermsName: 'EXW - EX WORKS' },
    { IncotermsID: 11, IncotermsName: 'FCA - FREE CARRIER' },
];

const Payment: React.FC<Props> = (props) => {
    const  {
        title,
        NBasicInfo,
    } = props;

    // const [cargoInfo, setCargo] = useState<APIModel.CargoInfo>(CargoInfo);
    const TransportTypeID = NBasicInfo?.BizType1ID === 2 ? 3 : NBasicInfo?.BizType1ID === 3 ? 2 : 1;    //  1 海 2陆 3空

    useMemo(()=> {

    }, [])

    useEffect(() => {

    }, [])

    const handleChange =(filedName: string, val: any, option?: any)=> {
        console.log(filedName, val, option);
    }

    const IncotermsOption = Incoterms.map(option => ({
        value: option.IncotermsID, label: option.IncotermsName
    }));

    return (
        <ProCard
            title={title}
            bordered={true}
            className={styles.proFormPayment}
            headerBordered
            collapsible
        >
            {
                title === 'Payment & Shipping Terms' ?
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={9} xxl={6}>
                            <ProFormSelect
                                placeholder=''
                                name="Incoterms"
                                label="Incoterms"
                                initialValue={{ value: NBasicInfo?.Terms?.IncotermsID }}
                                options={IncotermsOption}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={9} xxl={6}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Shipment Term</label>
                            <SearchModal
                                qty={20}
                                id={'ServiceTypeID'}
                                title={'Shipment Term'}
                                modalWidth={500}
                                value={NBasicInfo?.Terms?.ServiceTypeID}
                                text={NBasicInfo?.Terms?.ServiceTypeName}
                                url={"/apiLocal/MCommon/GetServiceType"}
                                handleChangeData={(val: any, option: any) => handleChange('ServiceTypeID', val, option)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                            <Space direction="horizontal" align="center" className={styles.siteSpace}>
                                <ProFormSelect
                                    placeholder=''
                                    name="PayMethod"
                                    label="Payment Term"
                                    initialValue={{label: '(CP) Freight payable as per charter party', value: 6}}
                                    options={[
                                        {label: '(PP) Freight Prepaid', value: 1},
                                        {label: '(CC) Freight Collect', value: 2},
                                        {label: '(AA) Freight as arranged', value: 3},
                                        {label: '(FF) Freight Free', value: 4},
                                        {label: '(OT) Other', value: 5},
                                        {label: '(CP) Freight payable as per charter party', value: 6},
                                        {label: '(MM) Montyly payment in the third place', value: 7},
                                        {label: '(PT) Freight prepaid at the third place', value: 8},
                                        {label: '(CT) Freight Collect at the third place', value: 9},
                                    ]}
                                />
                                <span className={styles.siteSpaceSpan}  />
                                <SearchTable
                                    qty={10}
                                    name="PayableAtID"
                                    title={'Payable AT'}
                                    modalWidth={950}
                                    rowKey={'ID'}
                                    showHeader={true}
                                    query={{ TransportTypeID }}
                                    text={NBasicInfo?.Terms?.PayableAtName}
                                    url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                    className={'textRight'}
                                    handleChangeData={(val: any, option: any) => handleChange('ServiceTypeID', val, option)}
                                />
                            </Space>
                        </Col>
                    </Row>
                    :
                    <Row gutter={rowGrid}>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                name="BizRemark"
                                label="Job Remark"
                                initialValue={NBasicInfo?.BizRemark}
                                fieldProps={{rows: 4}}
                            />
                        </Col>
                    </Row>
            }
        </ProCard>
    )
}
export default Payment;