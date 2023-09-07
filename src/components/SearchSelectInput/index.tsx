import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {Input} from 'antd';
import type {SelectProps} from 'antd/es/select';
import {debounce} from 'lodash';
import styles from './index.less';
import classNames from 'classnames';
import {LoadingOutlined} from '@ant-design/icons'
import {fetchData} from '@/utils/fetch-utils'
import {IconFont} from "@/utils/units";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string, url: string, query: any, qty: number, resValue: string, resLabel: string) => Promise<ValueType[]>;     // TODO: 异步获取数据
    debounceTimeout?: number;       // TODO: 防抖动时间；默认：1000
    valueObj?: any;                 // TODO: 查询参数
    fetchParams?: any;              // TODO: 查询参数
    handleChangeData?: (val: any, option?: any) => void,   // 选中后，返回的结果
}

function DebounceSelect<
    ValueType extends { key?: string | number; label: React.ReactNode; value: string | number } = any,
>({fetchOptions, debounceTimeout = 1000, fetchParams, handleChangeData, valueObj, ...props}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);

    const [wrapClass, setWrapClass] = useState<string>(`ant-select-dropdown ant-select-dropdown-hidden ${styles["slide-up-out"]}`);

    const [activeItem, setActiveItem] = useState(-1);           // TODO: 激活的元素 序号
    const fetchRef = useRef(0);

    const {url, query, qty, resValue, resLabel} = fetchParams;

    const classItemPrefix = 'ant-select-dropdown-menu-item';
    const activeItemClass = 'ant-select-dropdown-menu-item-active';          //激活的元素class样式
    const selectItemClass = 'ant-select-dropdown-menu-item-selected';        //已选择项class样式

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
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleSearch(val);
            fetchOptions(val, url, query, qty, resValue, resLabel).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                console.log(newOptions);
                setOptions(newOptions);
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                toggleOption('show');
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
     * @returns
     */
    const handleChange = (val: any) => {
        debounceFetcher(val?.target.value);
    }

    /**
     * @Description: TODO: onChange、onSelect 方法，选中后返回结果
     * @author XXQ
     * @date 2023/4/17
     * @param val       {value: number | string, label: string, ...any} 的数据结构，主要用这个数据
     * @param option    {value: number | string, label: string, data: any<{}>} 返回当前行参数结果，可有可无的参数，当有更多返回需求时，用 【option】 数据
     * @returns
     */
    const handleSelect = (val: any, option?: any) => {
        setOptions([]);
        if (handleChangeData) handleChangeData(val, option);
    }

    const handleSearch = (val: any) => {
    }

    /**
     * @Description: TODO: 切换选项开关
     * @author XXQ
     * @date 2023/5/22
     * @param state 隐藏、显示状态
     * @returns
     */
    const toggleOption = (state: string = 'hide') => {
        let cs = `ant-select-dropdown ant-select-dropdown-hidden`;
        if (state == 'show') {
            cs += ` ${styles["slide-up-in"]}`;
        } else if (state == 'hide') {
            cs += ` ${styles["slide-up-out"]}`;
        }
        setWrapClass(cs);
        setActiveItem(-1);
        if (state === 'hide') setOptions([]);
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
            if (options?.length > 0) {
                //如果激活序号为空
                if (activeItem === -1) {
                    // TODO: 【keyCode === 40】down arrow.svg 设置成第一项；【keyCode === 38】up arrow.svg 设置成最后一项
                    opActiveItem = keyCode === 40 ? 0 : options.length - 1;
                } else {
                    switch (keyCode) {
                        case 38:
                            //up arrow.svg 序号减一
                            opActiveItem = activeItem !== 0 ? activeItem - 1 : options.length - 1;
                            break;
                        case 40:
                            //down arrow.svg 序号加一
                            opActiveItem = activeItem !== options.length - 1 ? activeItem + 1 : 0;
                            break;
                        default: return;
                    }
                }
                setActiveItem(opActiveItem);
            }
        }
        // TODO: 回车操作  回填已选中的选项，并关闭菜单
        else if (keyCode === 13) {
            if (activeItem !== -1) {
                const selData = options?.find((value, index) => index === activeItem);
                handleChange(selData);
            } else if (activeItem === -1) {
                // handleModal(showText);
            }
            toggleOption('hide');
        }
        // TODO: 退出操作
        else if (keyCode === 27) {
            // handleModal('');
            toggleOption('hide');
        }
    }

    return (
        <Fragment>
            <Input
                // id={id}
                // size={size}
                value={valueObj?.value}
                // style={style}
                // disabled={disabled}
                placeholder={''}
                autoComplete={"off"}
                // TODO: change 事件
                onChange={handleChange}
                // TODO: 键盘按下事件
                onKeyDown={handleKeyDown}
                // TODO: 失去焦点
                onBlur={()=> toggleOption('hide')}
                // TODO: 获取焦点
                // onFocus={handleFocus}
                onFocus={()=> valueObj.value ? debounceFetcher(valueObj.value) : null}
                prefix={fetching ? <LoadingOutlined color={'rgba(0,0,0,.25)'} /> : <IconFont type={'icon-search'} />}
            />
            <div className={classNames(wrapClass)} style={{ minHeight: '100%', top: 32, left: 0 }}>
                <ul className="ant-select-dropdown-menu ant-select-dropdown-menu-customize">
                    {
                        options.map((item, index) => {
                            let classStr = classItemPrefix;
                            if (index == activeItem) {
                                classStr += ' ' + activeItemClass;
                            } else if (valueObj.value == item.value) {
                                classStr += ' ' + selectItemClass;
                            }
                            return (
                                <li
                                    className={classNames(classStr)} onMouseOver={()=>setActiveItem(index)}
                                    onClick={() => handleSelect(item, item)} key={item.value} value={item.value}
                                >
                                    {item.label}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </Fragment>
    );

    // return (
    //     <Select
    //         {...props}
    //         // TODO: 选中时，会返回 {value: number | string, label: string, ...} 的数据结构
    //         labelInValue
    //         // TODO: 数据集
    //         options={options}
    //         // TODO: 搜索组件，不做当前数据集合的过滤
    //         filterOption={false}
    //         // TODO: 搜索结果防抖动设置
    //         onSearch={debounceFetcher}
    //         // TODO: 当下拉列表为空时显示的内容
    //         notFoundContent={fetching ? <Spin size="small"/> : null}
    //         // onChange={newValue => handleChange(newValue)}
    //         onSelect={(newValue, option) => handleSelect(newValue, option)}
    //     />
    // );
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
            valueObj={value}
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