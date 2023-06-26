import React from 'react'
import {Input} from 'antd'

interface Props {
    id: string,
    name: string,
    label: string,
    initialValue: any
    FormItem: any,
    disabled?: boolean,
    required?: boolean,
    rules?: any,
    autoFocus?: boolean,
    placeholder?: string,
    onChange?: (val: any) => void,
}

const FormItemInput: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, onChange, FormItem, label,
        disabled, placeholder, autoFocus, required, rules,
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
                autoFocus={autoFocus} disabled={disabled} autoComplete={'off'}
                placeholder={placeholder || ''} onChange={onChange}
            />
        </FormItem>
    )
}
export default FormItemInput;