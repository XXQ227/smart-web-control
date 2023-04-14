
export function setJobEditPage(state: string) {
    sessionStorage.setItem('job-edit-page', state);
}
export function getJobEditPage() {
    return sessionStorage.getItem('job-edit-page');
}
