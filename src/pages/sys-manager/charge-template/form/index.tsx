import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getUserID} from '@/utils/auths'
import {getFormErrorMsg} from '@/utils/units'
import ChargeTemplateChargeTable from './charge-template-charge-table'
import ls from 'lodash'

const FormItem = Form.Item;

type APICGTemp = APIManager.CGTemp;
type CGTempItems = APIManager.CGTempItems;


const ChargeTemplateForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const {push, location: {pathname}} = history;
    const formRef = useRef<ProFormInstance>();
    const id = Number(atob(params?.id));

    const {
        CGTempInfo, getVOByID, PurposeOfCallList, ServicesList, saveCGTemp, CurrencyList,
        PayMethodList, ARInvoTypeList, APInvoTypeList
    } = useModel('manager.charge-template', (res: any) => ({
        getVOByID: res.getVOByID,
        CGTempInfo: res.CGTempInfo,
        CurrencyList: res.CurrencyList,
        PayMethodList: res.PayMethodList,
        ARInvoTypeList: res.ARInvoTypeList,
        APInvoTypeList: res.APInvoTypeList,
        PurposeOfCallList: res.PurposeOfCallList,
        ServicesList: res.ServicesList,
        saveCGTemp: res.saveCGTemp,
    }));

    const [CGTempInfoVO, setCGTempInfoVO] = useState<APICGTemp>(CGTempInfo);
    const [ARListVO, setARListVO] = useState<CGTempItems[]>(CGTempInfo.ARList || []);
    const [APListVO, setAPListVO] = useState<CGTempItems[]>(CGTempInfo.APList || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<boolean>(true);

    useEffect(() => {
        if (!(CGTempInfoVO?.ID) && !!(CGTempInfo.ID)) {
            setCGTempInfoVO(CGTempInfo);
            setARListVO(CGTempInfo.ARList);
            setAPListVO(CGTempInfo.APList);
        }
    }, [CGTempInfo, CGTempInfoVO?.ID])

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCGTempByID(paramsVal: APIManager.CGTempByIDParams) {
        setLoading(true);
        const result: any = await getVOByID(paramsVal);
        setCGTempInfoVO(result.CGTempVO);
        setARListVO(result.ARList);
        setAPListVO(result.APList);
        setLoading(false);
        return result.CGTempVO;
    }

    /**
     * @Description: TODO: onChange 事件
     * @author XXQ
     * @date 2023/5/9
     * @param data      字段名
     * @param CGType    结果
     * @returns
     */
    const handleCGTempChange = (data: CGTempItems[], CGType: number) => {
        if (CGType === 1) {
            setARListVO(data);
        } else {
            setAPListVO(data);
        }
    }

    const handleSave = async (values: any) => {
        setLoading(true);
        const ID = pathname.indexOf('/copy') > -1 ? 0 : id;
        const saveResult: any = {
            ID,
            Name: values.Name,
            APUSDRate: values.APUSDRate,
            ARUSDRate: values.ARUSDRate,
            ServicesID: values.ServicesID,
            PurposeofCallID: values.PurposeofCallID,
        };
        // TODO: 模板费用保存，字符串的费用 ID 变成 0
        let arList: CGTempItems[] = ls.cloneDeep(ARListVO),
            apList: CGTempItems[] = ls.cloneDeep(APListVO);
        arList = arList.map((item: CGTempItems) => ({...item, ID: typeof item.ID === 'string' ? 0 : item.ID})) || [];
        apList = apList.map((item: CGTempItems) => ({...item, ID: typeof item.ID === 'string' ? 0 : item.ID})) || [];
        // TODO: 费用模板里的 AR、AP 费用
        saveResult.CGTempItems = [...arList, ...apList];
        const result: any = await saveCGTemp(saveResult);
        setLoading(false);
        if (result.Result) {
            message.success('Success!');
        } else {
            setSaveState(false);
            message.error(result.Content);
        }
    }


    // TODO: 传给子组件的参数
    const baseCGDON: any = {
        form, formRef, FormItem, handleCGTempChange,
        CurrencyList, PayMethodList, ARInvoTypeList, APInvoTypeList
    };

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={CGTempInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                params={{UserID: getUserID(), ID: id}}
                // @ts-ignore
                request={async (paramsVal: APIManager.CGTempByIDParams) => saveState ? handleGetCGTempByID(paramsVal) : null}
            >
                {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='Name'
                                placeholder=''
                                label='Template Name'
                                rules={[{required: true, message: 'Template Name is required'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='APUSDRate'
                                label='AP USD Rate'
                                rules={[{required: true, message: 'AP USD Rate is required'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='ARUSDRate'
                                label='AR USD Rate'
                                rules={[{required: true, message: 'AP USD Rate is required'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='ServicesID'
                                label='Services'
                                options={ServicesList}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='PurposeofCallID'
                                label='Purpose of call'
                                options={PurposeOfCallList}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard className={'ant-card'}>
                    <Row gutter={24} style={{marginBottom: 24}}>
                        <Col span={24}>
                            <ChargeTemplateChargeTable
                                CGType={1}
                                label={'AR'}
                                {...baseCGDON}
                                CGList={ARListVO}
                                InvoTypeList={ARInvoTypeList}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <FormItem label={APListVO} name={'APListVO'}>
                                <ChargeTemplateChargeTable
                                    CGType={1}
                                    label={'AP'}
                                    {...baseCGDON}
                                    CGList={APListVO}
                                    InvoTypeList={APInvoTypeList}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => push({pathname: '/manager/charge-template/dict'})}>返回</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default ChargeTemplateForm;