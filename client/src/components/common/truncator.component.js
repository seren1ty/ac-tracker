import React from 'react';
import ReactTooltip from 'react-tooltip';

const Truncator = props => {

    const needsTruncating = () => {
        return props.value.length > props.max;
    }

    const truncate = () => {
        return props.value.substring(0, props.max) + '..';
    }

    return (
        <span>
        {
            needsTruncating() ?
            (
                <span>
                    <span data-tip={props.value} data-for={props.id}>
                        {truncate()}
                    </span>
                    <ReactTooltip id={props.id} place="right" effect="solid"/>
                </span>
            ) : (
                <span>{props.value}</span>
            )
        }
        </span>
    )
}

export default Truncator;