import React from 'react'
import {Input} from 'antd'

interface Props {
    id: string,
    name: string,
    initialValue: any
    FormItem: any,
    disabled?: boolean,
    required?: boolean,
    rules?: any,
    autoFocus?: boolean,
    placeholder?: string,
    onChange: (val: any) => void,
}

const FormItemInput: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, onChange, FormItem,
        disabled, placeholder, autoFocus, required, rules,
    } = props;
    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            required={required}
            initialValue={initialValue}
            placeholder={placeholder || ''}
        >
            <Input autoFocus={autoFocus} disabled={disabled} autoComplete={'off'} onChange={onChange}/>
        </FormItem>
    )
}
export default FormItemInput;