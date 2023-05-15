import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    DrawerForm,
    ProFormRadio,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components'
import {Button, Col, Form, Row} from 'antd'
import {useModel, history} from 'umi'
import SearchInput from '@/components/SearchInput'
import {EditOutlined} from '@ant-design/icons'


type APIPort = APIManager.Port;

const TransportTypeList = [
    {value: 1, label: '海运'}, {value: 2, label: '陆运'}, {value: 3, label: '空运'}, {value: 4, label: '铁路'}
];


const PortForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const formRef = useRef<ProFormInstance>();

    const {
        PortInfo, getGetPortByID
    } = useModel('manager.port', (res: any) => ({
        PortInfo: res.PortInfo,
        getGetPortByID: res.getGetPortByID,
    }));

    const [PortInfoVO, setPortInfoVO] = useState<APIPort>(PortInfo);
    const [CountryID, setCountryID] = useState<number>(PortInfo.CountryID);

    useEffect(()=> {
        if (!(PortInfoVO?.ID) && !!(PortInfo.ID)) {
            setPortInfoVO(PortInfo);
            setCountryID(PortInfo.CountryID);
        }
    }, [PortInfo, PortInfoVO?.ID])

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetPortByID = async () => {
        const result: any = await getGetPortByID({ID: Number(atob(params?.id))});
        setPortInfoVO(result);
        return result;
    }

    /**
     * @Description: TODO: onChange 事件
     * @author XXQ
     * @date 2023/5/9
     * @param filedName     字段名
     * @param val           结果
     * @returns
     */
    const handlePortChange = (filedName: string, val: any) => {
        if(['CityID', 'CountryID'].includes(filedName)) {
            if (filedName === 'CountryID') {
                setCountryID(val?.value);
            }
            formRef?.current?.setFieldsValue({[filedName]: val.value});
        }
    }


    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <DrawerForm
                // form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={PortInfoVO}
                formKey={'cv-center-information'}
                trigger={<EditOutlined/>}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={async (values) => {
                    console.log(values);
                }}
                // TODO: 向后台请求数据
                request={async () => handleGetPortByID()}
            >
                <ProCard className={'ant-card'}>
                    {/** // TODO: Name、Code、TradePlaceCode、Freezen */}
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='Name'
                                label='Name'
                                placeholder=''
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='Code'
                                label='Code'
                                placeholder=''
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                placeholder=''
                                name='TradePlaceCode'
                                label='Trade Place Code'
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormSwitch
                                name='Freezen'
                                label='Freezen'
                            />
                        </Col>
                    </Row>

                    {/** // TODO: MDM Number<主数据代码>、CV-Center Number<客商代码>、Oracle ID (Customer)、
                     // TODO: Oracle ID (Vendor)、Sinotrans Company ID<如果是中外运内部公司，则有一个5位数字的编码> */}
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label={'Country'} name={'CountryID'}>
                                <SearchInput
                                    qty={5}
                                    id={'CountryID'}
                                    url={'/api/MCommon/GetCountryByKey'}
                                    valueObj={{value: PortInfoVO?.CountryID, label: PortInfoVO?.CountryName}}
                                    handleChangeData={(val: any) => handlePortChange('CountryID', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={'City'} name={'CityID'}>
                                <SearchInput
                                    qty={5}
                                    id={'CityID'}
                                    query={{ CountryID }}
                                    url={'/api/MCommon/GetCityByKey'}
                                    disabled={!(CountryID || PortInfoVO.CountryID)}
                                    valueObj={{value: PortInfoVO?.CityID, label: PortInfoVO?.CityName}}
                                    handleChangeData={(val: any) => handlePortChange('CityID', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <ProFormRadio.Group
                                label={'Type'}
                                name='TransportTypeID'
                                options={TransportTypeList}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button onClick={() => history.push({pathname: '/manager/port/list'})}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </DrawerForm>
        </PageContainer>
    )
}
export default PortForm;