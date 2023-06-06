import React, {Fragment, useState} from 'react';
import {FooterToolbar, ProForm, ProFormText} from '@ant-design/pro-components'
import {Button, Col, Drawer, Form, message, Row, Space} from 'antd'
import SearchInput from '@/components/SearchInput'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import {useModel} from "@@/plugin-model/useModel";
import styles from "@/pages/sys-manager/style.less";


// type APIPort = APIManager.Port;

/*const TransportTypeList = [
    {value: 1, label: 'Sea'}, {value: 2, label: 'Land'}, {value: 3, label: 'Air'}, {value: 4, label: 'Train'}
];*/

interface Props {
    PortInfo: any,
    isCreate?: boolean,
    actionRef?: any,
}

const PortDrawerForm: React.FC<Props> = (props) => {

    const {
        addSea, editSea,
    } = useModel('manager.port', (res: any) => ({
        addSea: res.addSea,
        editSea: res.editSea,
    }));

    const [form] = Form.useForm();
    const {PortInfo, isCreate} = props;
    const [open, setOpen] = useState(false);
    // const [PortInfoVO, setPortInfoVO] = useState<APIPort>(PortInfo);
    const [CityObj, setCityObj] = useState<any>({value: PortInfo?.cityId || null, label: PortInfo?.cityName});
    // const [CountryObj, setCountryObj] = useState<any>({value: PortInfo?.CountryID || null, label: PortInfo?.CountryName});

    /*useEffect(() => {
        if (open) {
            if (PortInfoVO?.id !== PortInfo?.id) {
                setPortInfoVO(PortInfo);
                setCityObj({value: PortInfo.cityId, label: PortInfo.cityName});
                // setCountryObj({CityID: PortInfo.CountryID, CityName: PortInfo.CountryName});
            }
            /!*if (!(PortInfoVO?.id) && !!(PortInfo?.id)) {
                setPortInfoVO(PortInfo);
                console.log(PortInfo.cityId)
                console.log(PortInfo.cityName)
                setCityObj({value: PortInfo.cityId, label: PortInfo.cityName});
                // setCountryObj({CityID: PortInfo.CountryID, CityName: PortInfo.CountryName});
            }*!/
        }
    }, [open, PortInfo, PortInfoVO?.id])*/

    /**
     * @Description: TODO: onChange 事件
     * @author LLS
     * @date 2023/5/9
     * @param filedName     字段名
     * @param val           结果
     * @returns
     */
    const handlePortChange = (filedName: string, val: any) => {
        if (filedName === 'cityId') {
            console.log(val)
            const setFieldValue: any = {[filedName]: val.value};
            setCityObj({value: val.value, label: val.label});
            form?.setFieldsValue(setFieldValue);
        }
    }

    /**
     * @Description: TODO: 保存
     * @author LLS
     * @date 2023/5/9
     * @param values   页面 form 值
     * @returns
     */
    const handleSave = async (values: any) => {
        form.validateFields()
            .then(async ()=> {
                console.log(values)
                let result: API.Result;
                const params: any = {
                    alias: values.alias,
                    cityId: values.cityId,
                    cityName: CityObj.label,
                    code: values.code,
                    name: values.name,
                    tradePlaceCod: values.tradePlaceCod,
                };
                console.log(params)
                if (isCreate) {
                    result = await addSea(params);
                } else {
                    params.id = PortInfo.id
                    // params.id = PortInfoVO.id
                    result = await editSea(params);
                }
                console.log(result)
                if (result.success) {
                    message.success('Success');
                    // 清空控件数据
                    form.resetFields();
                    setCityObj({value: null, label: ''});
                    setOpen(false)
                    // 刷新
                    if (props.actionRef.current) {
                        props.actionRef.current.reload();
                    }
                } else {
                    message.error(result.message);
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    return (
        <Fragment>
            {isCreate ?
                <Button onClick={() => setOpen(true)} type={'primary'} icon={<PlusOutlined/>}>Add Port</Button>
                :
                <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            }
            {!open ? null :
                <Drawer
                    open={open}
                    width={'70%'}
                    destroyOnClose={true}
                    onClose={() => setOpen(false)}
                    title={'Port Information'}
                    className={styles['drawer-container']}
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
                        request={async ()=> PortInfo}
                    >
                        {/* TODO: Code、Name、Alias、City、Trade Place Code */}
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                                <ProFormText
                                    required
                                    name='code'
                                    label='Code'
                                    placeholder=''
                                    rules={[{required: true, message: 'Code is required'}]}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                                <ProFormText
                                    required
                                    name='name'
                                    label='Name'
                                    placeholder=''
                                    rules={[{required: true, message: 'Name is required'}]}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                                <ProFormText
                                    required
                                    name='alias'
                                    label='Alias'
                                    placeholder=''
                                    rules={[{required: true, message: 'Alias is required'}]}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                                <Form.Item label={'City'} name={'cityId'} rules={[{required: true, message: `City is required`}]}>
                                    <SearchInput
                                        qty={5}
                                        id={'cityId'}
                                        valueObj={CityObj}
                                        query={{CountryID: 1}}
                                        url={'/apiLocal/MCommon/GetCityByKey'}
                                        handleChangeData={(val: any) => handlePortChange('cityId', val)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                                <ProFormText
                                    name='tradePlaceCod'
                                    label='Trade Place Code'
                                    placeholder=''
                                />
                            </Col>
                        </Row>
                        <FooterToolbar
                            className={'ant-footer-tool-bar'}
                            extra={<Button onClick={() => setOpen(false)}>Cancel</Button>}
                        >
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