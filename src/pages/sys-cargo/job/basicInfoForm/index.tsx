import React, {useEffect, useState} from 'react';
import {history, useModel} from 'umi';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {getUserID} from '@/utils/auths';
import BasicInfo from '@/pages/sys-cargo/job/basicInfoForm/basicInfo';
import type {FormInstance} from 'antd/es/form';


const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;

const BasicInfoForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    /** 实例化Form */
    const [form] = Form.useForm();
    const formRef = React.useRef<FormInstance>(null);

    //region TODO: 数据层
    const {
        CJobInfo: {NBasicInfo, NBasicInfo: {Principal}}, getCJobInfoByID
    } = useModel('job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
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
                .then((res: API.NJobDetailDto) => {
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
    const handleSave = () => {
        console.log(1111);
        form.validateFields()
            .then((value) => {
                console.log(value);
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
                /** 错误信息 */
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any) => x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    }
    /**
     * @Description: TODO: 提交失败。弹出错误提示
     * @author XXQ
     * @date 2023/4/14
     * @returns
     */
    const onFinishFailed = () => {
        console.log(22222);
        form.validateFields()
            .catch((errorInfo) => {
                /** 错误信息 */
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any)=> x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    };


    return (
        <PageContainer
            loading={loading}
            header={{
                // title: props?.title,
                breadcrumb: {},
            }}
        >
            <Form
                form={form}
                ref={formRef}
                autoComplete={'off'}
                onFinish={handleSave}
                onFinishFailed={onFinishFailed}
            >
                {/* 委托信息 */}
                <BasicInfo
                    title={'委托信息'} FormItem={FormItem}
                    NBasicInfo={NBasicInfo} Principal={Principal}
                />

                <FooterToolbar extra={<Button onClick={() => history.goBack()}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </Form>
        </PageContainer>
    )
}
export default BasicInfoForm;