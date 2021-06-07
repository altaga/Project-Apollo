import React, { Component } from "react";
import Reader from "./lib/reader";
import "./App.css"

class Wrapper extends Component {
    constructor(props) {
        super(props)
        this.state = { cameraId: undefined, delay: 500, devices: [], loading: false }
    }

    componentWillMount() {
        const { selectFacingMode } = this.props

        if (navigator && selectFacingMode) {
            this.setState({
                loading: true,
            })

            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    const videoSelect = []
                    devices.forEach((device) => {
                        if (device.kind === 'videoinput') {
                            videoSelect.push(device)
                        }
                    })
                    return videoSelect
                })
                .then((devices) => {
                    this.setState({
                        cameraId: devices[0].deviceId,
                        devices,
                        loading: false,
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    selectCamera = () => {
        return this.state.cameraId
    }

    render() {
        const { selectFacingMode, selectDelay, legacyMode } = this.props
        const { cameraId, devices } = this.state

        const previewStyle = { width: 320 }
        return (
            <div>
                {
                    selectFacingMode && devices.length && (
                        <select
                            className="form-control"
                            onChange={e => {
                                const value = e.target.value
                                this.setState({ cameraId: undefined }, () => {
                                    this.setState({ cameraId: value })
                                })
                            }}
                        >
                            {devices.map((deviceInfo, index) => (
                                <React.Fragment key={deviceInfo.deviceId}><option value={deviceInfo.deviceId}>{deviceInfo.label || `camera ${index}`}</option></React.Fragment>
                            ))}
                        </select>
                    )
                }
                {
                    selectDelay && (
                        <div>
                            <button onClick={() => this.setState({ delay: false })}>
                                Disable Delay
                </button>
                            <input
                                placeholder="Delay in ms"
                                type="number"
                                value={this.state.delay}
                                onChange={e =>
                                    this.setState({ delay: parseInt(e.target.value) })}
                            />
                        </div>
                    )
                }
                <br />
                {(cameraId || !selectFacingMode) && (
                    <div className="center-qr">
                        <div className="center-qr">
                        <div id="cropper">
                            <Reader
                                chooseDeviceId={this.selectCamera}
                                style={previewStyle}
                                onError={this.props.onError}
                                onScan={this.props.onScan}
                                onLoad={this.props.onLoad}
                                onImageLoad={this.props.onImageLoad}
                                ref="reader"
                                legacyMode={legacyMode}
                                maxImageSize={1000}
                                delay={this.state.delay}
                                className="reader-container"
                            />
                        </div>
                        </div>
                    </div>
                )}
                {
                    legacyMode && (
                        <button onClick={() => this.refs.reader.openImageDialog()}>
                            Open Image Dialog
                        </button>
                    )
                }
            </div>
        )
    }
}

export default Wrapper
