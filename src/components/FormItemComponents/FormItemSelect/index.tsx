import React from 'react'
import {Input} from 'antd'

interface Props {
    id: string,
    name: string,
    initialValue: any
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    FormItem?: any,
    onChange: (val: any) => void,
}

const FormItemSelect: React.FC<Props> = (props) => {
    const {id, name, initialValue, required, rules, onChange, FormItem, disabled, placeholder} = props;
    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            required={required}
            disabled={disabled}
            initialValue={initialValue}
            placeholder={placeholder || ''}
        >
            <Input onChange={onChange}/>
        </FormItem>
    )
}
export default FormItemSelect;