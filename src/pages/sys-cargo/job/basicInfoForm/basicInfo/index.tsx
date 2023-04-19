import React, {useEffect, useMemo, useState} from 'react';
import {ProCard} from '@ant-design/pro-components';
import {Col, Input, Row} from 'antd';
import {getUserID} from '@/utils/auths';
import {colGrid, getTitleInfo, rowGrid} from '@/utils/units';
import SearchInput from '@/components/SearchInput';
import {useIntl} from '@@/plugin-locale/localeExports';
import SearchModal from '@/components/SearchModal'

interface Props {
    FormItem: any
    title: string,
    NBasicInfo: any,
    Principal: any,
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        FormItem,
        title, NBasicInfo, Principal,
    } = props;
    
    const [principalInfo, setPrincipal] = useState<API.Principal>(Principal);

    useMemo(()=> {

    }, [])

    useEffect(() => {

    }, [])

    /**
     * @Description: TODO: change 事件
     * @author XXQ
     * @date 2023/4/17
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    const handleChange =(filedName: string, val: any, option?: any)=> {
        // console.log(filedName, val, option);
        principalInfo[filedName] = val;
        const fileLen: number = filedName.length;
        // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
        if (filedName.substring(fileLen-2, fileLen) === 'ID') {
            principalInfo[filedName.substring(0, fileLen-2) + 'Name'] = option?.label;
        }
        console.log(principalInfo);
        setPrincipal(principalInfo);
    }

    // 初始化（或用于 message 提醒）
    const intl = useIntl();
    // TODO: 获取列名<Title>
    const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    console.log(principalInfo);
    return (
        <ProCard title={title} bordered={true}>
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
                    <FormItem label={formLabel('code', '业务编号')}>
                        {NBasicInfo?.Code}
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem label={formLabel('sales', '销售')}>
                        {principalInfo?.SalesManName}
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem label={formLabel('sales', '销售')}>
                        {principalInfo?.SalesManName}
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem label={formLabel('sales', '销售')}>
                        {principalInfo?.SalesManName}
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem label={formLabel('sales', '销售')}>
                        {principalInfo?.SalesManName}
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem label={formLabel('sales', '销售')}>
                        {principalInfo?.SalesManName}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
                    <FormItem
                        label={'销售员'}
                        initialValue={principalInfo.BookingUserID}
                        rules={[{required: true, message: '请选择销售!'}]}
                    >
                        <Input/>
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'货主'}
                        initialValue={principalInfo.BookingUserID}
                        rules={[{required: true, message: '请输入费用名称!'}]}
                    >
                        <SearchModal
                            qty={13}
                            id={'CGItemID'}
                            title={'货主'}
                            value={principalInfo.CargoOwnerID}
                            text={principalInfo.CargoOwnerName}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                            handleChangeData={(val: any, option: any)=> handleChange('CargoOwnerID', val, option)}
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
                    <FormItem
                        label={'客户'}
                        initialValue={{value: principalInfo.PrincipalXID, label: principalInfo.PrincipalXName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'Customer'}
                            value={{value: principalInfo.PrincipalXID, label: principalInfo.PrincipalXName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{
                                IsJobCustomer: true, BusinessLineID: null,
                                UserID: getUserID(), CTType: 1, SystemID: 4,
                            }}
                            handleChangeData={(val: any, option: any)=> handleChange('CustomerID', val, option)}
                        />
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'付款方'}
                        initialValue={{value: principalInfo.PayerID, label: principalInfo.PayerName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'PayerID'}
                            value={{value: principalInfo.PayerID, label: principalInfo.PayerName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{
                                searchPayer: true, BusinessLineID: null,
                                UserID: getUserID(), CTType: 1, SystemID: 4,
                            }}
                            handleChangeData={(val: any, option: any)=> handleChange('PayerID', val, option)}
                        />
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'货主'}
                        initialValue={{value: principalInfo.CargoOwnerID, label: principalInfo.CargoOwnerName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'CargoOwnerID'}
                            value={{value: principalInfo.CargoOwnerID, label: principalInfo.CargoOwnerName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                            handleChangeData={(val: any, option: any)=> handleChange('CargoOwnerID', val, option)}
                        />
                    </FormItem>
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;