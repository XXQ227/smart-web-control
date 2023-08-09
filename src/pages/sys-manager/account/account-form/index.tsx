import React, {Fragment, useEffect, useState} from 'react';
import {FooterToolbar, ProForm, ProFormRadio, ProFormText, ProFormDatePicker, ProCard} from '@ant-design/pro-components'
import {Button, Col, Drawer, Form, message, Row, Space} from 'antd'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import {useModel} from '@@/plugin-model/useModel'
import moment from 'moment'


const AccountTypeList = [{value: 0, label: 'Normal'}, {value: 1, label: 'Replenishment'}];

// const accountCurrArr = ['USD', 'CNY'];
const accountCurrArr = [{currencyName: 'CNY', rateValue: 110}, {currencyName: 'USD', rateValue: 100}];

interface Props {
    AccountPeriod: any,
    isCreate?: boolean,
    index: number,
    handleAddAccount: (record: any, index: number, isCreate: boolean) => void,
}

const AccountDrawerForm: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {AccountPeriod, isCreate, handleAddAccount, index} = props;

    // TODO: 只有未开启的账期可以编辑
    const isEdit = !AccountPeriod.state;

    const {
        addAccountPeriod, editAccountPeriod
    } = useModel('manager.account', (res: any) => ({
        addAccountPeriod: res.addAccountPeriod,
        editAccountPeriod: res.editAccountPeriod,
    }));

    const [open, setOpen] = useState(false);
    const [accountCurrList, setAccountCurrList] = useState<any[]>(AccountPeriod.accountPeriodExrateBOList || accountCurrArr);

    useEffect(() => {
        // if (accountCurrList?.length === 0) {
        //     const currArr: any[] = accountCurrArr.map((row: any) => {
        //         const [currencyName, rateValue] = row;
        //         return {
        //             currencyName,
        //             rateValue: rateValue || 0,
        //         }
        //     })
        //     setAccountCurrList(currArr);
        // } else {
        //     setAccountCurrList(AccountPeriod.accountPeriodExrateBOList || []);
        // }
    }, [AccountPeriod.accountPeriodExrateBOList, accountCurrList?.length]);


    const onChange = (val: any, filedName: string, e: any) => {
        console.log(val, filedName, e);
        if (filedName === 'finaYearMonth') {
            const type: any = form.getFieldValue('type');
            console.log(type);
            const currentDate = new Date(val);
            // TODO: 月份是从 0 开始计数的
            const currentMonth = currentDate.getMonth() + 1;
            console.log(currentDate, currentMonth);
            if (type === 0) {
                const currentYear = currentDate.getFullYear();
                const lastMonth = currentMonth - 1; // 月份是从 0 开始计数的
                form.setFieldsValue({
                    dateStart: currentYear.toString() + '-' + lastMonth.toString().padStart(2, '0') + '-21',
                    // TODO: 6 月为 30 天；12 月为 31 天
                    dateEnd: val + '-20',
                });
            } else {
                form.setFieldsValue({
                    dateStart: val + '-21',
                    // TODO: 6 月为 30 天；12 月为 31 天
                    dateEnd: val + (currentMonth === 6 ? '-30' : '-31'),
                });
            }
        }
    }

    /**
     * @Description: TODO: 修改币种汇率信息
     * @author XXQ
     * @date 2023/8/8
     * @param e
     * @param filedName
     * @param indexCurr
     * @returns
     */
    const handleChangeCurrency = (e: any, filedName: string, indexCurr: number) => {
        const currArr: any[] = accountCurrList.slice(0);
        const target: any = currArr.find((item: any) => item.currencyName === filedName) || {};
        target.rateValue = e?.target?.value;
        currArr.splice(indexCurr, 1, target);
        setAccountCurrList(currArr);
        form.setFieldsValue({accountPeriodExrateBOList: currArr});
    }

    /**
     * @Description: TODO: 保存
     * @author XXQ
     * @date 2023/5/9
     * @param values   页面 form 值
     * @returns
     */
    const handleSave = async (values: any) => {
        form.validateFields()
            .then(async () => {
                if (isCreate) {
                    values.state = 0;   // TODO: 账期状态：未开启
                    values.statusDeferra = 0;   // TODO: 递延状态
                    values.statusPredicted = 0; // TODO: 预估状态
                }
                values.branchId = '0';
                let result: API.Result, params: any = {...AccountPeriod, ...values};
                if (isCreate) {
                    // TODO: 添加
                    result = await addAccountPeriod(values);
                } else {
                    values.dateStart = moment(values.dateStart).format('YYYY-MM-DD');
                    values.dateEnd = moment(values.dateEnd).format('YYYY-MM-DD');
                    params = {...params, ...values};
                    // TODO: 编辑
                    result = await editAccountPeriod(params);
                }
                if (result.success) {
                    if (isCreate) params.id = result.data;
                    handleAddAccount(params, index, !!isCreate);
                    console.log(values, result);
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    console.log(accountCurrList);
    // @ts-ignore
    return (
        <Fragment>
            {isCreate ?
                <Button onClick={() => setOpen(true)} type={'primary'} icon={<PlusOutlined/>}>Add Account Period</Button>
                :
                <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            }
            {!open ? null :
                <Drawer
                    open={open}
                    width={'70%'}
                    destroyOnClose={true}
                    onClose={() => setOpen(false)}
                    title={`Details Of The Finance Month(Exchange Rate Units:100)`}
                >
                    <ProForm
                        form={form}
                        // TODO: 不清空为 null 的数据
                        omitNil={false}
                        // TODO: 不显示 提交按钮
                        submitter={false}
                        // TODO: 自动 focus 表单第一个输入框
                        autoFocusFirstInput={true}
                        // TODO: 设置默认值
                        // initialValues={AccountPeriodVO}
                        // TODO: 提交数据
                        onFinish={handleSave}
                        onFinishFailed={handleSave}
                        request={async ()=> AccountPeriod}
                    >
                        {/** // TODO: Status、Year-Month、Type、Start Date、End Date */}
                        <ProCard title={'Basic Information'} headerBordered>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <ProFormRadio.Group
                                        required
                                        name={'type'}
                                        label={'Type'}
                                        options={AccountTypeList}
                                        rules={[{required: true, message: 'Type is required'}]}
                                    />
                                </Col>
                                <Col span={4}>
                                    <ProFormDatePicker.Month
                                        disabled={!isEdit} placeholder={''} name='finaYearMonth' label='Year-Month'
                                        fieldProps={{
                                            onChange: (e, dataString)=> onChange(dataString, 'finaYearMonth', e)
                                        }}
                                    />
                                </Col>
                                <Col span={4}>
                                    <ProFormDatePicker
                                        disabled={!isEdit} placeholder={''} name='dateStart' label='Start Date' />
                                </Col>
                                <Col span={4}>
                                    <ProFormDatePicker
                                        disabled={!isEdit} placeholder={''} name='dateEnd' label='End Date' />
                                </Col>
                            </Row>
                        </ProCard>
                        <ProCard title={'ExChang Rate (for Business)'} headerBordered>
                            <Row gutter={24}>
                                {accountCurrList?.map((item: any, indexCurr: number) =>
                                    <Col span={4} key={item.currencyName}>
                                        <ProFormText
                                            disabled={!isEdit} placeholder={''}
                                            initialValue={item.rateValue}
                                            name={item.currencyName} label={item.currencyName}
                                            fieldProps={{
                                                onChange: (e: any)=> handleChangeCurrency(e, item.currencyName, indexCurr)
                                            }}
                                        />
                                    </Col>
                                )}
                                {/* // TODO: 用于保存时，获取数据用 */}
                                <Form.Item hidden={true} name={'accountPeriodExrateBOList'} />
                            </Row>
                        </ProCard>
                        <ProCard title={'ExChang Rate (for Statistics)'} headerBordered>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <ProFormText placeholder={''} name='funcCnyRate' />
                                </Col>
                            </Row>
                        </ProCard>
                        <FooterToolbar
                            className={'ant-footer-tool-bar'}
                            extra={<Button onClick={() => setOpen(false)}>Cancel</Button>}
                        >
                            <Space>
                                <Button type='primary' htmlType={'submit'}>Submit</Button>
                            </Space>
                        </FooterToolbar>
                    </ProForm>
                </Drawer>
            }
        </Fragment>
    )
}
export default AccountDrawerForm;