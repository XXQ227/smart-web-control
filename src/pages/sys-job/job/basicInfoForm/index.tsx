import React, {useEffect, useState} from 'react';
import {history, useModel} from 'umi';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProForm} from '@ant-design/pro-components';
import {Button, message,} from 'antd';
import {getUserID} from '@/utils/auths';
import Job from './job';
import {HeaderInfo} from '@/utils/units'
import styles from './style.less';
import {LeftOutlined, SaveOutlined} from "@ant-design/icons";
import AddServiceModal from '@/components/AddServiceModal';

// const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const BasicInfoForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    //region TODO: 数据层
    const {
        CommonBasicInfo: {SalesManList, FinanceDates},
        CJobInfo, CJobInfo: {NBasicInfo, NBasicInfo: {Principal}, LockDate},
        getCJobInfoByID
    } = useModel('job.job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        CommonBasicInfo: res.CommonBasicInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
    //endregion

    // 动态生成标签页信息
    const initialTabList = [
        {
            tab: 'Job',
            key: 'job',
            closable: false,
            content: <Job
                CJobInfo={CJobInfo}
                SalesManList={SalesManList}
                FinanceDates={FinanceDates}
            />,
        },
    ];

    /** 实例化Form */
    // const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState('job');
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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const add = () => {
        console.log('添加一个新的标签页');
        showModal()
        /*const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...tabList];
        newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
        setTabList(newPanes);
        setActiveKey(newActiveKey);*/
    };

    const remove = (targetKey: TargetKey) => {
        console.log(targetKey)
        /*let newActiveKey = activeKey;
        let lastIndex = -1;
        tabList.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = tabList.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setTabList(newPanes);
        setActiveKey(newActiveKey);*/
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        console.log(targetKey, action)
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <PageContainer
            className={styles.pageContainer}
            title={false}
            content={HeaderInfo(NBasicInfo, LockDate, Principal?.SalesManName)}
            loading={loading}
            header={{
                breadcrumb: {},
            }}
            tabList={tabList}
            onTabChange={handleTabChange}
            tabProps={{
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
                    {activeKey === 'job' && (
                        <Job
                            CJobInfo={CJobInfo}
                            SalesManList={SalesManList}
                            FinanceDates={FinanceDates}
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