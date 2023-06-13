import React from 'react';
import {useModel} from 'umi';
import ShippingTable from '@/pages/sys-manager/shipping/shipping-table'

interface Props {}
const ShippingVoyageIndex: React.FC<Props> = () => {

    const {
        queryVoyage, deleteVoyage, operateVoyage, addVoyage, editVoyage
    } = useModel('manager.shipping', (res: any) => ({
        queryVoyage: res.queryVoyage,
        deleteVoyage: res.deleteVoyage,
        operateVoyage: res.operateVoyage,
        addVoyage: res.addVoyage,
        editVoyage: res.editVoyage,
    }));

    return (
        <ShippingTable
            type={'Voyage'}
            addAPI={addVoyage}
            editAPI={editVoyage}
            queryAPI={queryVoyage}
            deleteAPI={deleteVoyage}
            operateAPI={operateVoyage}
        />
    )
}
export default ShippingVoyageIndex;