import React, { Component } from 'react';

const Video = (WrappedComponent) => {
    // const colours = ['red', 'pink', 'orange', 'blue', 'green', 'yellow'];
    // const randomColour = colours[Math.floor(Math.random() * 5)];
    // const className = randomColour + '-text';

    return (props) => {
        return (
            // <div className={className}>
            //     <WrappedComponent {...props} />
            // </div>

            <video autoPlay muted loop id="myVideo">
                <source src={require('../img/video.mp4')} type="video/mp4" />
            </video>
        )
    }
}

export default Video;