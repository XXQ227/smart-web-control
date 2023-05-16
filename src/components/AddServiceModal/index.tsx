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

    /*useLayoutEffect(() => {
        const labels = document.querySelectorAll('.ant-radio-button-wrapper label');
        const icons = document.querySelectorAll('.ant-radio-button-wrapper svg');
        const wrappers = document.querySelectorAll('.ant-radio-button-wrapper');

        console.log(labels)
        console.log(icons)
        console.log(wrappers)

        const updateWrapperStyle = (index: number) => {
            wrappers.forEach((wrapper, wrapperIndex) => {
                console.log(index)
                console.log(wrapperIndex)
                if (index === wrapperIndex) {
                    wrapper.classList.add('ant-radio-button-wrapper-checked');
                } else {
                    wrapper.classList.remove('ant-radio-button-wrapper-checked');
                }
            });
        };

        labels.forEach((label, index) => {
            label.addEventListener('click', () => {
                console.log(111111111)
                updateWrapperStyle(index);
            });
        });

        icons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                updateWrapperStyle(index);
            });
        });

        // 在组件卸载时清除事件监听器
        return () => {
            labels.forEach((label, index) => {
                label.removeEventListener('click', () => {
                    console.log(45645135156)
                    updateWrapperStyle(index);
                });
            });

            icons.forEach((icon, index) => {
                icon.removeEventListener('click', () => {
                    updateWrapperStyle(index);
                });
            });
        };
    }, []); // 空数组作为第二个参数确保仅在组件挂载时执行一次*/

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

    /*const options = [
        { label: 'Sea Import', value: 'Sea Import', icon: <IconFont type={'icon-sea'}/> },
        { label: 'Sea Export', value: 'Sea Export', icon: <IconFont type={'icon-sea'}/> },
        { label: 'Cross-border', value: 'Cross-border', icon: <IconFont type={'icon-truck'} /> },
        { label: 'Air Import', value: 'Air Import', icon: <IconFont type={'icon-air'} /> },
        { label: 'Air Export', value: 'Air Export', icon: <IconFont type={'icon-air'} /> },
    ];*/

    /*const options = [
        { label: <label onClick={(e) => handleRadioChange(e.target.innerText)}>Sea Import</label>, value: 'Sea Import', icon: <IconFont type={'icon-sea'}/> },
        { label: <label>Sea Export</label>, value: 'Sea Export', icon: <IconFont type={'icon-sea'}/> },
        { label: <label>Cross-border</label>, value: 'Cross-border', icon: <IconFont type={'icon-truck'} /> },
        { label: <label>Air Import</label>, value: 'Air Import', icon: <IconFont type={'icon-air'} /> },
        { label: <label>Air Export</label>, value: 'Air Export', icon: <IconFont type={'icon-air'} /> },
    ];*/

    /*const labels = document.querySelectorAll('.ant-radio-button-wrapper label');
    const icons = document.querySelectorAll('.ant-radio-button-wrapper svg');
    const wrappers = document.querySelectorAll('.ant-radio-button-wrapper');

    labels.forEach((label, index) => {
        label.addEventListener('click', () => {
            updateWrapperStyle(index);
        });
    });

    icons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            updateWrapperStyle(index);
        });
    });

    function updateWrapperStyle(index: number) {
        wrappers.forEach((wrapper, wrapperIndex) => {
            if (index === wrapperIndex) {
                wrapper.classList.add('ant-radio-button-wrapper-checked');
            } else {
                wrapper.classList.remove('ant-radio-button-wrapper-checked');
            }
        });
    }*/

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
            {/*<Radio.Group className={styles.antRadio}>
                {options.map(option => (
                    <CustomRadio key={option.value} option={option} />
                ))}
            </Radio.Group>*/}

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
