import React from 'react';
import 'antd/dist/antd.css'
import firebase from 'firebase';


export default class ImageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
        }
    }

    componentDidMount() {
        const { imageId } = this.props;
        if (imageId) {
            const imageRef = firebase.storage().ref(`/images/${imageId}`);
            imageRef.getDownloadURL().then(res => {
                this.setState({
                    imageSrc: res
                });
            })
        }
    }

    render() {
        const { imageSrc } = this.state;
        return (
            imageSrc && <img
                style={this.props.style}
                src={imageSrc}
            />
        );
    }
}