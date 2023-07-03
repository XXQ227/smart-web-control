import React from 'react'
import {Radio} from 'antd'

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
    onChange?: (val: any) => void,
}

const FormItemRadio: React.FC<Props> = (props) => {
    const {id, name, initialValue, required, rules, onChange, FormItem, disabled, options, label} = props;
    return (
        <FormItem
            id={id}
            name={name}
            label={label}
            rules={rules}
            required={required}
            initialValue={initialValue}
        >
            <Radio.Group
                disabled={disabled}
                options={options}
                onChange={onChange}
            />
        </FormItem>
    )
}
export default FormItemRadio;