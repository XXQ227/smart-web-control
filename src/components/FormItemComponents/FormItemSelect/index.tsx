import React from 'react'
import {Select} from 'antd'

interface Props {
    id: string,
    name: string,
    initialValue?: any
    options: any
    label?: any,
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    FormItem: any,
    onSelect?: (val: any) => void,
}

const FormItemSelect: React.FC<Props> = (props) => {
    const {id, name, initialValue, required, rules, onSelect, FormItem, disabled, options, label} = props;
    return (
        <FormItem
            id={id}
            name={name}
            label={label}
            rules={rules}
            required={required}
            disabled={disabled}
            initialValue={initialValue}
        >
            <Select
                onSelect={onSelect}
                options={options}
            />
        </FormItem>
    )
}
export default FormItemSelect;