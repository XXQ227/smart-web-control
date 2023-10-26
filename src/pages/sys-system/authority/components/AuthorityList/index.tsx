import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {useModel, useParams} from 'umi';
import {Button, Form, Input, message, Popconfirm} from 'antd'
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {getFormErrorMsg, IconFont, ID_STRING} from '@/utils/units'
import DividerCustomize from '@/components/Divider'
import ModalLevel2Auth from '../ModalLevel2Auth'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'

const {Search} = Input;


interface Props {
    AuthList: any[];
    AuthInvoVO: any;
}

const AuthListIndex: React.FC<Props> = (props) => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();

    const {AuthList, AuthInvoVO} = props;

    const {
        queryAuthResourceTree, deleteAuthResource, addAuthResource, editAuthResource,
    } = useModel('system.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
        deleteAuthResource: res.deleteAuthResource,
        addAuthResource: res.addAuthResource,
        editAuthResource: res.editAuthResource,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AuthResourceListVO, setAuthResourceListVO] = useState<any[]>(AuthList);
    const [AuthParentVO, setAuthParentVO] = useState<any>(AuthInvoVO);

    const [open, setOpen] = useState<boolean>(false);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    const handleQueryAuthResourceTree = async (params: any) => {
        setLoading(true);
        // TODO: 分页查询【参数页】
        let result: any = await queryAuthResourceTree(params);
        setLoading(false);
        if (result.success) {
            setAuthResourceListVO(result.children);
            result = {data: result.children, success: true, message: '',};
            delete result.children;
            setAuthParentVO(result);
        } else {
            message.error(result.message);
        }
        console.log(result);
        return result;
    }

    // TODO: 添加权限
    const handleAddAuth = () => {
        const addDataObj: any = {
            id: ID_STRING(), isChange: true, name: '', url: '', icon: '',
            // TODO: parentId：上一层的 id；parentIds：上一层的 parentIds + 上一层自己的 id
            parentId: AuthParentVO.id || '', parentIds: (AuthParentVO.parentIds || '') + AuthParentVO.id
        };
        console.log(addDataObj);
        const newData: any[] = ls.cloneDeep(AuthResourceListVO);
        newData.splice(0, 0, addDataObj);
        setAuthResourceListVO(newData);
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
    const handleChangeAuthResource = (index: number, record: any, filedName: string, val: any) => {
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        AuthResourceListVO.splice(index, 1, record);
        setAuthResourceListVO(AuthResourceListVO);
    }

    const handleSaveAuthResource = async (index: number, record: any, state?: string) => {
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: any[] = ls.cloneDeep(AuthResourceListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    name: record.name, icon: record.icon, url: record.url, level: 1, type: 1, sort: 1,
                    parentId: record.parentId || '', parentIds: record.parentIds || ''
                };
                // TODO: 添加
                if (state === 'add') {
                    result = await addAuthResource(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editAuthResource(params);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('Success');
                    setAuthResourceListVO(newData);
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
    const handleOperateAuthResource = async (record: any, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const newData: any[] = ls.cloneDeep(AuthResourceListVO);
        // TODO: 【删除】 操作
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) {
                result.success = true;
            } else {
                result = await deleteAuthResource({id: record.id});
            }
            // TODO: 删除当前行，更新本地数据
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            setAuthResourceListVO(newData);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    const handleDetail = async (record: any) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        // history.push({pathname: `/system/authority/auth/level2/form/${btoa(record.id)}`});
        form.resetFields();
        setOpen(true);
        // const result: any = await handleQueryAuthResourceTree({id: record.id});
        // console.log(result);
        // window.location.reload();
    }

    const columns: ProColumns<any>[] = [
        {
            title: 'Name', dataIndex: 'name', align: 'left',
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        id={`name_table_${record.id}`}
                        name={`name_table_${record.id}`}
                        initialValue={record.name}
                        disabled={record.enableFlag}
                        rules={[{required: true, message: 'Name'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'name', val)}
                    /> : text
        },
        {
            title: 'Identity', dataIndex: 'identityCode', align: 'left', width: 300,
            tooltip: 'Identity is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.identityCode}
                        id={`identityCode_table_${record.id}`}
                        name={`identityCode_table_${record.id}`}
                        rules={[{required: true, message: 'Identity'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'identityCode', val)}
                    /> : text
        },
        {
            title: 'Path Name', dataIndex: 'pathName', align: 'left', width: 300,
            tooltip: 'Path Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.pathName}
                        id={`pathName_table_${record.id}`}
                        name={`pathName_table_${record.id}`}
                        rules={[{required: true, message: 'Path Name'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'pathName', val)}
                    /> : text
        },
        {
            title: 'Url', dataIndex: 'pathUrl', align: 'left', width: 300,
            tooltip: 'Url is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.pathUrl}
                        id={`pathUrl_table_${record.id}`}
                        name={`pathUrl_table_${record.id}`}
                        rules={[{required: true, message: 'Url'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'pathUrl', val)}
                    /> : text
        },
        {
            title: 'Icon', dataIndex: 'icon', align: 'left', width: 300,
            tooltip: 'Icon is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        initialValue={record.icon}
                        disabled={record.enableFlag}
                        id={`icon_table_${record.id}`}
                        name={`icon_table_${record.id}`}
                        rules={[{required: true, message: 'Icon'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'icon', val)}
                    /> : text
        },
        {
            title: 'Redirect', dataIndex: 'redirect', align: 'left', width: 300,
            tooltip: 'Redirect is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.redirect}
                        id={`redirect_table_${record.id}`}
                        name={`redirect_table_${record.id}`}
                        rules={[{required: true, message: 'redirect'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'redirect', val)}
                    /> : text
        },
        {
            title: 'Redirect Path', dataIndex: 'redirectPath', align: 'left', width: 300,
            tooltip: 'Redirect Path is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        disabled={record.enableFlag}
                        initialValue={record.redirectPath}
                        id={`redirectPath_table_${record.id}`}
                        name={`redirectPath_table_${record.id}`}
                        rules={[{required: true, message: 'Redirect Path'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'redirectPath', val)}
                    /> : text
        },
        {
            title: 'Action', width: 100, align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                const haveChildren = !!record?.children?.length;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveAuthResource(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <DividerCustomize hidden={!record.isChange}/>
                        <IconFont hidden={isAdd} type={'icon-details'} onClick={() => handleDetail(record)}/>
                        <Popconfirm
                            disabled={haveChildren}
                            okText={'Yes'} cancelText={'No'}
                            title={`Are you sure to delete?`}
                            onConfirm={() => handleOperateAuthResource(record, index, 'deleteFlag')}
                        >
                            <DividerCustomize hidden={isAdd}/>
                            <DeleteOutlined
                                color={haveChildren ? '#707070' : 'red'} disabled={haveChildren}
                                title={haveChildren ? 'Please delete the child permissions first.' : ''}
                            />
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <Fragment>
            <ProTable<any>
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                dataSource={AuthResourceListVO}
                locale={{emptyText: 'No Data'}}
                className={'ant-pro-table-edit'}
                rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                headerTitle={
                    <Search
                        placeholder='' enterButton="Search" loading={loading}
                        onSearch={async () => await handleQueryAuthResourceTree({id})}
                    />
                }
                toolbar={{
                    actions: [
                        <Button key={'add'} onClick={handleAddAuth} type={'primary'} icon={<PlusOutlined/>}>
                            Add AuthResource
                        </Button>
                    ]
                }}
                pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                // @ts-ignore
                // request={(params: APISearchAuthResource) => handleQueryAuthResourceTree(params)}
                // request={async () => AuthResourceListVO}
            />
            <ModalLevel2Auth
                open={open}
            />
            {/* // TODO: 用于保存时，获取数据用 */}
            {/*<ProFormText hidden={true} name={'billOfLoadingEntity'}/>*/}
        </Fragment>
    )
}
export default AuthListIndex;