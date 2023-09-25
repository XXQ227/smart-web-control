import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Input, message, Upload} from 'antd';
import ProForm, {
    ProFormDependency,
    ProFormFieldSet,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-form';

import styles from './BaseView.less';
import {USER_INFO, initUserInfo} from '@/utils/auths'
import city from '../geographic/city.json';         // 城市信息
import province from '../geographic/province.json'; // 省份信息

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
    if (!value[0]) {
        callback('Please input your area code!');
    }
    if (!value[1]) {
        callback('Please input your phone number!');
    }
    callback();
};
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({avatar}: { avatar: string }) => (
    <>
        <div className={styles.avatar_title}>头像</div>
        <div className={styles.avatar}>
            <img src={avatar} alt="avatar"/>
        </div>
        <Upload showUploadList={false}>
            <div className={styles.button_view}>
                <Button>
                    <UploadOutlined/>
                    更换头像
                </Button>
            </div>
        </Upload>
    </>
);

const BaseView: React.FC = () => {
    const userInfo = USER_INFO() || initUserInfo;     // 用户基本信息

    const getAvatarURL = () => {
        if (userInfo) {
            if (userInfo.avatar) {
                return userInfo.avatar;
            }
            return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
        }
        return '';
    };

  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };

  return (
      <div className={styles.baseView}>
          <div className={styles.left}>
              <ProForm
                  layout="vertical"
                  onFinish={handleFinish}
                  submitter={{
                      searchConfig: {
                          submitText: '更新基本信息',
                      },
                      render: (_, dom) => dom[1],
                  }}
                  initialValues={{
                      ...userInfo,
                      phone: userInfo?.phone?.split('-') || '',
                  }}
              >
                  <ProFormText
                      width="md"
                      name="Email"
                      label="邮箱"
                      rules={[
                          {
                              required: true,
                              message: '请输入您的邮箱!',
                          },
                      ]}
                  />
                  <ProFormText
                      width="md"
                      name="DisplayName"
                      label="昵称"
                      rules={[
                          {
                              required: true,
                              message: '请输入您的昵称!',
                          },
                      ]}
                  />
                  <ProFormTextArea
                      name="profile"
                      label="个人简介"
                      rules={[
                          {
                              required: true,
                              message: '请输入个人简介!',
                          },
                      ]}
                      placeholder="个人简介"
                  />
                  <ProFormFieldSet name="list" label="所在省市" className={'user-info-address-city'}>
                      <ProFormSelect
                          width="sm"
                          name="country"
                          label="国家/地区"
                          rules={[
                              {
                                  required: true,
                                  message: '请输入您的国家或地区!',
                              },
                          ]}
                          options={[
                              {
                                  label: '中国',
                                  value: 'China',
                              },
                          ]}
                      />
                      <ProForm.Group title="">
                          <ProFormSelect
                              rules={[
                                  {
                                      required: true,
                                      message: '请输入您的所在省!',
                                  },
                              ]}
                              width="sm"
                              fieldProps={{
                                  labelInValue: true,
                              }}
                              name="province"
                              className={styles.item}
                              request={async () => {
                                  return province.map((item: any) => {
                                      return {
                                          label: item.name,
                                          value: item.id,
                                      };
                                  });
                              }}
                          />
                          <ProFormDependency name={['province']}>
                              {({province}) => {
                                  return (
                                      <ProFormSelect
                                          params={{
                                              key: province?.value,
                                          }}
                                          name="city"
                                          width="sm"
                                          rules={[
                                              {
                                                  required: true,
                                                  message: '请输入您的所在城市!',
                                              },
                                          ]}
                                          disabled={!province}
                                          className={styles.item}
                                          request={async () => {
                                              if (province?.key) {
                                                  return city[province?.key].map((item: any) => {
                                                      return {
                                                          label: item.name,
                                                          value: item.id,
                                                      };
                                                  });
                                              } else {
                                                  return [];
                                              }
                                          }}
                                      />
                                  );
                              }}
                          </ProFormDependency>
                      </ProForm.Group>
                  </ProFormFieldSet>
                  <ProFormSelect
                      width="sm"
                      name="country"
                      label="国家/地区"
                      rules={[
                          {
                              required: true,
                              message: '请输入您的国家或地区!',
                          },
                      ]}
                      options={[
                          {
                              label: '中国',
                              value: 'China',
                          },
                      ]}
                  />

                  <ProForm.Group title="所在省市" size={8}>
                      <ProFormSelect
                          rules={[
                              {
                                  required: true,
                                  message: '请输入您的所在省!',
                              },
                          ]}
                          width="sm"
                          fieldProps={{
                              labelInValue: true,
                          }}
                          name="province"
                          className={styles.item}
                          request={async () => {
                              return province.map((item: any) => {
                                  return {
                                      label: item.name,
                                      value: item.id,
                                  };
                              });
                          }}
                      />
                      <ProFormDependency name={['province']}>
                          {({province}) => {
                              return (
                                  <ProFormSelect
                                      params={{
                                          key: province?.value,
                                      }}
                                      name="city"
                                      width="sm"
                                      rules={[
                                          {
                                              required: true,
                                              message: '请输入您的所在城市!',
                                          },
                                      ]}
                                      disabled={!province}
                                      className={styles.item}
                                      request={async () => {
                                          if (province?.key) {
                                              return city[province?.key].map((item: any) => {
                                                  return {
                                                      label: item.name,
                                                      value: item.id,
                                                  };
                                              });
                                          } else {
                                              return [];
                                          }
                                      }}
                                  />
                              );
                          }}
                      </ProFormDependency>
                  </ProForm.Group>
                  <ProFormText
                      width="md"
                      name="address"
                      label="街道地址"
                      rules={[
                          {
                              required: true,
                              message: '请输入您的街道地址!',
                          },
                      ]}
                  />
                  <ProFormText
                      name="Phone"
                      label="联系电话"
                      rules={[
                          {
                              required: true,
                              message: '请输入您的联系电话!',
                          },
                          {validator: validatorPhone},
                      ]}
                  >
                      <Input className={styles.area_code}/>
                      <Input className={styles.phone_number}/>
                  </ProFormText>
                  <div style={{width: 600, wordSpacing: 'initial'}}>
                      {JSON.stringify(userInfo)}
                  </div>
              </ProForm>
          </div>
          <div className={styles.right}>
              <AvatarView avatar={getAvatarURL()}/>
          </div>
      </div>
  );
};

export default BaseView;
