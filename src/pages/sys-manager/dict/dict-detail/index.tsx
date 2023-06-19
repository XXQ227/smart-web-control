import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProFormText, ProTable} from '@ant-design/pro-components'
import {useModel, useParams} from 'umi';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Popconfirm, Input, Button, message, Form} from 'antd'
import {CustomizeIcon, getFormErrorMsg, ID_STRING} from '@/utils/units'
import ls from 'lodash'
import DividerCustomize from '@/components/Divider'

const {Search} = Input;

type APIDictDetail = APIManager.DictDetail;
type APISearchDictDetail = APIManager.SearchDictDetailParams;

interface Props {
    form: any,
}

const DictDetailDetailIndex: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);    // TODO: 字典类型 id
    const {
        queryDictDetail, addDictDetail, editDictDetail, deleteDictDetail, operateDictDetail,
    } = useModel('manager.dict', (res: any) => ({
        queryDictDetail: res.queryDictDetail,
        addDictDetail: res.addDictDetail,
        editDictDetail: res.editDictDetail,
        deleteDictDetail: res.deleteDictDetail,
        operateDictDetail: res.operateDictDetail,
    }));

    const searchParams: APISearchDictDetail = {
        dictId: id,
        name: '',
        currentPage: 1,
        pageSize: 20,
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [DictDetailListVO, setDictDetailListVO] = useState<APIDictDetail[]>([]);


    /**
     * @Description: TODO: 获取字典类型类型详情
     * @author XXQ
     * @date 2023/6/2
     * @param params
     * @returns
     */
    const handleSearchDictDetail = async (params: APISearchDictDetail) => {
        setLoading(true);
        const result: any = await queryDictDetail(params);
        setDictDetailListVO(result?.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加详情
     * @author XXQ
     * @date 2023/6/2
     * @returns
     */
    const handleAddDictDetail = () => {
        const addDataDetailObj: APIDictDetail = {
            id: ID_STRING(),
            dictId: '',
            dictCode: '',
            name: '',
            relatedCode: '',
            remark: '',
            isChange: true
        };
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO) || [];
        newData.splice(0, 0, addDataDetailObj);
        setDictDetailListVO(newData);
    }

    /**
     * @Description: TODO: 修改字典类型
     * @author XXQ
     * @date 2023/5/31
     * @param index     当前行序号
     * @param record    操作行数据
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleChangeDictDetail = async (index: number, record: APIDictDetail, filedName: string, val: any) => {
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setDictDetailListVO(newData);
    }

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/5/31
     * @param index     操作行的序列
     * @param record    操作行的数据
     * @param state     操作动作：TODO: {add: 添加, edit: 编辑}
     * @returns
     */
    const handleSaveDictDetail = (index: number, record: APIDictDetail, state: string) => {
        form.validateFields()
            .then(async ()=> {
                const dictCode = props?.form?.getFieldValue('code')
                let result: API.Result;
                const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    dictCode: dictCode,
                    name: record.name,
                    relatedCode: record.relatedCode,
                    sort: record.sort || 0,
                    remark: record.remark,
                };
                // TODO: 添加
                if (state === 'add') {
                    params.dictId = id;
                    result = await addDictDetail(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editDictDetail(params);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('success');
                    setDictDetailListVO(newData);
                } else {
                    message.error(result.message);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    /**
     * @Description: TODO:  删除、冻结操作
     * @author XXQ
     * @date 2023/6/2
     * @param index     当前行序号
     * @param record    当前行数据
     * @param state     操作状态：delete：删除；freezen：冻结
     * @returns
     */
    const handleOperateDictDetail = async (index: number, record: APIDictDetail, state: string) => {
        let result: API.Result;
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'deleteFlag') {
            if (!(record.id.indexOf('ID_') > -1)) {
                result = await deleteDictDetail(params);
            } else {
                result = {success: true};
            }
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateDictDetail(params);
            // TODO: 冻结成功后，把当前行冻结状态调整
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('success');
            setDictDetailListVO(newData);
        } else {
            message.error(result.message);
        }
    }

    const columns: ProColumns<APIDictDetail>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            align: 'center',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    fieldProps={{
                        onChange: (val: any) => handleChangeDictDetail(index, record, 'name', val)
                    }}
                />
        },
        {
            title: 'Code',
            dataIndex: 'relatedCode',
            width: 200,
            align: 'center',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`relatedCode${record.id}`}
                    name={`relatedCode${record.id}`}
                    initialValue={record.relatedCode}
                    fieldProps={{
                        onChange: (val: any) => handleChangeDictDetail(index, record, 'relatedCode', val)
                    }}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`remark${record.id}`}
                    name={`remark${record.id}`}
                    initialValue={record.remark}
                    fieldProps={{
                        onChange: (val: any) => handleChangeDictDetail(index, record, 'remark', val)
                    }}
                />
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveDictDetail(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateDictDetail(index, record, 'enableFlag')}
                        >
                            <DividerCustomize hidden={isAdd || !record.isChange} />
                            <CustomizeIcon
                                hidden={isAdd}
                                type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}
                            />
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateDictDetail(index, record, 'deleteFlag')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize />
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <ProTable<APIDictDetail>
            rowKey={'id'}
            search={false}
            options={false}
            bordered={true}
            loading={loading}
            columns={columns}
            dataSource={DictDetailListVO}
            locale={{ emptyText: 'No Data' }}
            className={'ant-pro-table-edit'}
            params={searchParams}
            headerTitle={
                <Search
                    placeholder='' enterButton="Search" loading={loading}
                    onSearch={async (val: any) => {
                        searchParams.name = val;
                        await handleSearchDictDetail(searchParams);
                    }}/>
            }
            toolbar={{
                actions: [
                    <Button key={'add'} onClick={handleAddDictDetail} type={'primary'} icon={<PlusOutlined/>}>
                        Add DictDetail
                    </Button>
                ]
            }}
            pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
            // @ts-ignore
            request={(params: APISearchDictDetail) => handleSearchDictDetail(params)}
        />
    )
}
export default DictDetailDetailIndex;