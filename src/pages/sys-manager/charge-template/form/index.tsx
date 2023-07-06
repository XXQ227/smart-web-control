import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import ChargeTemplateChargeTable from './charge'
import ls from 'lodash'

const FormItem = Form.Item;

type APICGTemp = APIManager.CGTemp;
type CGTempItems = APIManager.CGTempItems;


const ChargeTemplateForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const {push, location: {pathname}} = history;
    const formRef = useRef<ProFormInstance>();
    const id = atob(params?.id);

    const {
        addChargeTemplate, queryChargeTemplateInfo, editChargeTemplate,
    } = useModel('manager.charge-template', (res: any) => ({
        addChargeTemplate: res.addChargeTemplate,
        queryChargeTemplateInfo: res.queryChargeTemplateInfo,
        editChargeTemplate: res.editChargeTemplate,
    }));

    const {
        queryDictCommon, ServicesList, PurposeOfCallList, CurrencyList, PayMethodList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        queryDictDetailCommon: res.queryDictDetailCommon,
        ServicesList: res.ServicesList,
        PurposeOfCallList: res.PurposeOfCallList,
        CurrencyList: res.CurrencyList,
        PayMethodList: res.PayMethodList,
    }))

    const [loading, setLoading] = useState<boolean>(false);
    const [CGTempInfoVO, setCGTempInfoVO] = useState<any>({});
    const [ARListVO, setARListVO] = useState<CGTempItems[]>([]);
    const [APListVO, setAPListVO] = useState<CGTempItems[]>([]);

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCGTempByID(paramsVal: APICGTemp) {
        const dictCodes: any = [];
        if (ServicesList?.length === 0) dictCodes.push('services');
        if (PurposeOfCallList?.length === 0) dictCodes.push('purpose_of_call');
        if (CurrencyList?.length === 0) dictCodes.push('currency');
        if (PayMethodList?.length === 0) dictCodes.push('pay_method');
        if (dictCodes?.length > 0) {
            await queryDictCommon({dictCodes});
        }
        setLoading(true);
        if (id !== '0') {
            const result: API.Result = await queryChargeTemplateInfo(paramsVal);
            if (result.success) {
                setCGTempInfoVO(result.data);
                form.setFieldsValue({
                    name: result.data.name,
                    servicesType: result.data.servicesType,
                    purposeOfCallType: result.data.purposeOfCallType
                });
                setARListVO(result.data.chargeTemplateItemARList);
                setAPListVO(result.data.chargeTemplateItemAPList);
            } else {
                message.error(result.message);
            }
            setLoading(false);
            return result.data;
        } else {
            return {};
        }
    }

    /**
     * @Description: TODO: 模板费用行的 onChange 事件
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

    /**
     * @Description: TODO: 模板费用信息重新取值
     * @author XXQ
     * @date 2023/6/25
     * @param cgArr
     * @returns
     */
    const getCGInfo = (cgArr: CGTempItems[]) => {
        return cgArr.map((item: CGTempItems) => ({
            id: item.id && item.id.indexOf('ID_') > -1 ? '' : item.id,
            type: item.type, branchId: item.branchId,
            currencyType: item.currencyType,
            chargeTemplateId: item.chargeTemplateId,
            chargeItemId: item.chargeItemId,
            unitType: item.unitType,
            payMethod: item.payMethod,
            unitPrice: item.unitPrice,
        }))
    }

    /**
     * @Description: TODO: 保存模板数据
     * @author XXQ
     * @date 2023/6/25
     * @param values    模板数据
     * @returns
     */
    const handleSave = async (values: any) => {
        setLoading(true);
        const saveId = pathname.indexOf('/copy') > -1 ? 0 : id;
        const saveResult: any = {
            id: saveId,
            branchId: '0',
            name: values.name,
            servicesType: values.servicesType,
            purposeOfCallType: values.purposeOfCallType,
            chargeTemplateItemList: [],
        };
        // TODO: 模板费用保存，字符串的费用 id 变成 0
        if (ARListVO?.length > 0) {
            let arList: CGTempItems[] = ls.cloneDeep(ARListVO);
            arList = getCGInfo(arList) || [];
            saveResult.chargeTemplateItemList.push(...arList);
        }
        if (APListVO?.length > 0) {
            let apList: CGTempItems[] = ls.cloneDeep(APListVO);
            apList = getCGInfo(apList) || [];
            saveResult.chargeTemplateItemList.push(...apList);
        }
        let result: API.Result;
        if (saveId === '0') {
            result = await addChargeTemplate(saveResult);
        } else {
            result = await editChargeTemplate(saveResult);
        }
        setLoading(false);
        if (result.success) {
            message.success('Success!');
            if (saveId === '0') {
                history.push({pathname: `/manager/charge-template/form/${btoa(result.data)}`})
            }
        } else {
            message.error(result.message);
        }
    }
    
    // TODO: 传给子组件的参数
    const baseCGDON: any = {
        form, formRef, FormItem, handleCGTempChange, CurrencyList, PayMethodList, chargeTemplateId: id
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
                omitNil={false}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput={true}
                formKey={'charge-template'}
                // TODO: 设置默认值
                initialValues={CGTempInfoVO}
                // initialValues={{name: CGTempInfoVO.name, servicesType: CGTempInfoVO.servicesType, purposeOfCallType: CGTempInfoVO.purposeOfCallType, }}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => handleGetCGTempByID({id})}
            >
                {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='name'
                                placeholder=''
                                label='Template Name'
                                // initialValue={CGTempInfoVO.name}
                                rules={[{required: true, message: 'Template Name is required'}]}
                            />
                            {/*<FormItem
                                required
                                id='name'
                                name='name'
                                label='Template Name'
                                initialValue={CGTempInfoVO.name}
                            >
                                <Input autoComplete={'off'} />
                            </FormItem>*/}
                            {/*<FormItemInput
                                required
                                id='name'
                                name='name'
                                placeholder=''
                                label='Template Name'
                                FormItem={Form.Item}
                                initialValue={CGTempInfoVO.name}
                                rules={[{required: true, message: 'Template Name is required'}]}
                            />*/}
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='servicesType'
                                label='Services'
                                options={ServicesList}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='purposeOfCallType'
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
                                dataLabel={'ARListVO'}
                                {...baseCGDON}
                                CGList={ARListVO}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <FormItem>
                                <ChargeTemplateChargeTable
                                    CGType={2}
                                    label={'AP'}
                                    dataLabel={'APListVO'}
                                    {...baseCGDON}
                                    CGList={APListVO}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => push({pathname: '/manager/charge-template'})}>Back</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default ChargeTemplateForm;