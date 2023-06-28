import React from 'react'
import {Input} from 'antd'

interface Props {
    id: string,
    name: string,
    label?: string,
    initialValue?: any
    FormItem: any,
    disabled?: boolean,
    suffix?: any,
    className?: any,
    required?: boolean,
    rules?: any,
    autoFocus?: boolean,
    placeholder?: string,
    onChange?: (val: any) => void,
}

const FormItemInput: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, onChange, FormItem, label, suffix,
        disabled, placeholder, autoFocus, required, rules, className
    } = props;
    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            label={label}
            required={required}
            className={className}
            initialValue={initialValue}
        >
            <Input
                autoFocus={autoFocus} disabled={disabled} autoComplete={'off'}
                suffix={suffix} placeholder={placeholder || ''} onChange={onChange}
            />
        </FormItem>
    )
}
export default FormItemInput;