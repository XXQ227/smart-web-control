import React from 'react'
import {Form, Switch} from 'antd'


const FormItem = Form.Item;
interface Props {
    id?: string,
    name?: any,
    checkedChildren?: string,
    unCheckedChildren?: string,
    initialValue: any
    rules?: any,
    disabled?: boolean,
    required?: boolean,
    onChange: (val: any) => void,
}

const FormItemSwitch: React.FC<Props> = (props) => {
    const {
        id, name, initialValue, required, rules, onChange, disabled,
        checkedChildren, unCheckedChildren,
    } = props;
    return (
        <FormItem
            id={id}
            name={name}
            rules={rules}
            required={required}
            initialValue={initialValue}
        >
            <Switch
                disabled={disabled}
                onChange={onChange}
                checked={initialValue}
                checkedChildren={checkedChildren || 'Yes'}
                unCheckedChildren={unCheckedChildren || 'No'}
            />
        </FormItem>
    )
}
export default FormItemSwitch;