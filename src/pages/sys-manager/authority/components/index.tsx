import React, {Fragment, useState} from 'react';
import type { ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {useModel, useParams} from 'umi';
import {Button, Form, Input, message, Popconfirm} from 'antd'
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {IconFont, getFormErrorMsg, ID_STRING} from '@/utils/units'
import {history} from '@@/core/history'
import DividerCustomize from '@/components/Divider'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'

const {Search} = Input;

type APIAuthResource = APIManager.AuthResource;
type APISearchAuthResource = APIManager.SearchAuthResourceParams;

interface Props {
    AuthList: APIAuthResource[];
    AuthInvoVO: APIAuthResource;
}

const AuthListIndex: React.FC<Props> = (props) => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();

    const {AuthList, AuthInvoVO} = props;

    const {
        queryAuthResourceTree, deleteAuthResource, addAuthResource, editAuthResource,
    } = useModel('manager.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
        deleteAuthResource: res.deleteAuthResource,
        addAuthResource: res.addAuthResource,
        editAuthResource: res.editAuthResource,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AuthResourceListVO, setAuthResourceListVO] = useState<APIAuthResource[]>(AuthList);
    const [AuthParentVO, setAuthParentVO] = useState<APIAuthResource>(AuthInvoVO);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    const handleGetAuthResourceList = async (params: APISearchAuthResource) => {
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
        const addDataObj: APIAuthResource = {
            id: ID_STRING(), isChange: true, name: '', url: '', icon: '',
            // TODO: parentId：上一层的 id；parentIds：上一层的 parentIds + 上一层自己的 id
            parentId: AuthParentVO.id || '', parentIds: (AuthParentVO.parentIds || '') + AuthParentVO.id
        };
        console.log(addDataObj);
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
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
    const handleChangeAuthResource = (index: number, record: APIAuthResource, filedName: string, val: any) => {
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setAuthResourceListVO(newData);
    }

    const handleSaveAuthResource = async (index: number, record: APIAuthResource, state?: string) => {
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
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
    const handleOperateAuthResource = async (record: APIAuthResource, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
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
        history.push({pathname: `/manager/auth/auth-resource/form/${btoa(record.id)}`});
        const result: any = await handleGetAuthResourceList({id: record.id});
        console.log(result);
        // window.location.reload();
    }

    const columns: ProColumns<APIAuthResource>[] = [
        {
            title: 'Name', dataIndex: 'name', align: 'left', width: 200,
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        id={`name${record.id}`}
                        name={`name${record.id}`}
                        initialValue={record.name}
                        disabled={record.enableFlag}
                        rules={[{required: true, message: 'Name'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'name', val)}
                    /> : text
        },
        {
            title: 'Icon', dataIndex: 'icon', align: 'left',
            tooltip: 'Icon is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        id={`icon${record.id}`}
                        name={`icon${record.id}`}
                        initialValue={record.name}
                        disabled={record.enableFlag}
                        rules={[{required: true, message: 'Icon'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'icon', val)}
                    /> : text
        },
        {
            title: 'Url', dataIndex: 'url', align: 'left',
            tooltip: 'Url is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthParentVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
                        id={`url${record.id}`}
                        name={`url${record.id}`}
                        initialValue={record.url}
                        disabled={record.enableFlag}
                        rules={[{required: true, message: 'Url'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'url', val)}
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
        <ProTable<APIAuthResource>
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
                    onSearch={async () => await handleGetAuthResourceList({id})}
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
            // request={(params: APISearchAuthResource) => handleGetAuthResourceList(params)}
            // request={async () => AuthResourceListVO}
        />
    )
}
export default AuthListIndex;