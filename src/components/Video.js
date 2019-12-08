import React from 'react';

const Video = (props) => {
    return (
        <video autoPlay muted loop id="myVideo" style={{zIndex: -1}}>
            <source src={require('../img/video.mp4')} type="video/mp4" />
        </video>
    )
}

export default Video;