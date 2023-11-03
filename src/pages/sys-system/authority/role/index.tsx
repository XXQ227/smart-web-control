import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Button, Form, Input, message, Popconfirm} from 'antd'
import type { DataNode } from 'antd/es/tree';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {IconFont, getFormErrorMsg, ID_STRING, funcTransferTreeData} from '@/utils/units'
import DividerCustomize from '@/components/Divider'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSwitch from '@/components/FormItemComponents/FormItemSwitch'
import AuthListTree from '@/pages/sys-system/authority/role/modal-form'

const {Search} = Input;

type APIRole = APISystem.Role;
type APISearchRole = APISystem.SearchRoleParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchRole = {
    keyword: '',
    currentPage: 1,
    pageSize: 15,
};

const RoleIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const {
        queryRole, deleteRole, addRole, editRole, operateRole, queryAuthResourceTree
    } = useModel('system.auth', (res: any) => ({
        queryRole: res.queryRole, deleteRole: res.deleteRole,
        addRole: res.addRole, editRole: res.editRole, operateRole: res.operateRole,
        queryAuthResourceTree: res.queryAuthResourceTree,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [RoleListVO, setRoleListVO] = useState<APIRole[]>([]);
    const [authInfoVO, setAuthInvoVO] = useState<any>({});
    const [authListVO, setAuthListVO] = useState<any[]>([]);

    const [open, setOpen] = useState<boolean>(false);
    const [opIndex, setOpIndex] = useState<number>(0);
    const [authRecord, setAuthRecord] = useState<any>({});

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    const handleGetRoleList = async (params: APISearchRole) => {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryRole(params);
        setLoading(false);
        if (result.success) {
            setRoleListVO(result.data);
        } else {
            message.error(result.message);
        }
        return result;
    }

    const handleAddAuth = () => {
        const addDataObj: APIRole = {
            id: ID_STRING(), isChange: true, roleName: '', roleCode: '', remark: '', readOnly: false
        };
        const newData: APIRole[] = ls.cloneDeep(RoleListVO);
        newData.splice(0, 0, addDataObj);
        setRoleListVO(newData);
    }

    /**
     * @Description: TODO: 编辑当前行
     * @author XXQ
     * @date 2023/6/9
     * @param index     当前行序号
     * @param record    操作行数据
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleChangeRole = (index: number, record: APIRole, filedName: string,  val: any) => {
        const newData: APIRole[] = ls.cloneDeep(RoleListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setRoleListVO(newData);
    }

    const handleSaveRole = async (index: number, record: APIRole) => {
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: APIRole[] = ls.cloneDeep(RoleListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    ...record, roleName: record.roleName?.trim(),
                    readOnly: record.readOnly ? 1 : 0,
                };

                const isAdd = record?.id?.indexOf('ID_') > -1;
                // TODO: 添加
                if (isAdd) {
                    params.id = '';
                    result = await addRole(params);
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editRole(params);
                }
                if (result.success) {
                    message.success('Success');
                    if (isAdd) record.id = result.data;
                    record.isChange = false;
                    newData.splice(index, 1, record);
                    setRoleListVO(newData);
                } else {
                    message.error(result.message);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    /**
     * @Description: TODO: 删除权限
     * @author XXQ
     * @date 2023/6/8
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     lock：解锁、锁定用户；delete：删除
     * @returns
     */
    const handleOperateRole = async (record: APIRole, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const params: any = {id: record.id};
        const newData: APIRole[] = ls.cloneDeep(RoleListVO);
        // TODO: 【删除】 操作
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) {
                result.success = true;
            } else {
                result = await deleteRole(params);
            }
            // TODO: 删除当前行，更新本地数据
            newData.splice(index, 1);
        } else {
            params.enableFlag = !record.enableFlag;
            result = await operateRole(params);

        }
        if (result.success) {
            message.success('Success!');
            if (state === 'enableFlag') {
                record.enableFlag = params.enableFlag;
                newData.splice(index, 1, record);
            }
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setRoleListVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 打开弹框
     * @author XXQ
     * @date 2023/11/2
     * @param index     操作行序列
     * @param record    操作行信息
     * @returns
     */
    const handleDetail = async (index: number, record: any) => {
        const result: API.Result = await queryAuthResourceTree({id: 0});
        let treeData: DataNode[] = [];
        if (result.success) {
            treeData = funcTransferTreeData(result.data);
            setAuthListVO(treeData);
            setOpen(true);
            setOpIndex(index);
            setAuthRecord(record);
        }
    }

    // TODO: 更新选种的
    const handleSaveAuth = (val: any) => {
        // TODO: 把选中的权限
        const _newAuthObj: any = {...authRecord, ...val, isChange: true};
        const newData: APIRole[] = ls.cloneDeep(RoleListVO);
        newData.splice(opIndex, 1, _newAuthObj);
        setRoleListVO(newData);
        setOpen(false);
    }


    const columns: ProColumns<APIRole>[] = [
        {
            title: 'Name', dataIndex: 'roleName', align: 'left', width: 200,
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId ? text :
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.roleName}
                        id={`roleName_table_${record.id}`}
                        name={`roleName_table_${record.id}`}
                        rules={[{required: true, message: 'Name'}]}
                        onChange={(val: any) => handleChangeRole(index, record, 'roleName', val)}
                    />
        },
        {
            title: 'Code', dataIndex: 'roleCode', align: 'left', width: 200,
            tooltip: 'Code is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId ? text :
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.roleCode}
                        id={`roleCode_table_${record.id}`}
                        name={`roleCode_table_${record.id}`}
                        rules={[{required: true, message: 'Icon'}]}
                        onChange={(val: any) => handleChangeRole(index, record, 'roleCode', val)}
                    />
        },
        {
            title: 'Remark', dataIndex: 'remark', align: 'left',
            render: (text: any, record: any, index) =>
                record.parentId ? text :
                    <FormItemInput
                        placeholder=''
                        initialValue={record.url}
                        disabled={record.enableFlag}
                        id={`remark_table_${record.id}`}
                        name={`remark_table_${record.id}`}
                        onChange={(val: any) => handleChangeRole(index, record, 'remark', val)}
                    />
        },
        {
            title: 'Read-only', dataIndex: 'readOnly', align: 'center', width: 90,
            render: (text: any, record: any, index) =>
                record.parentId ? text :
                    <FormItemSwitch
                        initialValue={!!record.readOnly}
                        id={`readOnly_table_${record.id}`}
                        name={`readOnly_table_${record.id}`}
                        onChange={(e) => handleChangeRole(index, record, 'readOnly', e)}
                    />
        },
        {
            title: 'update time', dataIndex: 'updateTime', align: 'center', width: 100, valueType: 'date',
        },
        {
            title: 'Action', width: 120, align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveRole(index, record)}
                        />
                        <DividerCustomize hidden={!record.isChange}/>
                        <IconFont hidden={isAdd} type={'icon-details'} onClick={() => handleDetail(index, record)}/>
                        <DividerCustomize />
                        <IconFont
                            hidden={isAdd}
                            type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}
                            onClick={() => handleOperateRole(record, index, 'enableFlag')}
                        />
                        <Popconfirm
                            disabled={false}
                            okText={'Yes'} cancelText={'No'}
                            title={`Are you sure to delete?`}
                            onConfirm={() => handleOperateRole(record, index, 'deleteFlag')}
                        >
                            <DividerCustomize hidden={isAdd}/>
                            <DeleteOutlined
                                color={'red'} disabled={false}
                                title={'Please delete the child permissions first.'}
                            />
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <Form form={form}>
                <ProCard className={'ant-card-pro-table'}>
                    <ProTable<APIRole>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={RoleListVO}
                        locale={{emptyText: 'No Data'}}
                        className={'ant-pro-table-edit'}
                        rowClassName={(record: any) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    searchParams.keyword = val;
                                    await handleGetRoleList(searchParams);
                                }}
                            />
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddAuth} type={'primary'} icon={<PlusOutlined/>}>
                                    Add Role
                                </Button>
                            ]
                        }}
                        pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                        // @ts-ignore
                        request={(params: APISearchRole) => handleGetRoleList(params)}
                    />
                </ProCard>
            </Form>

            {!open ? null : <AuthListTree
                authListVO={authListVO}
                handleSaveAuth={handleSaveAuth}
                open={open} record={authInfoVO}
                handleCancel={()=> setOpen(false)}
            />}
        </PageContainer>
    )
}
export default RoleIndex;