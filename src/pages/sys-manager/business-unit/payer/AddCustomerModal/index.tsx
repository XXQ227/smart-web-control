import React, {useState, useMemo, useEffect} from 'react';
import type { ProColumns} from '@ant-design/pro-components';
import {
    ProTable,
} from '@ant-design/pro-components';
import {Button, Modal, Divider, Input} from 'antd';
import {history} from '@@/core/history'
import { IconFont} from "@/utils/units";
import SearchModal from "@/components/SearchModal";
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
    const [customerVO, setCustomerVO] = useState({});
    const [curRowIndex, setCurRowIndex] = useState<any>(null);
    const [fetching, setFetching] = useState(false);            // TODO: 搜索Customer Loading 状态
    const [dataSourceList, setDataSourceList] = useState([]);   // TODO: 搜索Customer返回数据
    const [searchVal, setSearchVal] = useState<string>('');     // TODO: 搜索录入参数
    const [debounceTimeout, setDebounceTimeout] = useState<number>(100);     // TODO: 防抖动时间
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

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

    /**
     * @Description: TODO: 编辑 BU 信息
     * @author LLS
     * @date 2023/7/12
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBUP = (record: APIPayer) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({pathname: `/manager/business-unit/property/form/${btoa(record.id)}`});
    }

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
            const url = "/apiBase/dict/queryDictDetailCommon";
            const query = { dictCode: "ctn_model" };
            const qty = 10;
            // TODO: 接口返回的键值
            const resValue: string = 'value';
            const resLabel: string = 'label';
            // setDataSourceList([]);
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
        console.log(val)
        console.log(val?.target?.value)
        setSearchVal(val?.target?.value);
        debounceFetcher(val?.target?.value);
    }

    const handleAddCustomer = () => {
        console.log(customerVO);
        setSearchVal('');
        setCurRowIndex(null)
        setDataSourceList([]);
        setSaveButtonDisabled(true)
        props.onOk(customerVO);
    }

    const handleCancel = () => {
        props.onCancel()
    }

    /**
     * @Description: TODO: change 事件
     * @author LLS
     * @date 2023/7/24
     * @param record
     * @param index
     * @returns
     */
    const handleChange = (record: any, index: number | undefined) => {
        console.log(record)
        if (curRowIndex !== index) {
            setCustomerVO(record.data)
            setCurRowIndex(index)
            setSaveButtonDisabled(false)
        } else {
            setCustomerVO({})
            setCurRowIndex(null)
            setSaveButtonDisabled(true)
        }
    }

    /*function handleRowChange(val: any, option?: any) {
        console.log(val)
        console.log(option)
    }*/

    return (
        <Modal
            className={'ant-add-modal'}
            style={{ top: 550 }}
            open={props.open}
            onOk={handleAddCustomer}
            onCancel={handleCancel}
            title={'Add Customer'}
            width={800}
            footer={[
                <Button htmlType={"button"} key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button htmlType={"submit"} key="submit" type="primary" onClick={handleAddCustomer} disabled={saveButtonDisabled}>
                    Save
                </Button>,
            ]}
        >
            <Divider />
            {/*<SearchModal
                qty={30}
                // id={`CTNModelID${record.ID}`}
                // title={'SIZE'}
                modalWidth={500}
                // text={record.CTNModelName}
                query={{ dictCode: "ctn_model" }}
                url={"/apiBase/dict/queryDictDetailCommon"}
                handleChangeData={(val: any, option: any)=> handleRowChange(val, option)}
            />*/}
            <Input
                id={'search-input'}
                autoComplete={'off'}
                autoFocus={true}
                value={searchVal}
                placeholder={'Search'}
                onChange={handleChangeInput}
                // onKeyDown={handleKeyDown}
                // style={{borderRadius: '6px'}}
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
                        rowClassName={(record, index) => index == curRowIndex ? 'blue-bg' : ''}
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