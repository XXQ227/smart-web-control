import React from 'react';
import "../../style.less";
import PreBooking from '@/pages/sys-job/job/sea-export/containers/pre-booking'
import CTNLoading from '@/pages/sys-job/job/sea-export/containers/ctn-loading'

interface Props {
    type?: string;
    form: any;
    FormItem: any;
    SeaExportInfo: any;
}


const Containers: React.FC<Props> = (props) => {
    const {type, form, SeaExportInfo} = props;



    return (
        <div className={'seaExportContainers'}>
            <PreBooking
                type={type} form={form}
                preBookingList={SeaExportInfo.preBookingContainersEntityList || []}
            />
            <CTNLoading
                form={form} type={type}
                containerList={SeaExportInfo.preBookingContainersEntityList || []}
            />
        </div>
    )
}
export default Containers;