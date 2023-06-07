import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from "@/components/SearchProFormSelect";


type APIBranch = APIManager.Branch;
const ProjectForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryProjectInfo, addBranch, editBranch
    } = useModel('manager.project', (res: any) => ({
        queryProjectInfo: res.queryProjectInfo,
        addBranch: res.addBranch,
        editBranch: res.editBranch,
    }));

    const {
        queryUser,
    } = useModel('manager.user', (res: any) => ({
        queryUser: res.queryUser,
    }));

    const {
        queryDictDetail,
    } = useModel('manager.dict', (res: any) => ({
        queryDictDetail: res.queryDictDetail,
    }));

    const {
        queryBranch,
    } = useModel('manager.branch', (res: any) => ({
        queryBranch: res.queryBranch,
    }));

    const [ProjectInfoVO, setProjectInfoVO] = useState<any>({});
    const [Manager, setManager] = useState<any>([]);
    const [Industry, setIndustry] = useState<any>([]);
    const [Branch, setBranch] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (params?.id) {
            getData().then()
        }
    }, [params?.id])
    //endregion

    async function getData() {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // const param: any = {currentPage: 1};
        const managersResult: API.Result = await queryUser({currentPage: 1});
        const industryResult: API.Result = await queryDictDetail({dictId: "1666281726138064897"});
        const branchResult: API.Result = await queryBranch({currentPage: 1});
        setLoading(false);
        if (managersResult.success) {
            setManager(managersResult.data);
        } else {
            message.error(managersResult.message);
        }
        if (industryResult.success) {
            setIndustry(industryResult.data);
        } else {
            message.error(industryResult.message);
        }
        if (branchResult.success) {
            setBranch(branchResult.data);
        } else {
            message.error(branchResult.message);
        }
        return managersResult;
    }

    /**
     * @Description: TODO: 获取 项目 详情
     * @author LLS
     * @date 2023/6/7
     * @returns
     */
    const handleGetProjectInfo = async () => {
        setLoading(true);
        const result: any = await queryProjectInfo({id});
        setProjectInfoVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/6/7
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBranch) => {
        setLoading(true);
        val.defaultPortId = 0;
        let result: API.Result;
        // TODO: add 添加
        if (id === '0') {
            result = await addBranch(val);
        } else {
            // TODO: 保存
            val.id = id;
            result = await editBranch(val);
        }
        if (result.success) {
            message.success('success');
            if (id === '0') history.push({pathname: `/manager/branch/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author LLS
     * @date 2023/6/7
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    const managerOption = Manager?.map((option: any) => ({
        value: option.id, label: option.nameDisplay
    }));

    const industryOption = Industry?.map((option: any) => ({
        value: option.dictId, label: option.dictLabel
    }));

    const branchOption = Branch?.map((option: any) => ({
        value: option.id, label: option.nameFullEn
    }));

    return (
        <PageContainer
            loading={loading}
            header={{breadcrumb: {},}}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={ProjectInfoVO}
                formKey={'cv-center-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetProjectInfo()}
            >
                <ProCard title={'Name & Code'}>
                    {/* TODO: Full Name、Short Name、Code、Manager */}
                    <Row gutter={24}>
                        <Col span={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Full Name'
                                name='nameFull'
                                rules={[{required: true, message: 'Full Name is required'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                name='nameShort'
                                rules={[{required: true, message: 'Short Name is required'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Code'
                                name='code'
                                rules={[{required: true, message: 'Code is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormSelect
                                required
                                name="managerId"
                                label="Manager"
                                initialValue={{ value: ProjectInfoVO?.managerId }}
                                options={managerOption}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Oracle ID'
                                name='oracleId'
                                rules={[{required: true, message: 'Oracle ID is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormSelect
                                required
                                name="industryType"
                                label="Industry"
                                initialValue={{ value: ProjectInfoVO?.industryType }}
                                options={industryOption}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormSelect
                                required
                                name="branchId"
                                label="Company"
                                initialValue={{ value: ProjectInfoVO?.branchId }}
                                options={branchOption}
                            />
                        </Col>
                        <Col span={6}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                required={true}
                                label="Contract"
                                id={'contractId'}
                                name={'contractId'}
                                url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                                // valueObj={{value: Carrier?.BookingAgentID, label: Carrier?.BookingAgentName}}
                                query={{ }}
                                // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                            />
                        </Col>
                    </Row>

                </ProCard>

                <FooterToolbar
                    extra={<Button onClick={() => history.push({pathname: '/manager/project/list'})}>返回</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default ProjectForm;