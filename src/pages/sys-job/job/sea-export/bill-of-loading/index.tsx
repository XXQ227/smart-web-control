import React from 'react';
import {Col, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormTextArea} from "@ant-design/pro-components";
import {getUserID} from "@/utils/auths";
import SearchSelectInput from "@/components/SearchSelectInput";

interface Props {
    title: string,
    Port?: APIModel.Port,
    NBasicInfo?: APIModel.NBasicInfo,
}

const BillOfLoading: React.FC<Props> = (props) => {
    const  {NBasicInfo} = props;
    const mblVO: any = NBasicInfo?.MBSCN;
    const hblVO: any = NBasicInfo?.HBSCN;

    // const [mblVO, setMBLVO] = React.useState(NBasicInfo?.MBSCN);
    // const [hblVO, setHBLVO] = React.useState(NBasicInfo?.HBSCN);


    const BlDOM = (label: string, domID: string, fieldName: string, value?: any) => {
        // const ItemColSpan = ItemLayout(4, 20);

        return (
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                {/*<SearchProFormSelect
                    qty={5}
                    required={false}
                    label={label}
                    id={domID}
                    name={domID}
                    url={'/apiLocal/CT/GetCTByStrNoPage'}
                    query={{ UserID: getUserID() }}
                    // prefix={<IconFont type={'icon-search'} />}
                    // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                />*/}
                <div className={'ant-form-shipperInfoItem'}>
                    <label>{label}</label>
                    <SearchSelectInput
                        qty={5}
                        filedValue={'ID'}
                        id={'name_full_en'}
                        filedLabel={'NameFull'}
                        // valueObj={companyNameEN}
                        query={{ UserID: getUserID() }}
                        url={'/apiLocal/CT/GetCTByStrNoPage'}
                        // handleChangeData={(val: any)=> handleChangeData(val, 'name_full_en')}
                    />
                </div>

                {/*<FormItem label={label} {...ItemColSpan} className={'ant-form-shipperInfoItem'}>
                    <SearchSelectInput
                        qty={5}
                        filedValue={'ID'}
                        id={'name_full_en'}
                        filedLabel={'NameFull'}
                        // valueObj={companyNameEN}
                        query={{ UserID: getUserID() }}
                        url={'/api/CT/GetCTByStrNoPage'}
                        // handleChangeData={(val: any)=> handleChangeData(val, 'name_full_en')}
                    />
                </FormItem>*/}
                <ProFormTextArea
                    fieldProps={{rows: 6}}
                    name={fieldName}
                    initialValue={value}
                />
            </Col>
        );
    }

    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={'ant-card seaExportBillOfLoading'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {BlDOM("Shipper", "SearchInputShipper", "Shipper", mblVO?.Shipper)}
                {BlDOM("Consignee", "SearchInputConsignee", "Consignee", mblVO?.Consignee)}
                {BlDOM("Destination Agent", "HSearchInputPODAgent", "PODAgent", hblVO?.PODAgent)}
                {BlDOM("Notify Party", "SearchInputNotifyParty", "NotifyParty", mblVO?.NotifyParty)}
                {BlDOM("Also Notify", "SearchInputNotifyParty2", "NotifyParty2", mblVO?.NotifyParty2)}
            </Row>
        </ProCard>
    )
}
export default BillOfLoading;