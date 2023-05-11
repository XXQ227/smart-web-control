import React, {useEffect, useState} from 'react';
import {history, useModel} from 'umi';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProForm} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {getUserID} from '@/utils/auths';
import BasicInfo from '../basicInfoForm/basicInfo';
import Cargo from '../basicInfoForm/cargo';
import Payment from '../basicInfoForm/payment';
import {HeaderInfo} from '@/utils/units'
import styles from './style.less';
import {LeftOutlined, SaveOutlined} from "@ant-design/icons";

const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;

const BasicInfoForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    //region TODO: 数据层
    const {
        CommonBasicInfo: {SalesManList, FinanceDates},
        CJobInfo, CJobInfo: {NBasicInfo, NBasicInfo: {Principal}, LockDate, CargoInfo},
        getCJobInfoByID
    } = useModel('job.job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        CommonBasicInfo: res.CommonBasicInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
    //endregion

    /** 实例化Form */
    const [form] = Form.useForm();

    const [jobID, setJobID] = useState(0);
    const [loading, setLoading] = useState(true);
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

    // 初始化（或用于 message 提醒）
    //const intl = useIntl();
    // TODO: 获取列名<Title>
    //const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    const baseParams: any = {form, FormItem};
    const basicInfoParams: any = {CJobInfo, NBasicInfo, SalesManList, FinanceDates};
    const cargoParams: any = {CargoInfo, NBasicInfo};

    // @ts-ignore
    return (
        <PageContainer
            className={styles.pageContainer}
            title={false}
            content={HeaderInfo(NBasicInfo, LockDate, Principal?.SalesManName)}
            loading={loading}
            header={{
                breadcrumb: {},
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
                    <BasicInfo
                        {...baseParams}
                        title={'Basic Information'}
                        {...basicInfoParams}
                    />
                    <Cargo
                        title={'Cargo'}
                        {...cargoParams}
                    />
                    <Payment
                        title={'Payment & Shipping Terms'}
                        NBasicInfo={NBasicInfo}
                    />
                    <Payment
                        title={'Remark'}
                        NBasicInfo={NBasicInfo}
                    />
                </ProForm.Group>
                <ProForm.Item>

                </ProForm.Item>
            </ProForm>
        </PageContainer>
    )
}
export default BasicInfoForm;