import React from 'react'

class SubmitButton extends React.Component {

    render() {
        return(
            <div className={this.props.classes}>
                <button
                    className='btn'
                    type={this.props.type}
                    disabled={this.props.disabled}
                    onClick={this.props.onClick}>
                    {this.props.text}
                </button>
            </div>
        )
    }
}

export default SubmitButton;