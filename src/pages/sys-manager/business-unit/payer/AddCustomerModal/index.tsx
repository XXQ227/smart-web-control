import React, {useState, useMemo, useEffect} from 'react';
import type { ProColumns} from '@ant-design/pro-components';
import {
    ProTable,
} from '@ant-design/pro-components';
import {Button, Modal, Divider, Input} from 'antd';
import { IconFont} from "@/utils/units";
import {fetchData} from '@/utils/fetch-utils';
import {debounce} from 'lodash';

export type LocationState = Record<string, unknown>;
type APIPayer = APIManager.BUP;

interface Props {
    open: boolean,
    onOk: (customerVO: any) => void,
    onCancel: () => void,
}

const AddCustomerModal: React.FC<Props> = (props) => {
    const [customerVO, setCustomerVO] = useState({});                // TODO: 选择客户行的数据
    const [curRowIndex, setCurRowIndex] = useState<any>(null);                       // TODO: 选择客户行的位置
    const [fetching, setFetching] = useState(false);             // TODO: 搜索Customer Loading 状态
    const [dataSourceList, setDataSourceList] = useState([]);    // TODO: 搜索Customer返回数据
    const [searchVal, setSearchVal] = useState<string>('');        // TODO: 搜索录入参数
    const [debounceTimeout, setDebounceTimeout] = useState<number>(100);     // TODO: 防抖动时间
    const [addButtonDisabled, setAddButtonDisabled] = useState(true);

    useEffect(() => {
        // TODO: 当第一次加载完后<打开弹框时>，防抖动时间增到到 【1000】
        if (props.open && debounceTimeout === 100) {
            setDebounceTimeout(1000);
        } else if (!props.open && debounceTimeout === 1000) {
            // TODO: 关闭弹框
            // TODO: 初始化防抖时间
            setDebounceTimeout(100);
        }
        if (document?.getElementById('search-input')) {
            document?.getElementById('search-input')?.focus();
        }
    }, [debounceTimeout, props.open])

    const addCustomerColumns: ProColumns<APIPayer>[] = [
        {
            title: 'Customer Identity',
            dataIndex: 'value',
            width: '25%',
            align: 'center',
        },
        {
            title: 'Customer Name',
            dataIndex: 'label',
            // width: '20%',
        },
    ];

    // TODO: 防抖动搜索
    const debounceFetcher = useMemo(() => {
        /**
         * @Description: TODO: 搜索结果显示
         * @author XXQ
         * @date 2023/4/18
         * @param val       搜索参数
         * @returns
         */
        const loadOptions = (val: any) => {
            // TODO: 初始数据，且做【loading】
            const url = "/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon";
            const query = { bupType: 1, payerFlag: 0 };
            const qty = 10;
            // TODO: 接口返回的键值
            const resValue: string = 'taxNum';
            const resLabel: string = 'nameFullEn';
            fetchData(val, url, query, qty, resValue, resLabel).then((result: any) => {
                console.log(result)
                setDataSourceList(result);
                setFetching(false);
            });
        };
        // TODO: 返回数据，做防抖动设置
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout]);

    /**
     * @Description: TODO: 搜索内容，加载 loading
     * @author XXQ
     * @date 2023/4/18
     * @param val       录入的搜索
     * @returns
     */
    const handleChangeInput = (val: any) => {
        setFetching(true);
        // console.log(val)
        // console.log(val?.target?.value)
        setSearchVal(val?.target?.value);
        setCurRowIndex(null)
        setAddButtonDisabled(true)
        debounceFetcher(val?.target?.value);
    }

    /**
     * @Description: TODO: 弹框开启关闭
     * @author LLS
     * @date 2023/7/28
     * @param operationType   1: 添加客户 2: 弹框关闭
     * @returns
     */
    const handleModal = (operationType: number) => {
        setSearchVal('');
        setCurRowIndex(null)
        setDataSourceList([]);
        setAddButtonDisabled(true)
        if (operationType === 1) {
            props.onOk(customerVO);
        } else {
            props.onCancel()
        }
    };

    /**
     * @Description: TODO: change 事件
     * @author LLS
     * @date 2023/7/24
     * @param record
     * @param index
     * @returns
     */
    const handleChange = (record: any, index: number | undefined) => {
        if (curRowIndex !== index) {
            console.log(record.data)
            setCustomerVO(record.data)
            setCurRowIndex(index)
            setAddButtonDisabled(false)
        } else {
            setCustomerVO({})
            setCurRowIndex(null)
            setAddButtonDisabled(true)
        }
    }

    return (
        <Modal
            className={'ant-add-modal'}
            // style={{ top: 550 }}
            open={props.open}
            onOk={() => handleModal(1)}
            onCancel={() => handleModal(2)}
            title={'Add Customer'}
            width={760}
            footer={[
                <Button htmlType={"button"} key="back" onClick={() => handleModal(2)}>
                    Cancel
                </Button>,
                <Button htmlType={"submit"} key="submit" type="primary" onClick={() => handleModal(1)} disabled={addButtonDisabled}>
                    Add
                </Button>,
            ]}
        >
            <Divider />
            <Input
                id={'search-input'}
                autoComplete={'off'}
                autoFocus={true}
                value={searchVal}
                placeholder={'Search'}
                onChange={handleChangeInput}
                className={'ant-input-search-customer'}
                prefix={<IconFont type={'icon-search'} style={{marginRight: '8px'}}/>}
            />
            {
                dataSourceList.length > 0 || fetching ?
                    <ProTable<APIPayer>
                        className={'antd-pro-table-port-list'}
                        rowKey={'id'}
                        options={false}
                        bordered={true}
                        loading={fetching}
                        pagination={false}
                        columns={addCustomerColumns}
                        dataSource={dataSourceList}
                        search={false}
                        showHeader={false}
                        rowClassName={(record, index) => index == curRowIndex ? 'hover-bg' : ''}
                        onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    handleChange(record, index)
                                },
                            }
                        }}
                    /> : null
            }
            {/*<Table
                        className={'table modal-table'}
                        rowKey={'id'}
                        loading={fetching}
                        pagination={false}
                        dataSource={dataSourceList}
                        columns={addCustomerColumns}
                        showHeader={false}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    handleChange(record)
                                },
                            }
                        }}
                    />*/}
        </Modal>
    )
}
export default AddCustomerModal;