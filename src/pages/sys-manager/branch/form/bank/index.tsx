import React, {useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {Popconfirm, Button, message, Form} from 'antd'
import ls from 'lodash'
import {ID_STRING} from '@/utils/units'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import {getCurrencyList} from '@/utils/auths'

type APIBank = APIManager.Bank;

interface Props {
    BankList: any[],
    handleChangeBank: (data: any) => void,
    handleOperateBank: (bankAccountId: string) => Promise<API.Result>,
}

const BankIndex: React.FC<Props> = (props) => {
    const { BankList } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [BankListVO, setBankListVO] = useState<any[]>(BankList || []);

    const handleAddBank = () => {
        const newData: APIBank[] = ls.cloneDeep(BankListVO) || [];
        newData.push({ id: ID_STRING(), name: '', isChange: true });
        setBankListVO(newData);
    }

    /**
     * @Description: TODO: 删除银行
     * @author LLS
     * @date 2023/7/6
     * @param index     当前行序号
     * @param record    操作当前 行
     * @returns
     */
    const handleOperateBank = async (index: number, record: any) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const newData: APIBank[] = ls.cloneDeep(BankListVO);
        // TODO: 本地删除，不调接口 <未创建的数据>
        if (record.id.indexOf('ID_') > -1) {
            result = {success: true};
        } else {
            result = await props.handleOperateBank(record.id)
        }
        newData.splice(index, 1);
        if (result.success) {
            message.success('Success');
            setBankListVO(newData);
            props.handleChangeBank(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
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
    const handleChangeBank = (index: number, record: APIBank, filedName: string, val: any) => {
        const newData: APIBank[] = ls.cloneDeep(BankListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setBankListVO(newData);
        props.handleChangeBank(newData);
    }

    const columns: ProColumns<APIBank>[] = [
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            width: '20%',
            tooltip: 'Bank Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    FormItem={Form.Item}
                    id={`bankName${record.id}`}
                    name={`bankName${record.id}`}
                    initialValue={record.bankName}
                    rules={[{required: true, message: 'Bank Name'}]}
                    onChange={(val: any) => handleChangeBank(index, record, 'bankName', val)}
                />
        },
        {
            title: 'Address',
            dataIndex: 'bankAddress',
            width: '20%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    FormItem={Form.Item}
                    id={`bankAddress${record.id}`}
                    name={`bankAddress${record.id}`}
                    initialValue={record.bankAddress}
                    rules={[{required: true, message: 'Address'}]}
                    onChange={(val: any) => handleChangeBank(index, record, 'bankAddress', val)}
                />
        },
        // 账号名称 (开户人)
        {
            title: 'Account Name',
            dataIndex: 'name',
            width: '17%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    FormItem={Form.Item}
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    rules={[{required: true, message: 'Account Name'}]}
                    onChange={(val: any) => handleChangeBank(index, record, 'name', val)}
                />
        },
        // 银行账号 (Code+流水号)
        {
            title: 'Account No.',
            dataIndex: 'num',
            width: '17%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    FormItem={Form.Item}
                    id={`num${record.id}`}
                    name={`num${record.id}`}
                    initialValue={record.num}
                    rules={[{required: true, message: 'Account No.'}]}
                    onChange={(val: any) => handleChangeBank(index, record, 'num', val)}
                />
        },
        {
            title: 'Currency',
            dataIndex: 'currencyName',
            width: '10%',
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItemSelect
                    required
                    FormItem={Form.Item}
                    options={getCurrencyList()}
                    id={`currencyName${record.id}`}
                    name={`currencyName${record.id}`}
                    initialValue={record.currencyName}
                    rules={[{required: true, message: 'Currency'}]}
                    onSelect={(val: any) => handleChangeBank(index, record, 'currencyName', val)}
                />
        },
        // 银行国际代码
        {
            title: 'Swift Code',
            dataIndex: 'swiftCode',
            width: '10%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    FormItem={Form.Item}
                    id={`swiftCode${record.id}`}
                    name={`swiftCode${record.id}`}
                    initialValue={record.swiftCode}
                    rules={[{required: true, message: 'Swift Code'}]}
                    onChange={(val: any) => handleChangeBank(index, record, 'swiftCode', val)}
                />
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <Popconfirm
                        onConfirm={() => handleOperateBank(index, record)}
                        title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                    >
                        <DeleteOutlined color={'red'}/>
                    </Popconfirm>
                )
            },
        },
    ];

    return (
        <ProTable<APIBank>
            rowKey={'ID'}
            search={false}
            options={false}
            bordered={true}
            loading={loading}
            columns={columns}
            dataSource={BankListVO}
            headerTitle={'Bank Information'}
            locale={{ emptyText: 'No Data' }}
            className={'ant-pro-table-edit'}
            toolbar={{
                actions: [
                    <Button key={'add'} onClick={handleAddBank} type={'primary'} icon={<PlusOutlined/>}>
                        Add Bank
                    </Button>
                ]
            }}
        />
    )
}
export default BankIndex;