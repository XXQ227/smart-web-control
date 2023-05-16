import styles from './index.less';
import React, { useState} from "react";
import {Modal, Button, Divider, Radio} from 'antd';
import {IconFont} from "@/utils/units";

interface Props {
    open: boolean,
    onOk: () => void,
    onCancel: () => void,
}

interface Option {
    label: string;
    value: string;
    icon: string;
}

interface CustomRadioProps {
    option: Option;
    checked: boolean;
    onChange: (value: string) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ option, checked, onChange }) => {
    const handleClick = () => {
        onChange(option.value);
    };

    return (
        <Radio.Button value={option.value} checked={checked} onClick={handleClick}>
            <IconFont type={option.icon}/>
            <label onClick={handleClick}>{option.label}</label>
        </Radio.Button>
    );
};

const AddServiceModal: React.FC<Props> = (props) => {
    const [transportID, setTransportID] = useState(0);
    const [checkedValue, setCheckedValue] = useState('');

    const serviceList = [
        {
            serviceName: 'Sea Import',
            Key: 1,
            Icon: 'icon-sea'
        },
        {
            serviceName: 'Sea Export',
            Key: 2,
            Icon: 'icon-sea'
        },
        {
            serviceName: 'Cross-border',
            Key: 3,
            Icon: 'icon-truck'
        },
        {
            serviceName: 'Air Import',
            Key: 4,
            Icon: 'icon-air'
        },
        {
            serviceName: 'Air Export',
            Key: 5,
            Icon: 'icon-air'
        }
    ]

    const StepsOnChange = (index: number, Type: number, List: any) => {
        console.log(index, Type, List)

        switch (Type) {
            case 1:
                setTransportID(index)
                break;
            default:
                break;
        }

    }

    const handleAddService = () => {
        props.onOk()

        // setOpenOperate(false);
    }

    const handleCancel = () => {
        props.onCancel()

        // setOpenOperate(false);
    }

    const handleRadioChange = (value: any) => {
        setCheckedValue(value);
    }

    const options = [
        { label: 'Sea Import', value: 'Sea Import', icon: 'icon-sea' },
        { label: 'Sea Export', value: 'Sea Export', icon: 'icon-sea' },
        { label: 'Cross-border', value: 'Cross-border', icon: 'icon-truck' },
        { label: 'Air Import', value: 'Air Import', icon: 'icon-air' },
        { label: 'Air Export', value: 'Air Export', icon: 'icon-air' },
    ];

    return (
        <Modal
            className={styles.addServiceModal}
            open={props.open}
            bodyStyle={{height: 500}}
            onOk={handleAddService}
            onCancel={handleCancel}
            title={'Add Service'}
            // className={"modal modal-create"}
            width={1000}
            footer={[
                <Button htmlType={"button"} key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button htmlType={"button"} key="submit" type="primary" onClick={handleAddService}>
                    Next
                </Button>,
            ]}
        >
            <Divider orientation="left">Service Type</Divider>
            <Radio.Group className={styles.antRadio} value={checkedValue} onChange={(e) => handleRadioChange(e.target.value)}>
                {options.map(option => (
                    <CustomRadio key={option.value} option={option} checked={checkedValue === option.value} onChange={handleRadioChange} />
                ))}
            </Radio.Group>

            {/*<div>
                <Steps
                    current={transportID}
                    onChange={(Cur) => StepsOnChange(Cur, 1, serviceList)}
                >
                    {serviceList.map(item => (
                        <Steps
                            key={item.serviceName}
                            title={item.serviceName}
                            icon={<IconFont type={item.Icon} />}

                        />
                    ))}
                </Steps>
            </div>*/}
        </Modal>
    );
};

export default AddServiceModal;
