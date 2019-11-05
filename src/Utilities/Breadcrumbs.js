export function onNavigate(event) {
    event.preventDefault();
    this.props.history.push(event.target.pathname);
}
