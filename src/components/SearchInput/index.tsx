import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Select, Spin} from 'antd';
import type {SelectProps} from 'antd/es/select';
import {debounce} from 'lodash';
import {stringify} from 'qs';
import {getBranchID, getUserID} from '@/utils/auths'


/**
 * @Description: TODO: 远程获得数据。并重组后台返回的数据参数结构
 * @author XXQ
 * @date 2023/4/17
 * @param searchVal 搜索参数
 * @param url       后台接口地址
 * @param query     查询参数
 * @param qty       查询数量
 * @param resValue  返回结果的 【Key】 值
 * @param resLabel  返回结果的 【Value】 值
 * @returns
 */
export async function fetchData(searchVal: any, url: string, query: any = {}, qty: number = 5, resValue: string, resLabel: string): Promise<API.APIValue$Label[]> {
    const params = Object.assign({}, query, {value: searchVal, PageSize: qty});
    const options: any = { headers: { Lang: 'en_EN', BranchID: getBranchID(), UserID: getUserID()} };
    return fetch(`${url}?${stringify(params)}`, options)
        .then(response => response.json())
        .then((result) => {
            // TODO: 返回结果
            return result.map((item: any) => ({value: item[resValue], label: item[resLabel], data: item}));
        })
        .catch(e => {
            console.log(e);
        });
}

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string, url: string, query: any, qty: number, resValue: string, resLabel: string) => Promise<ValueType[]>;     // TODO: 异步获取数据
    debounceTimeout?: number;       // TODO: 防抖动时间；默认：1000
    fetchParams?: any;              // TODO: 查询参数
    handleChangeData?: (val: any, option?: any) => void,   // 选中后，返回的结果
}

function DebounceSelect<
    ValueType extends { key?: string | number; label: React.ReactNode; value: string | number } = any,
>({fetchOptions, debounceTimeout = 1000, fetchParams, handleChangeData, ...props}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);
    const {url, query, qty, resValue, resLabel} = fetchParams;

    // TODO: 【useMemo: 】做性能优化用的；类似类组件的性能优化的方法【shouldComponentUpdate、PureComponent】，当数据变动时，做更新
    const debounceFetcher = useMemo(() => {
        /**
         * @Description: TODO: 搜索结果显示
         * @author XXQ
         * @date 2023/4/18
         * @param val     搜索参数
         * @returns
         */
        const loadOptions = (val: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            // TODO: 初始数据，且做【loading】
            setOptions([]);
            setFetching(true);
            fetchOptions(val, url, query, qty, resValue, resLabel).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };
        // TODO: 返回数据，做防抖动设置
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, url, qty, query, resValue, resLabel]);


    /**
     * @Description: TODO: onChange、onSelect 方法，选中后返回结果
     * @author XXQ
     * @date 2023/4/17
     * @param val       {value: number | string, label: string, ...any} 的数据结构，主要用这个数据
     * @param option    {value: number | string, label: string, data: any<{}>} 返回当前行参数结果，可有可无的参数，当有更多返回需求时，用 【option】 数据
     * @returns
     */
    const handleChange = (val: any, option?: any) => {
        setOptions([]);
        if (handleChangeData) handleChangeData(val, option);
    }
    return (
        <Select
            {...props}
            // TODO: 选中时，会返回 {value: number | string, label: string, ...} 的数据结构
            labelInValue
            // TODO: 数据集
            options={options}
            // TODO: 搜索组件，不做当前数据集合的过滤
            filterOption={false}
            // TODO: 搜索结果防抖动设置
            onSearch={debounceFetcher}
            // TODO: 当下拉列表为空时显示的内容
            notFoundContent={fetching ? <Spin size="small"/> : null}
            // onChange={newValue => handleChange(newValue)}
            onSelect={(newValue, option) => handleChange(newValue, option)}
        />
    );
}

// TODO: 父组件传回来的值
interface Props {
    id: any,
    value?: any,
    valueObj?: any,
    disabled?: boolean,
    filedValue?: string,    // 用于显示返回结果 【value】 的返回参数
    filedLabel?: string,    // 用于显示返回结果 【label】 的参数
    url: string,    // 搜索地址
    qty?: number | 5,    // 搜索条数
    query?: any,     // 搜索参数
    placeholder?: string,   // 提示信息
    handleChangeData?: (val: any, option?: any) => void,   // 选中后，返回的结果
}

const SearchInput: React.FC<Props> = (props) => {
    const {url, qty, query, disabled, filedValue, filedLabel} = props;
    // 设置是否是编辑
    const [value, setValue] = useState<API.APIValue$Label>(props.valueObj || {});

    // TODO: 返回结果的数据结构；默认 {Key: number, Value: string}，当有其他返回键值对时，在组件调用时定义
    const resValue: string = filedValue || 'Key';
    const resLabel: string = filedLabel || 'Value';
    // const [resValue, setResValue] = useState<string>('Key');
    // const [resLabel, setResLabel] = useState<string>('Value');

    useEffect(()=> {
        // TODO: 1、当 value 有值且 props 没有值 时, 清空当前空间数据
        // TODO: 2、当 value 没有值 且 props 有值时, 当前是录入状态
        if ((value?.value && !(props.valueObj?.value)) || !(value?.value) && props.valueObj?.value) {
            setValue(props.valueObj);
        }
    }, [props.valueObj, value])

    /**
     * @Description: TODO: onChange、onSelect 方法，选中后返回结果
     * @author XXQ
     * @date 2023/4/17
     * @param val       {value: number | string, label: string, ...any} 的数据结构，主要用这个数据
     * @param option    {value: number | string, label: string, data: any<{}>} 返回当前行参数结果，可有可无的参数，当有更多返回需求时，用 【option】 数据
     * @returns
     */
    const handleChange = (val: any, option?: any) => {
        setValue(val);
        if (props.handleChangeData) props.handleChangeData(val, option);
    }

    return (
        <DebounceSelect
            value={value}
            // 隐藏下拉小箭头
            showArrow={false}
            // 配置可搜索
            showSearch={true}
            disabled={!!disabled}
            fetchOptions={fetchData}
            style={{width: '100%'}}
            dropdownMatchSelectWidth={false}
            fetchParams={{url, query, qty, resValue, resLabel}}
            // onChange={newValue => handleChange(newValue)}
            // onSelect={(newValue, option) => handleChange(newValue, option)}
            handleChangeData={(newValue, option) => handleChange(newValue, option)}
        />
    )
};
export default SearchInput;