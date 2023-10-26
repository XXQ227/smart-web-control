import React from 'react';
import {useModel} from 'umi';
import ShippingTable from '@/pages/sys-system/shipping/shipping-table'

interface Props {}
const ShippingVoyageIndex: React.FC<Props> = () => {

    const {
        queryVoyage, deleteVoyage, operateVoyage
    } = useModel('system.shipping', (res: any) => ({
        queryVoyage: res.queryVoyage,
        deleteVoyage: res.deleteVoyage,
        operateVoyage: res.operateVoyage,
    }));

    return (
        <ShippingTable
            type={'Voyage'}
            queryAPI={queryVoyage}
            deleteAPI={deleteVoyage}
            operateAPI={operateVoyage}
        />
    )
}
export default ShippingVoyageIndex;