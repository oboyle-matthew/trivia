import React from 'react';
import 'antd/dist/antd.css'
import firebase from 'firebase';
import { Resizable, ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

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
        const { width, height } = this.props;
        return (
            imageSrc && <ResizableBox width={width} height={height} maxConstraints={[1500, 700]}>
                <img
                    style={{width: '100%', height: '100%'}}
                    src={imageSrc}
                />
            </ResizableBox>
        )
        // return (
        //     imageSrc && <ResizableBox style={this.props.style}>
        //
        //     </ResizableBox>
        // );
    }
}