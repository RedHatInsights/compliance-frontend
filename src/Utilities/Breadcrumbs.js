import { COMPLIANCE_UI_ROOT } from '../constants';

export function onNavigate(event, history) {
    event.preventDefault();
    const path = event.target.pathname.replace(COMPLIANCE_UI_ROOT, '');
    (history ? history : this.props.history).push(path);
}
