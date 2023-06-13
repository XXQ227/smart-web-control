import React from 'react'
import {Switch} from 'antd'

interface Props {
    id: string,
    name: string,
    checkedChildren?: string,
    unCheckedChildren?: string,
    initialValue: any
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    FormItem?: any,
    onChange: (val: any) => void,
}

const FormItemSwitch: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, required, rules, onChange, FormItem, disabled,
        checkedChildren, unCheckedChildren,
    } = props;
    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            required={required}
            disabled={disabled}
            initialValue={initialValue}
        >
            <Switch
                onChange={onChange}
                checked={initialValue}
                checkedChildren={checkedChildren || 'Yes'}
                unCheckedChildren={unCheckedChildren || 'No'}
            />
        </FormItem>
    )
}
export default FormItemSwitch;