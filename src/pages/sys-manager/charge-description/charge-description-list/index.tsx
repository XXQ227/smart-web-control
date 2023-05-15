import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Form, Input, message, Popconfirm, Select} from 'antd'
import {getUserID} from '@/utils/auths'
import {CustomizeIcon, getFormErrorMsg} from '@/utils/units'
import SearchModal from '@/components/SearchModal'

const {Search} = Input;

const FormItem = Form.Item;
const Option = Select.Option;

type APICGItem = APIManager.CGItem;
type APISearchCGItem = APIManager.SearchCGItemParams;

const TransTypeList = [
    {Key: 1, Value: 'SEA'}, {Key: 2, Value: 'AIR WAY'}, {Key: 3, Value: 'LAND'},
    {Key: 4, Value: 'RAIL WAY'}, {Key: 6, Value: 'WAREHOUSE'},
];

// TODO: 获取单票集的请求参数
const searchParams: APISearchCGItem = {
    value: '',
    UserID: getUserID(),
    SystemID: 4,
    PageSize: 15,
};

const CGItemListIndex: React.FC<RouteChildrenProps> = () => {

    const [form] = Form.useForm();
    const {
        CGItemList, getCGItem, saveCGItem, deleteCGItem, freezenCGItem
    } = useModel('manager.charge-description', (res: any) => ({
        CGItemList: res.CGItemList,
        getCGItem: res.getCGItem,
        saveCGItem: res.saveCGItem,
        deleteCGItem: res.deleteCGItem,
        freezenCGItem: res.freezenCGItem,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [CGItemListVO, setCGItemListVO] = useState<APICGItem[]>(CGItemList || []);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetCGItemList(params: APISearchCGItem) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        params.PageNum = params.current || 1;
        params.pageSize = params.PageSize || 15;
        params.PageSize = params.PageSize || 15;
        const result: APIManager.CGItemResult = await getCGItem(params);
        setCGItemListVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加费目
     * @author XXQ
     * @date 2023/5/12
     * @returns
     */
    const handleAddCGItem = () => {
        const newData: APICGItem[] = CGItemListVO?.map((item: APICGItem) => ({...item})) || [];
        const rowKey = Date.now().toString();
        newData.splice(0, 0, {
            CargoCGItemID: rowKey,
            ID: rowKey,
            Name: '',
            CGItemName: '',
            Biztype1ID: null,
            StandardCGItemID: null,
            StandardCGItemName: '',
            CGUnitID: null,
            Code: '',
            Freezen: false,
            isChange: true,
        });
        setCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 编辑费目信息
     * @author XXQ
     * @date 2023/5/11
     * @param index         TODO: 编辑行的序列号
     * @param rowKey        TODO: 编辑行 id
     * @param filedName     TODO: 编辑字段
     * @param val           TODO: 值
     * @param option        TODO: 其他结果值
     * @returns
     */
    const handleRowChange = (index: number, rowKey: any, filedName: string, val: any, option?: any) => {
        const newData: APICGItem[] = CGItemListVO?.map((item: APICGItem) => ({...item})) || [];
        const target: any = newData.find((item: APICGItem) => item.CargoCGItemID === rowKey) || {};
        target[filedName] = val?.target ? val.target.value : val;
        if (filedName === 'StandardCGItemID') {
            console.log(option);
            target.StandardCGItemName = option.label;
            form.setFieldsValue({[filedName + rowKey]: val});
        }
        target.isChange = filedName !== 'Freezen';
        newData.splice(index, 1, target);
        setCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 删除费目
     * @author XXQ
     * @date 2023/5/12
     * @param record
     * @returns
     */
    const handleDelete = async (record: any) => {
        setLoading(true);
        let deleteState: boolean, deleteContent = '';
        // TODO: 当 <ID> 是字符串时，可直接删除
        if (typeof record.CargoCGItemID === 'string') {
            deleteState = true;
        } else {
            // TODO: 否则需要调接口删除
            const params = {
                SystemID: 4,
                UserID: getUserID(),
                CGItemID: record.CargoCGItemID,
                CGItemName: record.CGItemName,
            }
            const result: any = await deleteCGItem(params);
            // TODO: 接口返回的删除结果
            deleteState = result?.Result;
            deleteContent = result?.Content;
        }
        // TODO: 删除成功后，同时删除本地 state 的数据
        if (deleteState) {
            message.success('Success!');
            let newData: APICGItem[] = CGItemListVO?.map((item: APICGItem) => ({...item})) || [];
            newData = newData.filter(x => x.CargoCGItemID !== record.CargoCGItemID) || [];
            setCGItemListVO(newData);
            setLoading(false);
        } else {
            message.error(deleteContent);
            setLoading(false);
        }
    }

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/5/15
     * @param index     编辑行序列
     * @param record    编辑行数据
     * @returns
     */
    const handleFreezenCG = async (index: number, record: any) => {
        setLoading(true);
        const params = {
            SystemID: 4,
            UserID: getUserID(),
            CGItemID: record.CargoCGItemID,
            CGItemName: record.CGItemName,
            IsFreezen: !record.Freezen,
        }
        const result: any = await freezenCGItem(params);
        if (result.Result) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            handleRowChange(index, record.CargoCGItemID, 'Freezen', !record.Freezen);
            setLoading(false);
        } else {
            message.error(result.Content);
            setLoading(false);
        }
    }

    /**
     * @Description: TODO: 保存费目
     * @author XXQ
     * @date 2023/5/12
     * @param record    费用行
     * @param index     编辑行的序列号
     * @returns
     */
    const handleSave = async (record: any, index: number) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                record.UserID = getUserID();
                record.CargoCGItemID = typeof record.CargoCGItemID === 'string' ? 0 : record.CargoCGItemID;
                record.ID = record.CargoCGItemID;
                record.Name = record.CGItemName;
                const result: any = await saveCGItem(record);
                if (result.Result) {
                    delete record.isChange;
                    const newData: APICGItem[] = CGItemListVO?.map((item: APICGItem) => ({...item})) || [];
                    newData.splice(index, 1, record);
                    setCGItemListVO(newData);
                    message.success('success');
                }
                setLoading(false);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
                setLoading(false);
            });
    }

    const columns: ProColumns<APICGItem>[] = [
        {
            title: 'Description',
            dataIndex: 'CGItemName',
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.CGItemName}
                    name={`CGItemName${record.CargoCGItemID}`}
                    rules={[{required: true, message: `CGItemName is required.`}]}
                >
                    <Input
                        disabled={record.Freezen} autoComplete={'off'} id={`CGItemName${record.CargoCGItemID}`}
                        onChange={(val: any) => handleRowChange(index, record.CargoCGItemID, 'CGItemName', val)}
                    />
                </FormItem>
        },
        {
            title: 'Short Name',
            dataIndex: 'Code',
            // width: 300,
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.Code}
                    name={`Code${record.CargoCGItemID}`}
                    rules={[{required: true, message: `Short name is required.`}]}
                >
                    <Input
                        disabled={record.Freezen} autoComplete={'off'} id={`Code${record.CargoCGItemID}`}
                        onChange={(val: any) => handleRowChange(index, record.CargoCGItemID, 'Code', val)}
                    />
                </FormItem>
        },
        {
            title: 'Type',
            dataIndex: 'Biztype1ID',
            width: 120,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.Biztype1ID}
                    name={`Biztype1ID${record.CargoCGItemID}`}
                    rules={[{required: true, message: `Type is required.`}]}
                >
                    <Select
                        disabled={record.Freezen} dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record.CargoCGItemID, 'Biztype1ID', e)}
                    >
                        {TransTypeList?.map((item: API.APIKey$Value) =>
                            <Option key={item.Key} value={item.Key}>{item.Value}</Option>
                        )}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Standard Charge',
            dataIndex: 'StandardCGItemName',
            width: 200,
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.StandardCGItemName}
                    name={`StandardCGItemID${record.CargoCGItemID}`}
                    rules={[{required: true, message: `Standard Charge is required.`}]}
                >
                    <SearchModal
                        qty={13}
                        title={'Charge Name'}
                        value={record.StandardCGItemID}
                        url={'/api/CGItem/GetStandardCGItem'}
                        text={record.StandardCGItemName || ''}
                        id={`CGItemID${record.CargoCGItemID}`}
                        disabled={!record.Biztype1ID || record.Freezen}
                        query={{UserID: getUserID(), BizType1ID: record.Biztype1ID,}}
                        handleChangeData={(val: any, option: any) => handleRowChange(index, record.CargoCGItemID, 'StandardCGItemID', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Action',
            width: 130,
            align: 'center',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <CustomizeIcon type={'icon-save'} hidden={!record.isChange}
                                       onClick={() => handleSave(record, index)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleFreezenCG(index, record)}
                            title={`Are you sure to ${record.Freezen ? 'unlock' : 'lock'}?`}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon type={record.Freezen ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Divider type='vertical'/>
                        <Popconfirm
                            onConfirm={() => handleDelete(record)}
                            title={'Are you sure to delete?'} okText={'Yes'} cancelText={'No'}
                        >
                            <Divider type='vertical'/>
                            <DeleteOutlined color={'red'}/>
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
            <Form
                form={form}
            >
                <ProTable<APICGItem>
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    rowKey={'CargoCGItemID'}
                    dataSource={CGItemListVO}
                    className={'ant-pro-table-edit'}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.value = val;
                                await handleGetCGItemList(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={handleAddCGItem} type={'primary'} icon={<PlusOutlined/>}>
                                Add CGItem
                            </Button>
                        ]
                    }}
                    // @ts-ignore
                    request={async (params: APISearchCGItem) => {
                        await handleGetCGItemList(params)
                    }}
                />
            </Form>
        </PageContainer>
    )
}
export default CGItemListIndex;