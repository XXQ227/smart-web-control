import React, {Fragment, useEffect, useRef, useState} from 'react';
import {FooterToolbar, ProForm, ProFormRadio, ProFormSwitch, ProFormText} from '@ant-design/pro-components'
import {Button, Col, Drawer, Form, message, Row, Space} from 'antd'
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
    const [CityObj, setCityObj] = useState<any>({CityID: PortInfo.CityID, CityName: PortInfo.CityName});
    let setCityRef: any = useRef(PortInfo);

    useEffect(() => {
        if (open) {
            if (!(PortInfoVO?.ID) && !!(PortInfo.ID)) {
                setPortInfoVO(PortInfo);
                setCountryID(PortInfo.CountryID);
                setCityObj({CityID: PortInfo.CityID, CityName: PortInfo.CityName});
            }
        }
    }, [open, PortInfo, PortInfoVO?.ID])

    /**
     * @Description: TODO: onChange 事件
     * @author XXQ
     * @date 2023/5/9
     * @param filedName     字段名
     * @param val           结果
     * @returns
     */
    const handlePortChange = (filedName: string, val: any) => {
        if (['CityID', 'CountryID'].includes(filedName)) {
            const setFieldValue: any = {[filedName]: val.value};
            if (filedName === 'CountryID') {
                setFieldValue.CityID = null;
                setCountryID(val?.value);
                setCityRef.current.CityID = null;
                setCityRef.current.CityName = '';
                setCityObj({CityID: null, CityName: ''});
                console.log(setCityRef);
            }
            form?.setFieldsValue(setFieldValue);
        }
    }

    /**
     * @Description: TODO: 保存
     * @author XXQ
     * @date 2023/5/9
     * @param values   页面 form 值
     * @returns
     */
    const handleSave = async (values: any) => {
        form.validateFields()
            .then(() => {
                console.log(values);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    return (
        <Fragment>
            <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            {!open ? null :
                <Drawer
                    open={open}
                    width={'70%'}
                    destroyOnClose={true}
                    onClose={() => setOpen(false)}
                    title={'Port Information'}
                >
                    <ProForm
                        form={form}
                        // TODO: 不清空为 null 的数据
                        omitNil={false}
                        // TODO: 不显示 提交按钮
                        submitter={false}
                        // TODO: 自动 focus 表单第一个输入框
                        autoFocusFirstInput={true}
                        // TODO: 设置默认值
                        // initialValues={PortInfoVO}
                        // TODO: 提交数据
                        onFinish={handleSave}
                        onFinishFailed={handleSave}
                        request={async ()=> PortInfoVO}
                    >
                        {/** // TODO: Code、Name、TradePlaceCode、Freezen */}
                        <Row gutter={24}>
                            <Col span={12}>
                                <ProFormText
                                    required
                                    name='Code'
                                    label='Code'
                                    placeholder=''
                                    rules={[{required: true, message: 'Code is required'}]}
                                />
                            </Col>
                            <Col span={12}>
                                <ProFormText
                                    required
                                    name='Name'
                                    label='Name'
                                    placeholder=''
                                    rules={[{required: true, message: 'Name is required'}]}
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
                                        query={{CountryID}}
                                        url={'/api/MCommon/GetCityByKey'}
                                        ref={(instance: any) => setCityRef = instance}
                                        disabled={!(CountryID || PortInfoVO.CountryID)}
                                        valueObj={{value: CityObj.CityID, label: CityObj.CityName}}
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
                                    required
                                    label={'Type'}
                                    name={'TransportTypeID'}
                                    options={TransportTypeList}
                                    rules={[{required: true, message: 'Type is required'}]}
                                />
                            </Col>
                            <Col span={12}>
                                <ProFormSwitch
                                    name='Freezen'
                                    label='Freezen'
                                />
                            </Col>
                        </Row>
                        <FooterToolbar className={'ant-footer-tool-bar'}
                                       extra={<Button onClick={() => setOpen(false)}>Cancel</Button>}>
                            <Space>
                                <Button type='primary' htmlType={'submit'}>Submit</Button>
                            </Space>
                        </FooterToolbar>
                    </ProForm>
                </Drawer>
            }
        </Fragment>
    )
}
export default PortDrawerForm;