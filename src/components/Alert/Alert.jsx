import React, { Fragment } from 'react';

import './Alert.css';

const Alert = (props) => {
    const { title, type, mainMessage, secondaryMessage, classAlert="" } = props;
    return (
        <div className={`alert ${type} ${classAlert} mt-3`} role="alert">
            { title && <h4 className="alert-heading">{title}</h4> }
            { mainMessage && <p>{mainMessage}</p> }
            { secondaryMessage &&
                <Fragment>
                    <hr/> <p className="mb-0">{secondaryMessage}</p>
                </Fragment>
            }
        </div>
    )
}

export default Alert;
