import React, {useEffect, useState} from 'react';
import {ProFormSelect} from '@ant-design/pro-components'
import {fetchData} from '@/utils/fetch-utils'

// TODO: 父组件传回来的值
interface Props {
    id: any,
    name: any,
    label?: string,
    isShowLabel?: boolean,
    width?: any,
    valueObj?: any,
    disabled?: boolean,
    filedValue?: string,    // 用于显示返回结果 【value】 的返回参数
    filedLabel?: string,    // 用于显示返回结果 【label】 的参数
    url: string,    // 搜索地址
    qty?: number | 5,    // 搜索条数
    query?: any,     // 搜索参数
    placeholder?: string,   // 提示信息
    required?: boolean,
    allowClear?: boolean,
    handleChangeData?: (val?: any, option?: any) => void,   // 选中后，返回的结果
    handleClearData?: () => void,                           // 清楚选中的结果
}

const SearchProFormSelect: React.FC<Props> = (props) => {
    const {
        valueObj, label, url, qty, query,
        disabled, filedValue, filedLabel,
        required, placeholder, isShowLabel,
    } = props;
    // 设置是否是编辑
    const [valInput, setUserInput] = useState<API.APIValue$Label>(valueObj || {});
    const [isSearch, setIsSearch] = useState<boolean>(false);

    // TODO: 返回结果的数据结构；默认 {Key: number, Value: string}，当有其他返回键值对时，在组件调用时定义
    const resValue: string = filedValue || 'value';
    const resLabel: string = filedLabel || 'label';
    // const [resValue, setResValue] = useState<string>('Key');
    // const [resLabel, setResLabel] = useState<string>('Value');

    useEffect(()=> {
        // TODO: 1、当 value 有值且 props 没有值 时, 清空当前空间数据
        // TODO: 2、当 value 没有值 且 props 有值时, 当前是录入状态
        if ((valInput?.value && !(valueObj?.value)) || !(valInput?.value) && valueObj?.value) {
            setUserInput(valueObj);
        }
    }, [valueObj, valInput])

    /**
     * @Description: TODO: onChange、onSelect 方法，选中后返回结果
     * @author XXQ
     * @date 2023/4/17
     * @param val       {value: number | string, label: string, ...any} 的数据结构，主要用这个数据
     * @param option    {value: number | string, label: string, data: any<{}>} 返回当前行参数结果，可有可无的参数，当有更多返回需求时，用 【option】 数据
     * @returns
     */
    const handleChange = (val: any, option?: any) => {
        setUserInput(val);
        setIsSearch(false);
        if (props.handleChangeData) props.handleChangeData(val, option);
    }

    function handleClearData() {
        setIsSearch(false);
        if (props.handleClearData) props.handleClearData();
    }

    return (
        <ProFormSelect
            showSearch
            name={props.name}
            width={props.width}
            debounceTime={1000}
            disabled={disabled}
            required={!!required}
            // initialValue={valInput}
            // initialValue={valueObj}
            allowClear={props.allowClear}
            placeholder={placeholder || ""}
            label={isShowLabel ? label : ''}
            fieldProps={{
                showArrow: false,
                onSelect: handleChange,
                onClear: handleClearData,
                onSearch: ()=> {
                    // TODO: 当在搜索时，调用搜索接口
                    if (!isSearch) setIsSearch(true);
                },
                onMouseDown: ()=> {
                    // TODO: 获取焦点时，才搜索数据
                    setIsSearch(true);
                },
                onMouseLeave: ()=> {
                    // TODO: 失去焦点时不搜索（在录入搜索时，可搜索）
                    setIsSearch(false);
                },
            }}
            rules={[{ required: !!required, message: label }]}
            request={async (val: any) => {
                if (isSearch) {
                    return await fetchData(val.keyWords, url, query, qty, resValue, resLabel)
                } else {
                    return valueObj && valueObj?.value && valueObj?.label ? [valueObj] : [];
                }
            }}
        />
    )
};
export default SearchProFormSelect;