import { COMPLIANCE_UI_ROOT } from '../constants';

export function onNavigate(event) {
    event.preventDefault();
    const path = event.target.pathname.replace(COMPLIANCE_UI_ROOT, '');
    this.props.history.push(path);
}
