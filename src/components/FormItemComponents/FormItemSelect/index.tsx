import React from 'react'
import {Form, Select} from 'antd'

const FormItem = Form.Item;
interface Props {
    id?: string,
    name: string,
    initialValue?: any
    options: any
    label?: any,
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    onSelect?: (val: any) => void,
}

const FormItemSelect: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, required, rules,
        onSelect, disabled, options, label
    } = props;
    return (
        <FormItem
            id={id}
            name={name}
            label={label}
            rules={rules}
            required={required}
            initialValue={initialValue}
        >
            <Select
                options={options}
                disabled={disabled}
                onSelect={onSelect}
                // options={options.map((item: any) => ({ label: item.label || item, value: item.value || item }))}
            />
        </FormItem>
    )
}
export default FormItemSelect;