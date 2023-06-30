import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Popconfirm, Button, message, Form} from 'antd'
import ls from 'lodash'
import {getFormErrorMsg, ID_STRING} from '@/utils/units'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import DividerCustomize from '@/components/Divider'
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import {getCurrencyList} from '@/utils/auths'

type APIBank = APIManager.Bank;


interface Props {
    form: any,
    BankList: any[],
}

const BankIndex: React.FC<Props> = (props) => {
    const { form, BankList } = props;
    const {
        addBank, editBank, deleteBank, operateBank
    } = useModel('manager.bank', (res: any) => ({
        addBank: res.addBank,
        editBank: res.editBank,
        deleteBank: res.deleteBank,
        operateBank: res.operateBank,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [BankListVO, setBankListVO] = useState<any[]>(BankList || []);

    const handleAddBank = () => {
        const newData: APIBank[] = ls.cloneDeep(BankListVO) || [];
        newData.push({id: ID_STRING(), name: 'SINOTRANS (HK) WAREHOUSING LIMITED', isChange: true});
        setBankListVO(newData);
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param index     当前行序号
     * @param record    操作当前 行
     * @param state     操作状态
     * @returns
     */
    const handleOperateBank = async (index: number, record: any, state: string = 'form') => {
        let result: API.Result;
        const newData: APIBank[] = ls.cloneDeep(BankListVO);
        // setLoading(true);
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'deleteFlag') {
            // TODO: 本地删除，不调接口 <未创建的数据>
            if (record.id.indexOf('ID_') > -1) {
                result = {success: true};
            } else {
                result = await deleteBank(params);
            }
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateBank(params);
            // TODO: 冻结成功后，把当前行冻结状态调整
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('success');
            // setLoading(false);
            setBankListVO(newData);
        } else {
            // setLoading(false);
            message.error(result.message);
        }
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
    const handleSaveBank = async (index: number, record: APIBank, state?: string) => {
        form.validateFields()
            .then(async ()=> {
                let result: API.Result;
                const newData: APIBank[] = ls.cloneDeep(BankListVO);
                // TODO: 添加
                if (state === 'add') {
                    record.id = '';
                    result = await addBank(record);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    result = await editBank(record);
                }
                if (result.success) {
                    message.success('success');
                    record.isChange = false;
                    newData.splice(index, 1, record);
                    setBankListVO(newData);
                } else {
                    message.error(result.message);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    console.log(form, getCurrencyList());
    const columns: ProColumns<APIBank>[] = [
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            align: 'left',
            width: 400,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    FormItem={Form.Item}
                    id={`bankName${record.id}`}
                    name={`bankName${record.id}`}
                    initialValue={record.bankName}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeBank(index, record, 'bankName', val)}
                />
        },
        {
            title: 'Bank Address',
            dataIndex: 'bankAddress',
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    FormItem={Form.Item}
                    id={`bankAddress${record.id}`}
                    name={`bankAddress${record.id}`}
                    initialValue={record.bankAddress}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeBank(index, record, 'bankAddress', val)}
                />
        },
        {
            title: 'Account No.',
            dataIndex: 'num',
            width: 180,
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    FormItem={Form.Item}
                    id={`num${record.id}`}
                    name={`num${record.id}`}
                    initialValue={record.num}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeBank(index, record, 'num', val)}
                />
        },
        {
            title: 'Currency',
            dataIndex: 'currencyName',
            width: 100,
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItemSelect
                    FormItem={Form.Item}
                    options={getCurrencyList()}
                    disabled={record.enableFlag}
                    id={`currencyName${record.id}`}
                    name={`currencyName${record.id}`}
                    initialValue={record.currencyName}
                    onSelect={(val: any) => handleChangeBank(index, record, 'currencyName', val)}
                />
        },
        {
            title: 'Swift Code',
            dataIndex: 'swiftCode',
            width: 130,
            align: 'center',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    FormItem={Form.Item}
                    disabled={record.enableFlag}
                    id={`swiftCode${record.id}`}
                    name={`swiftCode${record.id}`}
                    initialValue={record.swiftCode}
                    onChange={(val: any) => handleChangeBank(index, record, 'swiftCode', val)}
                />
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveBank(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            onConfirm={() => handleOperateBank(index, record, 'deleteFlag')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize hidden={!record.isChange}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
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