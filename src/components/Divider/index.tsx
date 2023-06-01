/** 自定义 Divider 组件 */
import React from 'react'
import {Divider} from 'antd'

interface Props {
    hidden?: boolean,
    prop?: any,
}
const DividerCustomize: React.FC<Props> = (props) => {

    return (
        props.hidden ? null : <Divider type={props?.prop?.type || 'vertical'} {...props?.prop}/>
    )
}

export default DividerCustomize