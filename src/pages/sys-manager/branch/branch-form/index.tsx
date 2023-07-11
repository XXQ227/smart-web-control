import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel} from 'umi'
import {getFormErrorMsg, rowGrid} from '@/utils/units'
import BankIndex from '@/pages/sys-manager/branch/branch-form/bank'
import SearchProFormSelect from '@/components/SearchProFormSelect'

type APIBranch = APIManager.Branch;
type APIBank = APIManager.Bank;

export type LocationState = Record<string, unknown>;

const BranchForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryBranchInfo, addBranch, editBranch
    } = useModel('manager.branch', (res: any) => ({
        queryBranchInfo: res.queryBranchInfo,
        addBranch: res.addBranch,
        editBranch: res.editBranch,
    }));

    const {
        deleteBank
    } = useModel('manager.bank', (res: any) => ({
        deleteBank: res.deleteBank,
    }));

    const [BranchInfoVO, setBranchInfoVO] = useState<any>({});
    const [BankListVO, setBankListVO] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    //endregion

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetBranchInfo = async () => {
        setLoading(true);
        const result: any = await queryBranchInfo({id});
        if (result.success) {
            setBranchInfoVO(result.data);
            setBankListVO(result.data?.bankAccountList);
        } else {
            message.error(result.message);
        }
        setLoading(false);
        delete result.code
        return result;
    }

    function filterObjects(arr: APIBank[]): (Omit<APIBank, "id"> | APIBank)[] | undefined {
        return arr?.map(obj => {
            if (obj?.isChange && obj?.isChange === true && obj.id.indexOf('ID_') > -1) {
                // eslint-disable-next-line @typescript-eslint/no-shadow,@typescript-eslint/no-unused-vars
                const { id, ...rest } = obj;
                return rest;
            } else {
                return obj;
            }
        });
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBranch) => {
        setLoading(true);
        let result: API.Result;
        const newBankList = filterObjects(BankListVO);
        const param: any = {
            contactName: val.contactName,
            phone: val.phone,
            address: val.address,
            cityName: val.cityName,
            code: val.code,
            defaultPortId: 0,
            funcCurrencyName: val.funcCurrencyName,
            nameFullEn: val.nameFullEn,
            nameFullLocal: val.nameFullLocal,
            nameShortEn: val.nameShortEn,
            nameShortLocal: val.nameShortLocal,
            orgId: val.orgId,
            orgCreateId: val.orgCreateId,
            parentId: val.parentId,
            taxNum: val.taxNum,
            currencies: val.currencies,
            bankAccountEntityList: newBankList,
        };
        if (id === '0') {
            // TODO: 新增公司
            result = await addBranch(param);
        } else {
            // TODO: 编辑公司
            param.id = id;
            result = await editBranch(param);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/branch/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    /**
     * @Description: TODO: 操作数据
     * @author LLS
     * @date 2023/7/5
     * @param data      操作后的数据
     * @returns
     */
    const handleChangeBank = (data: any) => {
        setBankListVO(data)
    }

    /**
     * @Description: TODO: 删除银行
     * @author LLS
     * @date 2023/7/6
     * @param bankAccountId
     */
    const handleOperateBank = async (bankAccountId: string) => {
        const bankAccountIds = (BranchInfoVO.bankAccountIds).replace(new RegExp(`\\b${bankAccountId}\\b,?`), '');
        const param: any = {
            branchId: id,
            bankAccountId,
            bankAccountIds,
        };
        const result: API.Result = await deleteBank(param)
        if (result.success) {
            BranchInfoVO.bankAccountIds = bankAccountIds;
        }
        return result;
    }

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
                initialValues={BranchInfoVO}
                formKey={'branch-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetBranchInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name'
                                name='nameFullEn'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name'}, {max: 500, message: 'length: 500'}]}
                            />
                            <ProFormText
                                required
                                placeholder=''
                                label='Name Local'
                                name='nameFullLocal'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name Local'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                tooltip='length: 100'
                                name='nameShortEn'
                                rules={[{required: true, message: 'Short Name'}, {max: 100, message: 'length: 100'}]}
                            />
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name Local'
                                tooltip='length: 100'
                                name='nameShortLocal'
                                rules={[{required: true, message: 'Short Name Local'}, {
                                    max: 100,
                                    message: 'length: 100'
                                }]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                            <ProFormText
                                name='orgId'
                                placeholder=''
                                label='Oracle ID'
                                tooltip='length: 15'
                                rules={[{max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Contact'
                                tooltip='length: 30'
                                name='contactName'
                                rules={[{required: true, message: 'Contact'}, {max: 30, message: 'length: 30'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Phone'
                                tooltip='length: 30'
                                name='phone'
                                rules={[{required: true, message: 'Phone'}, {max: 30, message: 'length: 30'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                name='cityName'
                                placeholder=''
                                label='City'
                                rules={[{required: true, message: 'City'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                placeholder=''
                                label='AUC Num'
                                tooltip='length: 15'
                                name='orgCreateId'
                                rules={[{max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                required
                                placeholder=''
                                label='Currency'
                                name='funcCurrencyName'
                                rules={[{required: true, message: 'Currency'}]}
                                options={[
                                    {label: 'HKD', value: 'HKD'},
                                    {label: 'CNY', value: 'CNY'},
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='code'
                                placeholder=''
                                label='Code'
                                tooltip='length: 10'
                                rules={[{max: 10, message: 'length: 10'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={5}>
                            <ProFormSelect
                                required
                                name='currencies'
                                mode="multiple"
                                placeholder=""
                                label="Currencies"
                                rules={[{required: true, message: 'Currencies'}]}
                                options={[
                                    {label: 'HKD', value: 'HKD'},
                                    {label: 'USD', value: 'USD'},
                                    {label: 'SGD', value: 'SGD'},
                                    {label: 'CNY', value: 'CNY'},
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <SearchProFormSelect
                                qty={10}
                                isShowLabel={true}
                                required={false}
                                label="Parent Company"
                                id={'parentId'}
                                name={'parentId'}
                                url={"/apiBase/branch/queryBranchCommon"}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                name='address'
                                placeholder=''
                                label='Address'
                                tooltip='length: 300'
                                rules={[{required: true, message: 'Address'}, {max: 300, message: 'length: 300'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard className={'ant-card-pro-table'}>
                    <BankIndex
                        BankList={BankListVO}
                        handleChangeBank={(data: any) => handleChangeBank(data)}
                        handleOperateBank={(bankAccountId: string) => handleOperateBank(bankAccountId)}
                    />
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => history.push({
                            pathname: '/manager/branch/list',
                            state: {
                                searchParams: state ? (state as LocationState)?.searchParams : '',
                            },
                        })}
                    >Back</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>

            </ProForm>
        </PageContainer>
    )
}
export default BranchForm;