import React from 'react'
import {Form, Radio} from 'antd'

const FormItem = Form.Item;
interface Props {
    id?: string,
    name?: string,
    initialValue?: any
    options: any
    label?: any,
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    onChange?: (val: any) => void,
}

const FormItemRadio: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, required, rules,
        onChange, disabled, options, label
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
            <Radio.Group
                disabled={disabled}
                options={options}
                onChange={onChange}
            />
        </FormItem>
    )
}
export default FormItemRadio;