import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionCable from 'actioncable';

const WEBSOCKET_HOST = process.env.NODE_ENV === 'production'
    ? 'ws://localhost:3000/cable'
    : 'ws://localhost:3000/cable';

// TODO: this is unused it seems?
class Policy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: ''
        };
        this.cable = ActionCable.createConsumer(WEBSOCKET_HOST);
        this.cable.subscriptions.create(
            {
                channel: 'PoliciesChannel',
                refId: 'xccdf_org.ssgproject.content_profile_standard'
            },
            {
                connected: () => { }, // console.log('PolicyChannel connected'),
                disconnected: () => { }, // console.log('PolicyChannel disconnected'),
                received: data => {
                    // Data broadcasted from the chat channel
                    // console.log('Received data:');
                    //console.log(data);
                    this.setState({ profile: data });
                }
            }
        );
    }

    componentDidMount() {
        // console.log('Sending data..');
        this.cable.send({
            refId: 'xccdf_org.ssgproject.content_profile_standard',
            user: 'ladygaga'
        });
        // console.log('SENT..');
    }

    onReceive() {
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

Policy.propTypes = {
    profileId: PropTypes.number
};

export default Policy;
