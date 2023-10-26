import React, {useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Input, Popconfirm, Space, Form} from 'antd'
import ls from 'lodash'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'

const {Search} = Input;
// const FormItem = Form.Item;

type APICGTemp = APISystem.CGTemp;
type APISearchCGTemp = APISystem.SearchCGTempParams;



// TODO: 获取单票集的请求参数
const searchParams: APISearchCGTemp = {
    name: '', branchId: 1, currentPage: 1, pageSize: 20, servicesType: ''
};

interface Props {
    label: string;
    type: string;
    name: string;
    dataSouse: any[];
    oldDataSouse: any[];
    form: any,
    FormItem: any,
    handleFormValuesChange: (formKey: string, allValues: any) => void,
}

const EDIMapperIndex: React.FC<Props> = (props) => {

    const {label, name, dataSouse, oldDataSouse, handleFormValuesChange, form, FormItem} = props;

    const [loading, setLoading] = useState<boolean>(false);

    /**
     * @Description: TODO 搜索过滤
     * @author XXQ
     * @date 2023/2/13
     * @param val    参数
     * @returns
     */
    async function handleSearch(val: string) {
        setLoading(true);
        const result: any = {success: true};
        if (val) {
            let newData: any[] = ls.cloneDeep(dataSouse) || [];
            newData = newData.filter((item: any) => item.code === val || item.ediCode === val);
            result.data = newData;
        } else {
            result.data = oldDataSouse;
        }
        handleFormValuesChange(name, result.data);
        setLoading(false);
        return result;
    }

    const handleAdd = () => {
        const newData: any[] = ls.cloneDeep(dataSouse);
        newData.push({id: newData?.length + 1, code: '', ediCode: ''});
        handleFormValuesChange(name, newData);
    }
    /**
     * @Description: TODO: 编辑 edi 配置信息
     * @author XXQ
     * @date 2023/6/14
     * @param index         TODO: 编辑行的序列号
     * @param record        TODO: 编辑行 id
     * @param filedName     TODO: 编辑字段
     * @param val           TODO: 值
     * @returns
     */
    const handleRowChange = (index: number, record: any, filedName: string, val?: any) => {
        const newData: any[] = ls.cloneDeep(dataSouse);
        if (filedName === 'deleteFlag') {
            newData.splice(index, 1);
        } else {
            record[filedName] = val?.target ? val.target.value : val;
            // record.isChange = true;
            newData.splice(index, 1, record);
        }
        handleFormValuesChange(name, newData);
    }

    const columns: ProColumns<APICGTemp>[] = [
    // const columns: ColumnsType<APICGTemp> = [
        {
            title: 'Code',
            dataIndex: 'code',
            align: 'left',
            width: '40%',
            render: (text: any, record: any, index: number) =>
                <FormItemInput
                    placeholder=''
                    required={true}
                    autoFocus={true}
                    id={`code${record.id}`}
                    name={`code${record.id}`}
                    initialValue={record.code}
                    onChange={(val: any) => handleRowChange(index, record, 'code', val)}
                />
        },
        {
            title: 'EDI Code',
            dataIndex: 'ediCode',
            align: 'center',
            width: '40%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    placeholder=''
                    required={true}
                    id={`ediCode${record.id}`}
                    name={`ediCode${record.id}`}
                    initialValue={record.ediCode}
                    onChange={(val: any) => handleRowChange(index, record, 'ediCode', val)}
                />
        },
        {
            title: 'Action',
            width: '10%',
            align: 'center',
            render: (text, record, index) =>
                <Popconfirm
                    onConfirm={() => handleRowChange(index, record, 'deleteFlag')}
                    title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                >
                    <DeleteOutlined color={'red'}/>
                </Popconfirm>,
        },
    ];

    return (
        <Form name={name} form={form}>
            <ProTable<APICGTemp>
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                pagination={false}
                dataSource={dataSouse}
                params={searchParams}
                locale={{emptyText: 'No Data'}}
                className={'ant-pro-table-edit'}
                scroll={{y: 372}}
                headerTitle={
                    <Space>
                        <span style={{marginRight: 20, width: '130px!important'}}>{label}</span>
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => await handleSearch(val)}
                        />
                    </Space>
                }
                toolbar={{
                    actions: [
                        <Button key={'add'} onClick={handleAdd} type={'primary'} icon={<PlusOutlined/>}>
                            Add
                        </Button>
                    ]
                }}
                // @ts-ignore
                request={async ()=> dataSouse || {}}
            />
        </Form>
    )
}
export default EDIMapperIndex;