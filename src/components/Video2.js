import React from 'react';

const Video2 = (props) => {
    return (
        <video autoPlay muted loop id="myVideo" style={{zIndex: -1}}>
            <source src={require('../img/background2.mp4')} type="video/mp4" />
        </video>
    )
}

export default Video2;