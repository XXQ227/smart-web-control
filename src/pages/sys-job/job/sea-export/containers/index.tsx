import React from 'react';
import "../../style.less";
import PreBooking from '@/pages/sys-job/job/sea-export/containers/pre-booking'
import CTNLoading from '@/pages/sys-job/job/sea-export/containers/ctn-loading'

interface Props {
    type?: string;
    form: any;
    FormItem: any;
    jobServiceInfo: any;
}


const Containers: React.FC<Props> = (props) => {
    const {type, form, jobServiceInfo} = props;

    return (
        <div className={'seaExportContainers'}>
            <PreBooking
                type={type} form={form}
                preBookingList={jobServiceInfo.preBookingContainersEntityList || []}
            />
            <CTNLoading
                form={form} type={type}
                containerList={jobServiceInfo.containersLoadingDetailEntityList || []}
            />
        </div>
    )
}
export default Containers;