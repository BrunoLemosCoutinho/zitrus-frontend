import React from "react";
import Spinner from 'react-bootstrap/Spinner';


function Loading() {
    return (
        <div className="loading-container">
            <span>Aguarde...</span>
            <Spinner animation="border" />
        </div>
    );
}

export default Loading;
