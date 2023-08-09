import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {Input, Modal, Table} from 'antd';
import {debounce} from 'lodash'
import {IconFont} from '@/utils/units';
import {fetchData} from '@/utils/fetch-utils'
import type {ColumnsType} from 'antd/es/table';

interface Props {
    name?: any,
    // value?: any,             // ID 数据 / 其他字符
    text?: string,           // 显示 【Name】 数据
    url: string,    // 搜索地址
    qty: number,    // 搜索条数
    query?: any,     // 搜索参数
    title?: string,
    disabled?: boolean,
    modalWidth?: number,
    rowKey?: string,
    showLabel?: boolean,
    showHeader?: boolean,
    filedValue?: string,    // 用于显示返回结果 【value】 的返回参数
    filedLabel?: string[],    // 用于显示返回结果 【label】 的参数
    prefix?: any,           // 显示前缀图标
    className?: string,
    handleChangeData: (val: any, option?: any) => void,   // 选中后，返回的结果
}

const SearchTable: React.FC<Props> = (props) => {
    const {
        url, query, qty, filedValue, filedLabel, showLabel,
    } = props;

    const [visible, setVisible] = useState<boolean>(false);     // TODO: Modal 隐藏显示开关
    const [fetching, setFetching] = useState(false);            // TODO: 搜索 Loading 状态
    const [dataSourceList, setDataSourceList] = useState([]);   // TODO: 搜索返回数据
    // const [searchVal, setSearchVal] = useState<string>('');     // TODO: 搜索录入参数
    const [showText, setShowText] = useState<string>(props.text || '');     // TODO: 搜索录入参数
    const [debounceTimeout, setDebounceTimeout] = useState<number>(100);     // TODO: 防抖动时间

    const [activeItem, setActiveItem] = useState(-1);           // TODO: 激活的元素 序号

    // TODO: 接口返回的键值
    const resValue: string = filedValue || 'value';
    const resLabel: any = filedLabel || 'label';

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
        return () => {

        }
    }, [debounceTimeout, visible])

    /*useEffect(() => {
        if (props.name === "PlaceOfReceiptID" && !visible && props.text !== showText) {
            setShowText(props.text || '')
        }
        if (props.name === "PlaceOfDeliveryID" && !visible && props.text !== showText) {
            setShowText(props.text || '')
        }
    }, [props.text])*/

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
    function handleModal (val: any){
        // TODO: 当 【visible = true】 时。做关闭操作，否则做搜索
        // const searchValue = val?.target?.value || '';
        if (visible) {
            // setSearchVal('');
            setFetching(false);
            setDataSourceList([]);
            setActiveItem(-1);
            // document?.getElementById(props.id)?.focus();
        } else {
            setFetching(true);
            debounceFetcher('');
        }
        // setSearchVal(searchValue);
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
        setShowText(record.name);
        if (props.handleChangeData) props.handleChangeData(record.code, record);
        // setShowText(record.label);
        // if (props.handleChangeData) props.handleChangeData(record.value, record);
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
        // setSearchVal(val?.target?.value);
        debounceFetcher(val?.target?.value);
    }

    /**
     * @Description: TODO: 控制键盘上下的激活选项：keyCode 38=up arrow.svg  40=down arrow.svg   13=Enter
     * @author XXQ
     * @date 2023/4/20
     * @param e     按钮按下时，返回的参数
     * @returns
     */
    const handleKeyDown = (e: any) => {
        const keyCode = e.keyCode;
        let opActiveItem = -1;
        //如果是 up arrow.svg 和 down arrow.svg 操作
        if (keyCode === 38 || keyCode === 40) {
            if (dataSourceList?.length > 0) {
                //如果激活序号为空
                if (activeItem === -1) {
                    // TODO: 【keyCode === 40】down arrow.svg 设置成第一项；【keyCode === 38】up arrow.svg 设置成最后一项
                    opActiveItem = keyCode === 40 ? 0 : dataSourceList.length - 1;
                } else {
                    switch (keyCode) {
                        case 38:
                            //up arrow.svg 序号减一
                            opActiveItem = activeItem !== 0 ? activeItem - 1 : dataSourceList.length - 1;
                            break;
                        case 40:
                            //down arrow.svg 序号加一
                            opActiveItem = activeItem !== dataSourceList.length - 1 ? activeItem + 1 : 0;
                            break;
                        default: return;
                    }
                }
                setActiveItem(opActiveItem);
            }
        } else if (keyCode === 13) {
            //回车操作  回填已选中的选项，并关闭菜单
            if (activeItem !== -1) {
                const selData = dataSourceList?.find((value, index) => index === activeItem);
                handleChange(selData);
            } else if (activeItem === -1) {
                handleModal(showText);
            }
        } else if (keyCode === 27) {
            handleModal('');
        }
    }

    const columns: ColumnsType<any> = [
        { title: 'Port', dataIndex: 'name', className: 'columnsStyle'},
        { title: 'Code', align: 'center', width: 120, dataIndex: 'code', className: 'columnsStyle',},
        { title: 'City', align: 'center', width: 260, dataIndex: 'city', className: 'columnsStyle', },
        { title: 'Country', dataIndex: 'country', width: 260, align: 'center', className: 'columnsStyle', },
    ];

    return (
        <Fragment>
            {showLabel ? <label style={{display: 'block', marginBottom: 8}}>{props.title}</label> : null}
            <Input
                readOnly={true}
                value={showText}
                name={props.name}
                autoComplete={'off'}
                placeholder={'Click'}
                onClick={handleModal}
                prefix={<IconFont type={'icon-search'}/>}
                // className={`searchTable-input ${props.className}`}
                className={props.className}
            />
            {
                !visible ? null :
                    <Modal
                        footer={null}
                        open={visible}
                        title={props.title}
                        onCancel={handleModal}
                        width={props.modalWidth || 550}
                        className={'ant-modal-search-modal'}
                    >
                        <Input
                            id={'search-input'}
                            autoComplete={'off'}
                            autoFocus={true}
                            // value={searchVal}
                            placeholder={'Search'}
                            onChange={handleChangeInput}
                            onKeyDown={handleKeyDown}
                        />
                        <Table
                            columns={columns}
                            loading={fetching}
                            pagination={false}
                            dataSource={dataSourceList}
                            className={'table modal-table'}
                            rowKey={props.rowKey || 'value'}
                            showHeader={props.showHeader || false}
                            rowClassName={(record: any, index) => {
                                let className = '';
                                if (activeItem === index) {
                                    className = 'ant-table-row-active-class';
                                }
                                return className;
                            }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        handleChange(record)
                                    },
                                }
                            }}
                        />
                    </Modal>
            }
        </Fragment>
    )
}
export default SearchTable;