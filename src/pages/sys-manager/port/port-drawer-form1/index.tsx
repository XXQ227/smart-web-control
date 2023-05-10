import React, {useEffect, useState} from 'react';
import {
    DrawerForm, FooterToolbar,
    ProFormRadio,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import SearchInput from '@/components/SearchInput'
import {EditOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'


type APIPort = APIManager.Port;

const TransportTypeList = [
    {value: 1, label: 'Sea'}, {value: 2, label: 'Land'}, {value: 3, label: 'Air'}, {value: 4, label: 'Train'}
];

interface Props {
    PortInfo: any,
}

const PortDrawerForm: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {PortInfo} = props;

    const [open, setOpen] = useState(false);
    const [PortInfoVO, setPortInfoVO] = useState<APIPort>(PortInfo);
    const [CountryID, setCountryID] = useState<number>(PortInfo.CountryID);

    useEffect(()=> {
        if (!(PortInfoVO?.ID) && !!(PortInfo.ID)) {
            setPortInfoVO(PortInfo);
            setCountryID(PortInfo.CountryID);
        }
    }, [PortInfo, PortInfoVO?.ID])

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
            form?.setFieldsValue({[filedName]: val.value});
        }
    }

    /**
     * @Description: TODO: 保存
     * @author XXQ
     * @date 2023/5/9
     * @param values1   页面 form 值
     * @returns
     */
    const handleSave = (values1: any) => {
        console.log(values1);
        form.validateFields()
            .then((values: any)=> {
                console.log(values);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }


    return (
        <DrawerForm
            form={form}
            drawerProps={{
                open,
                destroyOnClose: true,
                onClose: ()=> setOpen(false),
            }}
            width={'70%'}
            submitter={{
                render: ()=> {
                    return (
                        <FooterToolbar>
                            <Space>
                                <Button onClick={()=> setOpen(false)}>Cancel</Button>
                                <Button type='primary' htmlType={'submit'} onClick={handleSave}>Submit</Button>
                            </Space>
                        </FooterToolbar>
                    )
                }
            }}
            // onVisibleChange={setOpen}
            onVisibleChange={(state)=> console.log(state)}
            // afterVisibleChange={(state)=> console.log(state)}
            // onOpenChange={(state)=> console.log(state}}
            submitTimeout={2000}
            title={'Port Information'}
            // TODO: 焦点给到第一个控件
            autoFocusFirstInput
            // TODO: 设置默认值
            initialValues={PortInfoVO}
            formKey={'cv-center-information'}
            trigger={<EditOutlined onClick={()=> setOpen(true)}/>}
            // TODO: 提交数据
            onFinish={async (values) => handleSave(values)}
        >
            {/** // TODO: Code、Name、TradePlaceCode、Freezen */}
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        required
                        name='Code'
                        label='Code'
                        placeholder=''
                        rules={[{required: true, message: 'is required'}]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormText
                        required
                        name='Name'
                        label='Name'
                        placeholder=''
                        rules={[{required: true, message: 'is required'}]}
                    />
                </Col>
                <Col span={12}>
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
                <Col span={12}>
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
                <Col span={12}>
                    <ProFormText
                        placeholder=''
                        name='TradePlaceCode'
                        label='Trade Place Code'
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        label={'Type'}
                        name='TransportTypeID'
                        options={TransportTypeList}
                    />
                </Col>
                <Col span={12}>
                    <ProFormSwitch
                        name='Freezen'
                        label='Freezen'
                    />
                </Col>
            </Row>

            <FooterToolbar>
                <Space>
                    <Button onClick={()=> setOpen(false)}>Cancel</Button>
                    <Button type='primary' htmlType={'submit'} onClick={handleSave}>Submit</Button>
                </Space>
            </FooterToolbar>
        </DrawerForm>
    )
}
export default PortDrawerForm;