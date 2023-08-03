import React, {useEffect, useState} from 'react';
import Basic from "./basic";
import Ports from "./port";
import Remark from "@/pages/sys-job/job/sea-export/remark";
import Containers from "@/pages/sys-job/job/sea-export/containers";
import {Button, Form, message, Spin} from 'antd'
import '../style.less'
import type {RouteChildrenProps} from 'react-router'
import {FooterToolbar, ProForm} from '@ant-design/pro-components'
import {LeftOutlined, SaveOutlined} from '@ant-design/icons'
import {history} from '@@/core/history'
import {getFormErrorMsg} from '@/utils/units'
import {useModel} from '@@/plugin-model/useModel'
import {useParams} from 'umi'

const FormItem = Form.Item;

const SeaImport: React.FC<RouteChildrenProps> = (props) => {
    const [form] = Form.useForm();
    const params: any = useParams();
    const id = atob(params.id);
    const {} = props;

    useEffect(() => {

    }, [])
    //endregion

    const {
        querySeaImportInfo
    } = useModel('job.job', (res: any) => ({
        querySeaImportInfo: res.querySeaImportInfo,
    }));

    const [loading, setLoading] = useState(false);
    const [SeaExportInfo, setSeaExportInfo] = useState<any>({});


    /**
     * @Description: TODO: 获取海运出口信息
     * @author XXQ
     * @date 2023/7/26
     * @param paramsVal     查询参数
     * @returns
     */
    async function handleQuerySeaImportInfo(paramsVal: any) {
        // alert('loading Job Info !!!');
        // setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (paramsVal.id !== '0') {
            result = await querySeaImportInfo(paramsVal);
        } else {
            result = {success: true, data: {}};
        }

        // setLoading(false);
        setSeaExportInfo(result || {});
        return result.data;
    }

    const handleFinish = async (values: Record<string, any>) => {
        try {
            console.log(values)
            // @ts-ignore
            for (const item: string in values) {
                if (item.indexOf('_table_') > -1) {
                    delete values[item];
                }
            }
            // await fakeSubmitForm(values);
            message.success('提交成功');
        } catch {
            // console.log
        }
    };

    const baseForm = {form, FormItem};

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                omitNil={false}
                layout="vertical"
                name={'formJobInfo'}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar
                                style={{height: 55}}
                                extra={<Button icon={<LeftOutlined/>} onClick={() => history.goBack()}>Back</Button>}>
                                <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'}
                                        htmlType={'submit'}>Save</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                initialValues={SeaExportInfo}
                // @ts-ignore
                request={async () => handleQuerySeaImportInfo({id})}
            >
                <Basic title={'Basic'}/>

                {/* 港口信息 */}
                <Ports {...baseForm} title={'Port'}/>

                <Containers {...baseForm} type={'import'}/>

                <Remark type={'import'} title={'Remark'}/>
            </ProForm>
        </Spin>
    )
}
export default SeaImport;