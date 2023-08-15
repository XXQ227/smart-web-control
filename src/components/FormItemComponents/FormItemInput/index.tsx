import React from 'react'
import {Form, Input} from 'antd'

const FormItem = Form.Item;
interface Props {
    id?: string,
    name: string,
    label?: string,
    initialValue?: any
    disabled?: boolean,
    suffix?: any,
    className?: any,
    required?: boolean,
    rules?: any,
    autoFocus?: boolean,
    allowClear?: boolean,
    placeholder?: string,
    onChange?: (val: any) => void,
}

const FormItemInput: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, onChange, label, suffix, allowClear,
        disabled, placeholder, autoFocus, required, rules, className
    } = props;

    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            label={label}
            required={required}
            initialValue={initialValue}
        >
            <Input
                className={className}
                autoFocus={autoFocus}
                disabled={disabled}
                autoComplete={'off'}
                suffix={suffix}
                allowClear={allowClear}
                placeholder={placeholder || ''}
                onChange={onChange}
            />
        </FormItem>
    )
}
export default FormItemInput;