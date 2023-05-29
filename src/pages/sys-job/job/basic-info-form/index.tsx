import React, {useEffect, useState} from 'react';
import {history, useModel} from 'umi';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProForm} from '@ant-design/pro-components';
import {Button, message, Modal} from 'antd';
import {getUserID} from '@/utils/auths';
import Job from './job';
import SeaExport from './sea-export';
import SeaImport from './sea-import';
import LocalDelivery from './local-delivery';
import {HeaderInfo} from '@/utils/units'
import styles from './style.less';
import {LeftOutlined, SaveOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import AddServiceModal from '@/components/AddServiceModal';

// const { TabPane } = Tabs;
// const FormItem = Form.Item;
const { confirm } = Modal;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

// 动态生成标签页信息
const initialTabList = [
    { tab: 'Job', key: 'Job', closable: false },
    { tab: 'Sea (Export)', key: 'Sea (Export)', closable: false },
    { tab: 'Local Delivery', key: 'Local Delivery', closable: false },
];

const BasicInfoForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    //region TODO: 数据层
    const {
        CommonBasicInfo: {SalesManList, FinanceDates},
        CJobInfo, CJobInfo: {NBasicInfo, NBasicInfo: {Principal, Carrier, Port}, LockDate, CTNPlanList, HouseBill},
        getCJobInfoByID
    } = useModel('job.job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        CommonBasicInfo: res.CommonBasicInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
    //endregion

    /** 实例化Form */
    // const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState(initialTabList[0].key);
    const [tabList, setTabList] = useState(initialTabList);
    const [jobID, setJobID] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        // TODO: 当【没有 ID && isLoadingData == false】时调用接口获取数据
        if (!jobID && !isLoadingData && params?.id !== ':id') {
            isLoadingData = true;
            getCJobInfoByID({
                CJobID: Number(atob(params?.id)),
                BizType4ID: Number(atob(params?.bizType4id)),
                UserID: getUserID()
            })
                // @ts-ignore
                .then((res: APIModel.NJobDetailDto) => {
                    // TODO: 设置 ID 且初始化数据
                    setJobID(res?.ID);
                    setLoading(false);
                    isLoadingData = false;
                })
        }
    }, [getCJobInfoByID, jobID, params?.bizType4id, params?.id])
    //endregion

    const handleTabChange = (key: string) => {
        setActiveKey(key);
        window.scroll({
            top: 0,
        });
    };

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/4/18
     * @returns
     */
    /*const handleSave = () => {
        form.validateFields()
            .then((value) => {
                console.log('value: ', value);
            })
            .catch((errorInfo) => {
                // TODO: 提交失败。弹出错误提示
                console.log('errorInfo: ' + errorInfo);
                /!** 错误信息 *!/
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any) => x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    }*/

    const handleFinish = async (values: Record<string, any>) => {
        try {
            console.log(values)
            // await fakeSubmitForm(values);
            message.success('提交成功');
        } catch {
            // console.log
        }
    };

    /*if (ticketData.basic-info) {
        tabList.push({
            tab: '基本信息',
            key: 'base',
            closable: false,
        });
    }
    if (ticketData.detailInfo) {
        tabList.push({
            tab: '详细信息',
            key: 'info',
        });
    }
    if (ticketData.operationRecord) {
        tabList.push({
            tab: '操作记录',
            key: 'record',
        });
    }*/

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const add = (checkedValue: string) => {
        const newPanes = [...tabList];
        const targetIndex = tabList.findIndex((pane) => pane.key === checkedValue);
        if (targetIndex < 0) {
            newPanes.push({ tab: checkedValue, key: checkedValue, closable: true });
            setTabList(newPanes);
            setActiveKey(checkedValue);
        } else {
            message.warning({
                content: 'This service type has already been added.',
                style: {
                    fontSize: 16,
                },
                duration: 5,
            });
        }
    };

    const remove = (targetKey: TargetKey) => {
        confirm({
            title: `Are you sure delete this service type 【${targetKey}】?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
                const newPanes = tabList.filter((pane) => pane.key !== targetKey);
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
            showModal();
        } else {
            remove(targetKey);
        }
    };

    const handleOk = (checkedValue: string) => {
        setIsModalOpen(false);
        add(checkedValue);
    };

    return (
        <PageContainer
            className={`${styles.pageContainer} ${styles.stickyTabs}`}
            title={false}
            content={HeaderInfo(NBasicInfo, LockDate, Principal?.SalesManName)}
            loading={loading}
            header={{
                breadcrumb: {},
            }}
            tabList={tabList}
            onTabChange={handleTabChange}
            tabProps={{
                activeKey: activeKey,
                type: 'editable-card',
                tabBarGutter: 0,
                // tabBarStyle: 'tabBarCard',
                tabBarStyle: { flexGrow: 1 },
                onEdit: onEdit,
            }}
        >
            <ProForm
                className={styles.basicInfoProForm}
                layout="vertical"
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar
                                style={{height: 55}}
                                extra={<Button icon={<LeftOutlined />} onClick={() => history.goBack()}>Back</Button>}>
                                <Button icon={<SaveOutlined />} key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinish={handleFinish}
                initialValues={CJobInfo}
            >
                <ProForm.Group>
                    {activeKey === 'Job' && (
                        <Job
                            CJobInfo={CJobInfo}
                            SalesManList={SalesManList}
                            FinanceDates={FinanceDates}
                        />
                    )}

                    {activeKey === 'Sea (Export)' && (
                        <SeaExport
                            Carrier={Carrier}
                            HouseBill={HouseBill}
                            Port={Port}
                            NBasicInfo={NBasicInfo}
                        />
                    )}

                    {activeKey === 'Sea Import' && (
                        <SeaImport
                            CJobInfo={CJobInfo}
                            SalesManList={SalesManList}
                            FinanceDates={FinanceDates}
                        />
                    )}

                    {activeKey === 'Local Delivery' && (
                        <LocalDelivery
                            CTNPlanList={CTNPlanList}
                            NBasicInfo={NBasicInfo}
                        />
                    )}

                </ProForm.Group>
                <ProForm.Item>

                </ProForm.Item>
            </ProForm>
            <AddServiceModal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </PageContainer>
    )
}
export default BasicInfoForm;