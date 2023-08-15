import React from 'react'
import {Form, Input} from 'antd'

const TextArea = Input.TextArea;

const FormItem = Form.Item;
interface Props {
    id?: string,
    name: any,
    label?: string,
    initialValue?: any
    disabled?: boolean,
    rows?: number,
    className?: any,
    required?: boolean,
    rules?: any,
    autoFocus?: boolean,
    allowClear?: boolean,
    placeholder?: string,
    onChange?: (val: any) => void,
}

const FormTextArea: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, onChange, label, rows,
        allowClear, disabled, placeholder, autoFocus,
        required, rules, className
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
            <TextArea
                rows={rows || 4}
                onChange={onChange}
                className={className}
                autoFocus={autoFocus}
                disabled={disabled}
                autoComplete={'off'}
                allowClear={allowClear}
                placeholder={placeholder || ''}
            />
        </FormItem>
    )
}
export default FormTextArea;