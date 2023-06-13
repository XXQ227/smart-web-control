import React from 'react';
import {useModel} from 'umi';
import ShippingTable from '@/pages/sys-manager/shipping/shipping-table'


interface Props {}
const ShippingLineIndex: React.FC<Props> = () => {

    const {
        queryLine, deleteLine, operateLine, addLine, editLine
    } = useModel('manager.shipping', (res: any) => ({
        queryLine: res.queryLine,
        deleteLine: res.deleteLine,
        operateLine: res.operateLine,
        addLine: res.addLine,
        editLine: res.editLine,
    }));

    return (
        <ShippingTable
            type={'Line'}
            addAPI={addLine}
            editAPI={editLine}
            queryAPI={queryLine}
            deleteAPI={deleteLine}
            operateAPI={operateLine}
        />
    )
}
export default ShippingLineIndex;