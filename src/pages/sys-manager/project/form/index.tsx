import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormDatePicker,
    ProFormCheckbox,
    ProFormSelect,
    ProFormText, ProFormTextArea,
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from "@/components/SearchProFormSelect";
import {LeftOutlined, SaveOutlined} from "@ant-design/icons";
import {BRANCH_ID} from '@/utils/auths'

type APIProject = APIManager.Project;

const ProjectForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryProjectInfo, addProject, editProject
    } = useModel('manager.project', (res: any) => ({
        queryProjectInfo: res.queryProjectInfo,
        addProject: res.addProject,
        editProject: res.editProject,
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

    const [ProjectInfoVO, setProjectInfoVO] = useState<any>({});
    const [Manager, setManager] = useState<any>([]);
    const [Industry, setIndustry] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function getData() {
        // TODO: 分页查询【参数页】
        const managersResult: API.Result = await queryUser({currentPage: 1});
        const industryResult: API.Result = await queryDictDetail({dictId: "1666281726138064897"});
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
    }

    /**
     * @Description: TODO: 获取 项目 详情
     * @author LLS
     * @date 2023/6/8
     * @returns
     */
    const handleGetProjectInfo = async () => {
        setLoading(true);
        const result: any = await queryProjectInfo({id});
        await getData()
        setProjectInfoVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/6/8
     * @param val
     * @returns
     */
    const onFinish = async (val: APIProject) => {
        setLoading(true);
        let result: API.Result;
        const portion = val.portion;
        const param: any = {
            code: val.code,
            nameFull: val.nameFull,
            nameShort: val.nameShort,
            managerId: val.managerId,
            oracleId: val.oracleId,
            branchId: BRANCH_ID(),
            industryType: val.industryType,
            contractId: val.contractId || '',
            pmsCode: val.pmsCode,
            portionAFlag: portion?.includes('A') ? 1 : 0,
            portionBFlag: portion?.includes('B') ? 1 : 0,
            portionCFlag: portion?.includes('C') ? 1 : 0,
            startDate: val.startDate,
            endDate: val.endDate,
            remark: val.remark,
        };
        if (id === '0') {
            // TODO: 新增项目
            result = await addProject(param);
        } else {
            // TODO: 编辑项目
            param.id = id;
            result = await editProject(param);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/project/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author LLS
     * @date 2023/6/8
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    const managerOption = Manager?.map((option: any) => ({
        value: option.id, label: option.nameDisplay
    }));

    const industryOption = Industry?.map((option: any) => ({
        value: option.value, label: option.name
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
                formKey={'project-information'}
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
                                placeholder=''
                                name="managerId"
                                label="Manager"
                                initialValue={ProjectInfoVO?.managerId}
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
                                placeholder=''
                                name="industryType"
                                label="Industry"
                                initialValue={ProjectInfoVO?.industryType}
                                options={industryOption}
                            />
                        </Col>
                        <Col span={8}>
                            <SearchProFormSelect
                                required
                                qty={5}
                                isShowLabel={true}
                                label="Contract"
                                id={'contractId'}
                                name={'contractId'}
                                filedValue={'id'} filedLabel={'nameFullEn'}
                                query={{branchId: BRANCH_ID(), buType: 1}}
                                url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                valueObj={{value: ProjectInfoVO?.contractId, label: ProjectInfoVO?.contractName}}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                placeholder=''
                                label='PMS Code'
                                name='pmsCode'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormDatePicker
                                required
                                placeholder=''
                                name="startDate"
                                label="Start Date"
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormDatePicker
                                required
                                placeholder=''
                                name="endDate"
                                label="End Date"
                            />
                        </Col>
                        <Col span={10}>
                            <ProFormCheckbox.Group
                                required
                                name="portion"
                                label="Portion"
                                options={['A', 'B', 'C']}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                fieldProps={{rows: 5}}
                                name="remark"
                                label="Remark"
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button onClick={() => history.push({pathname: '/manager/project/list'})} icon={<LeftOutlined/>}>Back</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'} icon={<SaveOutlined/>}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default ProjectForm;