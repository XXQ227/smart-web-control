import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {Input, Modal, Table} from 'antd';
import {debounce} from 'lodash'
import {fetchData} from '@/components/SearchInput'

interface Props {
    id: string,
    value: any,             // ID 数据 / 其他字符
    text?: string,           // 显示 【Name】 数据
    url: string,    // 搜索地址
    qty: number,    // 搜索条数
    query: any,     // 搜索参数
    title?: string,
    disabled?: boolean,
    filedValue?: string,    // 用于显示返回结果 【value】 的返回参数
    filedLabel?: string,    // 用于显示返回结果 【label】 的参数
    handleChangeData: (val: any, option?: any) => void,   // 选中后，返回的结果
}

const SearchModal: React.FC<Props> = (props) => {
    const {
        title, url, query, qty, filedValue, filedLabel,
    } = props;

    const [visible, setVisible] = useState<boolean>(false);     // TODO: Modal 隐藏显示开关
    const [fetching, setFetching] = useState(false);            // TODO: 搜索 Loading 状态
    const [dataSourceList, setDataSourceList] = useState([]);   // TODO: 搜索返回数据
    const [searchVal, setSearchVal] = useState<string>('');     // TODO: 搜索录入参数
    const [showText, setShowText] = useState<string>(props.text || '');     // TODO: 搜索录入参数
    const [debounceTimeout, setDebounceTimeout] = useState<number>(100);     // TODO: 防抖动时间

    // TODO: 接口返回的键值
    const resValue: string = filedValue || 'Key';
    const resLabel: string = filedLabel || 'Value';

    useEffect(() => {
        // TODO: 当第一次加载完后<打开弹框时>，防抖动时间增到到 【1000】
        if (visible && debounceTimeout === 100) {
            setDebounceTimeout(1000);
        } else if (!visible && debounceTimeout === 1000) {
            // TODO: 关闭弹框
            // TODO: 初始化防抖时间
            setDebounceTimeout(100);
        }
        if (document?.getElementById('search-input')) {
            document?.getElementById('search-input')?.focus();
        }
    }, [debounceTimeout, visible])

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
            // setDataSourceList([]);
            fetchData(val, url, query, qty, resValue, resLabel).then((result: any) => {
                console.log(result);
                setDataSourceList(result);
                setFetching(false);
            });
        };
        // TODO: 返回数据，做防抖动设置
        return debounce(loadOptions, debounceTimeout);
    }, [url, qty, query, resLabel, resValue, debounceTimeout]);

    /**
     * @Description: TODO: 搜索弹框关闭
     * @author XXQ
     * @date 2023/4/19
     * @param val   录入的搜索值，可能为空
     * @returns
     */
    const handleModal = (val: any) => {
        // TODO: 当 【visible = true】 时。做关闭操作，否则做搜索
        const searchValue = val?.target?.value || '';
        if (visible) {
            setSearchVal('');
            setFetching(false);
            setDataSourceList([]);
        } else {
            setFetching(true);
            debounceFetcher(searchValue);
        }
        setSearchVal(searchValue);
        setVisible(!visible);
    }

    /**
     * @Description: TODO: change 事件
     * @author XXQ
     * @date 2023/4/17
     * @param record
     * @returns
     */
    const handleChange = (record: any) => {
        console.log(record);
        setShowText(record.label);
        props.handleChangeData(record.value, record);
        handleModal('');
    }

    /**
     * @Description: TODO: 搜索内容，加载 loading
     * @author XXQ
     * @date 2023/4/18
     * @param val       录入的搜索
     * @returns
     */
    const handleChangeInput = (val: any) => {
        setFetching(true);
        setSearchVal(val?.target?.value);
        debounceFetcher(val?.target?.value);
    }

    const columns = [{
        title: '',
        dataIndex: 'label',
        key: 'Key',
    },];

    return (
        <Fragment>
            <Input id={props.id} value={showText} autoComplete={'off'} onChange={handleModal} onClick={handleModal}/>
            {
                !visible ? null :
                    <Modal
                        title={title}
                        footer={null}
                        open={visible}
                        onCancel={handleModal}
                        className={'ant-modal-search-modal'}
                    >
                        <Input id={'search-input'} autoComplete={'off'} autoFocus={true} value={searchVal} onChange={handleChangeInput}/>
                        <Table
                            rowKey={'value'}
                            columns={columns}
                            loading={fetching}
                            pagination={false}
                            dataSource={dataSourceList}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        handleChange(record)
                                    }
                                }
                            }}
                        />
                    </Modal>
            }
        </Fragment>
    )
}
export default SearchModal;