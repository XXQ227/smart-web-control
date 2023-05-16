import styles from './index.less';
import React, {useState} from "react";
import {Modal, Button, Divider, Steps, Form, Radio, Input} from 'antd';
import {IconFont} from "@/utils/units";

interface Props {
    open: boolean,
    onOk: () => void,
    onCancel: () => void,
}

interface Option {
    label: string;
    value: string;
    icon: JSX.Element;
}

interface CustomRadioProps {
    option: Option;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ option }) => {
    return (
        <Radio.Button value={option.value} className={styles.antButton} >
            {option.icon}
            {option.label}
        </Radio.Button>
    );
};

const AddServiceModal: React.FC<Props> = (props) => {
    const [transportID, setTransportID] = useState(0);

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

    const options = [
        { label: <label>Sea Import</label>, value: 'Sea Import', icon: <IconFont type={'icon-sea'}/> },
        { label: <label>Sea Export</label>, value: 'Sea Export', icon: <IconFont type={'icon-sea'}/> },
        { label: <label>Cross-border</label>, value: 'Cross-border', icon: <IconFont type={'icon-truck'} /> },
        { label: <label>Air Import</label>, value: 'Air Import', icon: <IconFont type={'icon-air'} /> },
        { label: <label>Air Export</label>, value: 'Air Export', icon: <IconFont type={'icon-air'} /> },
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
            <Radio.Group className={styles.antRadio}>
                {options.map(option => (
                    <CustomRadio key={option.value} option={option} />
                ))}
            </Radio.Group>
        </Modal>
    );
};

export default AddServiceModal;
