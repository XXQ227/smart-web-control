import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {
    FooterToolbar, PageContainer, ProCard, ProForm, ProFormSwitch, ProFormText, ProTable
} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Button, Col, Divider, Form, Input, message, Popconfirm, Row, Space} from 'antd'
import {SALES_ENUM} from '@/utils/enum'
import {getFormErrorMsg, IconFont} from '@/utils/units'
import UserDrawerForm from '@/pages/sys-system/user/user-drawer-form'
import {DeleteOutlined} from '@ant-design/icons'
import ls from 'lodash'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {BRANCH_ID} from '@/utils/auths'

const {Search} = Input;

type APIUser = APISystem.User;
type APISearchUser = APISystem.SearchUserParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchUser = {
    name: '',
};

const UserListIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const {
        queryUser, deleteUser, operateUser, addUser, editUser
    } = useModel('system.user', (res: any) => ({
        queryUser: res.queryUser, deleteUser: res.deleteUser, operateUser: res.operateUser,
        addUser: res.addUser, editUser: res.editUser,
    }));
    // const {queryDepartmentCommon} = useModel('common', (res: any) => ({
    //     queryDepartmentCommon: res.queryDepartmentCommon,
    // }));

    const {queryRoleByUser} = useModel('system.auth', (res: any) => ({
        queryRoleByUser: res.queryRoleByUser,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [userListVO, setUserListVO] = useState<APIUser[]>([]);

    // TODO: 编辑用户信息弹框
    const [open, setOpen] = useState<boolean>(false);
    // TODO: 用户详情
    const [userInfo, setUserInfo] = useState<APIUser>({});
    // TODO: 当前编辑用户数据在集合中的序列好
    const [editIndex, setEditIndex] = useState<number>(-1);
    // TODO: 用户所属部门数据
    const [defaultDepartmentName, setDefaultDepartmentName] = useState('');

    // TODO: 初始化编辑用户的各状态数据
    const handleCloseUseEdit = () => {
        setUserInfo({});
        setDefaultDepartmentName('');
        setOpen(false); setEditIndex(-1);
    }

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetUserList(params: APISearchUser) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryUser(params);
        setLoading(false);
        if(result.success) {
            setUserListVO(result.data);
            handleCloseUseEdit();
        } else {
            message.error(result.message);
        }
        return result;
    }

    /**
     * @Description: TODO: 编辑用户信息
     * @author XXQ
     * @date 2023/11/3
     * @param
     * @returns
     */
    const handleDetail = async (index: number, record: any) => {
        const result: API.Result = await queryRoleByUser({});
        if (result.success) {
            console.log(result);
            setLoading(true);
            setUserInfo(record);
            form.setFieldsValue(record);
            setDefaultDepartmentName(record.defaultDepartmentName);
            setOpen(true);
            setEditIndex(index);
            setLoading(false);
        } else {
            message.error(result.message);
        }
    }

    /**
     * @Description: TODO: 编辑用户信息
     * @author XXQ
     * @date 2023/5/26
     * @param index     序号
     * @param record    user 信息
     * @param state     操作状态
     * @returns {}
     */
    const handleSaveUser = async (index: number, record: APIUser, state: string) => {
        const newData: APIUser[] = ls.cloneDeep(userListVO);
        // TODO: 保存、添加
        newData.splice(index, state === 'add' ? 0 : 1, record);
        setUserListVO(newData);
    }

    /**
     * @Description: TODO: 冻结删除用户
     * @author XXQ
     * @date 2023/6/5
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     lock：解锁、锁定用户；delete：删除
     * @returns
     */
    const handleOperateUser = async (record: APIUser, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const params: any = {id: record.id};
        const newData: APIUser[] = ls.cloneDeep(userListVO);
        // TODO: 【删除】 操作
        if (state === 'delete') {
            result = await deleteUser(params);
            // TODO: 删除当前行，更新本地数据
            record.deleteFlag = record.deleteFlag ? 0 : 1;
            newData.splice(index, 1);
        }
        // TODO: 【锁定/解锁】 操作
        else if (state === 'lock') {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateUser(params);
            // TODO: 更新本地数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            setUserListVO(newData);
        } else {
            message.error(result.message);
            setLoading(false);
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
        setLoading(true);
        form.validateFields()
            .then(async () => {
                console.log(values);
                values.leaderId = 0;
                values.branchId = BRANCH_ID();
                values.salesFlag = values.salesFlag ? 1 : 0;
                values.defaultDepartmentName = defaultDepartmentName;

                let result: API.Result;
                // TODO: 保存、添加 公共参数
                // TODO: 添加
                if (userInfo.id) {
                    // TODO: 编辑
                    values.id = userInfo.id;
                    result = await editUser(values);
                } else {
                    result = await addUser(values);
                    values.id = result.data;
                }
                if (result.success) {
                    message.success('Success');
                    handleSaveUser(editIndex, values, 'edit');
                    if (result.success) setOpen(false);
                } else {
                    message.error(result.message);
                }
                setLoading(false);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
                setLoading(false);
            });
    }


    const columns: ProColumns<APIUser>[] = [
        {title: 'Display Name', dataIndex: 'nameDisplay', disable: true, align: 'center',},
        {title: 'Login Name', dataIndex: 'nameLogin', disable: true, align: 'center',},
        {title: 'Email', dataIndex: 'email', width: 160, disable: true, ellipsis: true,},
        {title: 'Department', dataIndex: 'defaultDepartmentName', width: 150, disable: true, align: 'center',},
        {title: 'Sinotrans Code', dataIndex: 'codeSino', width: 160, disable: true, align: 'center',},
        {title: 'Sales', dataIndex: 'salesFlag', width: 160, disable: true, align: 'center', valueEnum: SALES_ENUM,},
        {title: 'Action', width: 110, disable: true, align: 'center', className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <IconFont type={'icon-details'} onClick={() => handleDetail(index, record)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleOperateUser(record, index, 'lock')}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <Divider type='vertical'/>
                            <IconFont type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            title={`Are you sure to delete?`}
                            onConfirm={() => handleOperateUser(record, index, 'delete')}
                        >
                            <Divider type='vertical'/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    console.log(userInfo);

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card ant-card-pro-table'}>
                <ProTable<APIUser>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={userListVO}
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.name = val;
                                await handleGetUserList(searchParams);
                            }}
                        />
                    }
                    toolbar={{actions: [
                        <UserDrawerForm
                            key={'edit'} isCreate={true} UserInfo={{}}
                            handleSave={(val: any)=> handleSaveUser(0, val, 'add')}
                        />]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchUser) => handleGetUserList(params)}
                />
            </ProCard>

            {/* 用户详情数据 */}
            <ProCard loading={loading} title={'User Info'} className={'ant-card-pro-table'} hidden={!open}>
                <ProForm
                    form={form}
                    // TODO: 不清空为 null 的数据
                    omitNil={false}
                    // TODO: 不显示 提交按钮
                    submitter={false}
                    // TODO: 自动 focus 表单第一个输入框
                    autoFocusFirstInput={true}
                    // TODO: 设置默认值
                    initialValues={userInfo}
                    // TODO: 提交数据
                    onFinish={handleSave}
                    onFinishFailed={handleSave}
                    request={async () => userInfo}
                >
                    {/** // TODO: Display Name、Login Name、Password、Sales */}
                    <Row gutter={24}>
                        <Col span={7}>
                            <ProFormText
                                required
                                placeholder=''
                                name='nameDisplay'
                                label='Display Name'
                                fieldProps={{autoComplete: 'off'}}
                                rules={[{required: true, message: 'Display Name'}]}
                            />
                        </Col>
                        <Col span={7}>
                            <ProFormText
                                required
                                placeholder=''
                                name='nameLogin'
                                label='Login Name'
                                fieldProps={{autoComplete: 'off'}}
                                rules={[{required: true, message: 'Login Name'}]}
                            />
                        </Col>
                        <Col span={7}>
                            <ProFormText.Password
                                required
                                placeholder=''
                                name='password'
                                label='Password'
                                fieldProps={{autoComplete: 'off'}}
                                rules={[{required: true, message: 'Password'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormSwitch
                                name='salesFlag'
                                label='Sales'
                                fieldProps={{
                                    checkedChildren: 'Yes',
                                    unCheckedChildren: 'No',
                                }}
                            />
                        </Col>
                    </Row>
                    {/* // TODO: Email */}
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormText
                                required name='email' label='Email' placeholder=''
                                rules={[
                                    {required: true, message: 'Email'},
                                    {
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'The email format is incorrect.'
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText placeholder='' name='phone' label='Phone'/>
                        </Col>
                        <Col span={6}>
                            <ProFormText placeholder='' name='codeSino' label='Sinotrans ID'/>
                        </Col>
                        <Col span={6}>
                            <ProFormText placeholder='' name='codeF8' label='F8 Authority Code'/>
                        </Col>
                        <Col span={6}>
                            <SearchProFormSelect
                                // required={true}
                                isShowLabel={true}
                                placeholder=''
                                label='Department'
                                id='departmentId'
                                name='defaultDepartmentId'
                                url={'/apiBase/department/queryDepartmentCommon'}
                                handleChangeData={(val, option: any) => setDefaultDepartmentName(option.label)}
                            />
                        </Col>
                        <Col span={6}>
                            <SearchProFormSelect
                                isShowLabel={true} placeholder=''
                                id='leaderId' name='defaultLeaderId' label='Superior'
                                url={'/apiBase/department/queryDepartmentCommon'}
                            />
                        </Col>
                    </Row>
                    <FooterToolbar extra={<Button onClick={() => handleCloseUseEdit()}>Cancel</Button>}>
                        <Space>
                            <Button type='primary' htmlType={'submit'}>Submit</Button>
                        </Space>
                    </FooterToolbar>
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}
export default UserListIndex;