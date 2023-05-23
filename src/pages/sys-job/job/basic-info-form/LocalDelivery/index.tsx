import React, {useEffect, useState, useRef} from 'react';
import BasicInfo from './basicInfo';
import styles from "@/pages/sys-job/job/basicInfoForm/style.less";
import {Modal, Tabs} from "antd";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import {Tabs} from "antd";
import {ProCard} from "@ant-design/pro-components";
import {ExclamationCircleFilled} from "@ant-design/icons";

// const FormItem = Form.Item;
interface Props {
    CTNPlanList?: APIModel.ContainerList[],
    NBasicInfo: APIModel.NBasicInfo,
}
const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const LocalDelivery: React.FC<Props> = (props) => {
    const {
        CTNPlanList, NBasicInfo,
    } = props;

    const initialData: APIModel.BatchData[] = [
        {
            shipmentNo: 'SPHK-QY-0012',
            truckingCompany: '招商局建瑞运输有限公司',
            grossWeight: 0,
            measurement: 0,
            pieces: 0,
            vehicleType: '集装箱运输货车',
            plateNo: '',
            driverName: '',
            receivingContac: '',
            phone: '',
        },
        {
            shipmentNo: 'SPHK-QY-0013',
            truckingCompany: '招商局建瑞运输有限公司',
            grossWeight: 0,
            measurement: 0,
            pieces: 0,
            vehicleType: '通用货车',
            plateNo: '',
            driverName: '',
            receivingContac: '',
            phone: '',
        },
    ]

    const renderContent = (key: string, data?: APIModel.BatchData) => {
        return <BasicInfo
            CTNPlanList={CTNPlanList}
            NBasicInfo={NBasicInfo}
            batchNo={key}
            data={data}
            handleChangeLabel={(val: any) => handleChangeLabel(val)}
        />
    }

    const initialTabList = [
        {
            label: 'SPHK-QY-0012',
            key: '1',
            closable: false,
            children: renderContent('SPHK-QY-0012', initialData[0]),
        },
        {
            label: 'SPHK-QY-0013',
            key: '2',
            closable: false,
            children: renderContent('SPHK-QY-0013', initialData[1]),
        },
    ];
    const [tabList, setTabList] = useState(initialTabList);
    const [activeKey, setActiveKey] = useState(initialTabList[0].key);
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(3);

    useEffect(() => {

    }, [])

    const handleAddBatch = () => {
        const newBatch: APIModel.BatchData = {
            shipmentNo: '',
            truckingCompany: '',
            grossWeight: 0,
            measurement: 0,
            pieces: 0,
            vehicleType: '',
            plateNo: '',
            driverName: '',
            receivingContac: '',
            phone: '',
        };

        const newActiveKey = (newTabIndex.current++).toString()
        setTabList(prevTabList => [
            ...prevTabList,
            {
                label: 'New Tab',
                key: newActiveKey,
                closable: true,
                children: renderContent(newActiveKey, newBatch),
            },
        ]);
        setActiveKey(newActiveKey);
    };

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    const remove = (targetKey: TargetKey) => {
        confirm({
            title: `Are you sure delete this shipment 【${targetKey}】?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
                const newPanes = tabList.filter((tab) => tab.key !== targetKey);
                if (newPanes.length && targetKey === activeKey) {
                    const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                    setActiveKey(key);
                }
                setTabList(newPanes);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            handleAddBatch()
        } else {
            remove(targetKey);
            // setTabList(prevTabList => prevTabList.filter(tab => tab.key !== targetKey));
        }
    };

    function handleChangeLabel(value: any) {
        setTabList(prevTabList => {
            const updatedTabList = [...prevTabList];
            const activeTab = updatedTabList.find(tab => tab.key === activeKeyRef.current);
            if (activeTab) {
                activeTab.label = value;
            }
            return updatedTabList;
        });
    }

    return (
        <ProCard
            className={styles.localDelivery}
            title={'Basic Information'}
            bordered={true}
            headerBordered
            collapsible
        >
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={handleTabChange}
                onEdit={onEdit}
                items={tabList}
            >
                {/*{tabList.map(tab => (
                    <Tabs.TabPane key={tab.key} tab={tab.label} closable={tab.closable}>
                        {tab.content}
                    </Tabs.TabPane>
                ))}*/}
            </Tabs>
        </ProCard>
    )
}
export default LocalDelivery;