import React, {useState} from 'react';
import {Input} from 'antd'

interface Props {
    id: any,
    value: any,
    valueStr?: string,
    className?: string,

    // TODO: 保存
    handleChangeData: (val: any) => void,
}

const InputEditNumber: React.FC<Props> = (props) => {

    // 设置是否是编辑
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [value, setValue] = useState<any>(props.value || null);

    /**
     * @Description: TODO: 获取修改的数据
     * @author XXQ
     * @date 2023/4/12
     * @param val     失去焦点时，返回数据结果
     * @param state     判断是不是 change 事件
     * @returns
     */
    function handleChange (val: any, state?: any) {
        const valData = val?.target ? val?.target?.value || null : val;
        if(state === 'onBlue') {
            props.handleChangeData(valData);
            // 失去焦点，取消编辑状态
            setIsEdit(false);
        } else {
            // 当是 false 时，变成编辑状态
            if (!isEdit) setIsEdit(true);
            setValue(valData);
        }
        props.handleChangeData(valData);
    }

    return (
        <Input
            id={props.id}
            autoComplete='off'
            onChange={handleChange}
            className={props.className}
            value={isEdit ? value || '' : props.valueStr}
            // 获取焦点时，进入编辑状态
            onFocusCapture={()=> setIsEdit(true)}
            onBlur={(e)=> handleChange(e, 'onBlue')}
        />
    )
}

export default InputEditNumber;