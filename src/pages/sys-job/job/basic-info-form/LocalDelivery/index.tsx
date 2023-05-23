import React, {useEffect, useState} from 'react';
import BasicInfo from './basicInfo';
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import {Tabs} from "antd";
import {ProCard} from "@ant-design/pro-components";

// const FormItem = Form.Item;
interface Props {
    CTNPlanList?: APIModel.ContainerList[],
    NBasicInfo: APIModel.NBasicInfo,
}

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

    useEffect(() => {

    }, [])
    //endregion

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

        const newKey = (tabList.length + 1).toString();

        setTabList(prevTabList => [
            ...prevTabList,
            {
                label: newKey,
                key: newKey,
                closable: true,
                children: renderContent(newKey, newBatch),
            },
        ]);
        setActiveKey(newKey);
    };

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            console.log('添加')
            handleAddBatch()
        } else {
            // remove(targetKey);
            setTabList(prevTabList => prevTabList.filter(tab => tab.key !== targetKey));
        }
    };

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