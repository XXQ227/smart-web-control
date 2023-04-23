import React, {useEffect, useMemo, useState} from 'react';
import {ProCard} from '@ant-design/pro-components';
import {Col, Input, Row} from 'antd';
import {getUserID} from '@/utils/auths';
import {colGrid, rowGrid} from '@/utils/units';
import SearchInput from '@/components/SearchInput';
import SearchModal from '@/components/SearchModal'

interface Props {
    FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    title: string,
    NBasicInfo: any,
    Principal: any,
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        FormItem, form,
        title, Principal,
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
        console.log(filedName, val, option);
        principalInfo[filedName] = val;
        const fileLen: number = filedName.length;
        // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
        if (filedName.substring(fileLen-2, fileLen) === 'ID') {
            principalInfo[filedName.substring(0, fileLen-2) + 'Name'] = option?.label;
            form?.setFieldsValue({[filedName]: val});
        }
        setPrincipal(principalInfo);
    }

    console.log(principalInfo);

    const portColumns = [
        { title: 'Port', dataIndex: 'Name', render: (_: any, record: any)=> record.data?.Name},
        { title: 'Code', align: 'center', width: 120, dataIndex: 'PortCode', render: (_: any, record: any)=> record.data?.PortCode},
        { title: 'City', align: 'center', width: 260, dataIndex: 'City', render: (_: any, record: any)=> record.data?.City},
        { title: 'Country', dataIndex: 'Country', width: 260, align: 'center', render: (_: any, record: any)=> record.data?.Country},
        { title: 'Type', dataIndex: 'TypeCN', width: 60, align: 'center', render: (_: any, record: any)=> record.data?.TypeCN}
    ];

    return (
        <ProCard title={title} bordered={true}>
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
                    <FormItem
                        label={'销售员'}
                        name={'BookingUserID'}
                        initialValue={principalInfo.BookingUserID}
                        rules={[{required: true, message: '请选择销售!'}]}
                    >
                        <Input/>
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'POL'}
                        name={'POLID'}
                        initialValue={principalInfo.POLID}
                        rules={[{required: true, message: '请输入POL!'}]}
                    >
                        <SearchModal
                            qty={15}
                            id={'POLID'}
                            title={'POL'}
                            modalWidth={800}
                            showHeader={true}
                            filedValue={'ID'}
                            filedLabel={'Name'}
                            columns={portColumns}
                            value={principalInfo.POLID}
                            text={principalInfo.POLName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            handleChangeData={(val: any, option: any) => handleChange('POLID', val, option)}
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
                    <FormItem
                        label={'客户'}
                        name={'PrincipalXID'}
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
                            handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                        />
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'付款方'}
                        name={'PayerID'}
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
                            handleChangeData={(val: any, option: any) => handleChange('PayerID', val, option)}
                        />
                    </FormItem>
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'货主'}
                        name={'CargoOwnerID'}
                        initialValue={{value: principalInfo.CargoOwnerID, label: principalInfo.CargoOwnerName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'CargoOwnerID'}
                            value={{value: principalInfo.CargoOwnerID, label: principalInfo.CargoOwnerName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                            handleChangeData={(val: any, option: any) => handleChange('CargoOwnerID', val, option)}
                        />
                    </FormItem>
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;