import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionCable from 'actioncable';

const WEBSOCKET_HOST = process.env.NODE_ENV === 'production'
    ? 'ws://localhost:3000/cable'
    : 'ws://localhost:3000/cable';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: ''
        };
        this.cable = ActionCable.createConsumer(WEBSOCKET_HOST);
        this.cable.subscriptions.create(
            {
                channel: 'ProfilesChannel',
                refId: 'xccdf_org.ssgproject.content_profile_standard'
            },
            {
                connected: () => { }, // console.log('ProfileChannel connected'),
                disconnected: () => { }, // console.log('ProfileChannel disconnected'),
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

Profile.propTypes = {
    profileId: PropTypes.number
};

export default Profile;
