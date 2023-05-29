import React, {useEffect, useState} from 'react';
import {ProFormSelect} from '@ant-design/pro-components'
import styles from '@/pages/sys-job/job/basic-info-form/style.less'
import {fetchData} from '@/utils/fetch-utils'


// TODO: 父组件传回来的值
interface Props {
    id: any,
    name: string,
    label?: string,
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
    handleChangeData?: (val: any, option?: any) => void,   // 选中后，返回的结果
}

// TODO: isSearch === 0：开始第一次搜索；isSearch === 1 时，可搜索；isSearch === 2：搜索完后，选中结果
let isSearch: number = 0;

const SearchProFormSelect: React.FC<Props> = (props) => {
    const {valueObj, label, url, qty, query, disabled, filedValue, filedLabel, required, placeholder} = props;
    // 设置是否是编辑
    const [valInput, setUserInput] = useState<API.APIValue$Label>(valueObj || {});
    // const [isSearch, setIsSearch] = useState<boolean>(false);

    // TODO: 返回结果的数据结构；默认 {Key: number, Value: string}，当有其他返回键值对时，在组件调用时定义
    const resValue: string = filedValue || 'Key';
    const resLabel: string = filedLabel || 'Value';
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
        setUserInput(val);//setIsSearch(false);
        isSearch = 2;
        if (props.handleChangeData) props.handleChangeData(val, option);
    }

    return (
        <ProFormSelect
            allowClear={props.allowClear}
            showSearch
            label={label}
            name={props.name}
            required={!!required}
            width={props.width}
            debounceTime={1000}
            disabled={disabled}
            // initialValue={valInput}
            initialValue={valueObj}
            className={styles.mySelect}
            placeholder={placeholder || ""}
            fieldProps={{
                showArrow: false,
                onSelect: handleChange,
                onSearch: ()=> {
                    // TODO: isSearch === 0：变成搜索
                    if (isSearch === 0) {
                        isSearch = 1;
                    }
                    // TODO: isSearch === 2：结束搜索
                    else if (isSearch === 2) {
                        isSearch = 0;
                    }
                },
            }}
            rules={[{ required: true, message: label }]}
            // @ts-ignore
            request={(val: any) => {
                // TODO: isSearch === 1：可搜索
                if (isSearch === 1) {
                    return fetchData(val.keyWords, url, query, qty, resValue, resLabel)
                } else {
                    return [];
                }
            }}
        />
    )
};
export default SearchProFormSelect;