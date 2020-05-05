import { COMPLIANCE_UI_ROOT } from '@/constants';

export function onNavigate(event, history) {
    event.preventDefault();
    const beta = window.location.pathname.split('/')[1] === 'beta';
    const path = event.target.pathname.replace(COMPLIANCE_UI_ROOT, '');
    (history ? history : this.props.history).push(beta ? `/beta/${path}` : path);
}
