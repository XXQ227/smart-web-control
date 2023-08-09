import React, {useRef} from 'react'
import {Fragment} from 'react'
import {Button} from 'antd'
import {UploadOutlined} from '@ant-design/icons'


interface Props {
    style?: any;
    hidden?: boolean;
    label: string;
    onChange: (files: any) => void;
}

const ParseExcel: React.FC<Props> = (props) => {
    const {} = props;
    let fileInput: any = useRef();
    // let fileInput: any = React.createRef();

    /**
     * @Description: TODO: 选择的文件
     * @author XXQ
     * @date 2023/8/3
     * @returns
     */
    function handleFileChange(e: any) {
        props.onChange(e?.target?.files[0]);
        if (fileInput) {
            fileInput.value = null;
        }
    }

    function handleClick() {
        fileInput.click();
    }


    return (
        <Fragment>
            <input
                onChange={handleFileChange}
                accept=".xlsx,.xsl" hidden type="file"
                ref={instance => fileInput = instance}
            />
            <Button
                style={props.style}
                hidden={!!props.hidden}
                onClick={handleClick}
                icon={<UploadOutlined />}
            >
                {props.label}
            </Button>
        </Fragment>
    )
}
export default ParseExcel;