import './App.css';
import IotReciever from "./components/iot-reciever-aws"
import MyMap from "./components/maps"
import React, { Component } from 'react';
import ReactDOM from "react-dom"
import { Button, Card, CardBody, CardFooter, CardImg, CardSubtitle, CardText, CardTitle, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import styles from "./components/style-module"
import { isMobile } from "react-device-detect"
import QrReader from 'react-qr-reader'
import Wrapper from "./story";
import logoApollo from "./logo.png"
import name from "./name.png"
import LineGraph from "./components/line"

var unirest = require('unirest');

const bs58 = require('bs58')

function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function avg(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    return round2(total / array.length);
}

class MyApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coord: [],
            coords: [],
            colors: [],
            kind: [],
            mainDB: [],
            temperature: "Pending",
            humidity: "Pending",
            pressure: "Pending",
            infoDisplay: "none",
            spaceQR: "none",
            spaceQR2: "none",
            delay: 200,
            modal: false,
            buttonStateCheck: false,
            buttonStateAdd: true,
            buttonStateLogin: false,
            iot: "none",
            email: "",
            password: "",
            loginLabel: "Login",
            address: "",
            coord_list: [],
            mapAll: [],
            objList: [],
            medData: [],
            series1: [],
            series2: [],
            series3: [],
            cameraId: undefined,
            devices: [],
            loading: false,
            traceState: 0,
            modalOK: false
        }
        this.callBackIoT = this.callBackIoT.bind(this);
        this.checkDisplay = this.checkDisplay.bind(this);
        this.checkDisplay2 = this.checkDisplay2.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.handleScan2 = this.handleScan2.bind(this);
        this.displayQR = this.displayQR.bind(this);
        this.displayQR2 = this.displayQR2.bind(this);
        this.modalToogle = this.modalToogle.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.addTrace = this.addTrace.bind(this);
        this.moveMap = this.moveMap.bind(this);
        this.camSelect = this.camSelect.bind(this);
    }

    callBackIoT = (data) => {
        const temp = JSON.parse(data[1])
        if (temp["signal"] === 1) {
            let temp2 = this.state.series1
            temp2.push(temp["payload"])
            if (temp2.length > 10) {
                temp2.shift()
            }
            this.setState({
                series1: temp2
            })
        }
        else if (temp["signal"] === 2) {
            let temp2 = this.state.series2
            temp2.push(temp["payload"])
            if (temp2.length > 10) {
                temp2.shift()
            }
            this.setState({
                series2: temp2
            })
        }
        else if (temp["signal"] === 3) {
            let temp2 = this.state.series3
            temp2.push(temp["payload"])
            if (temp2.length > 10) {
                temp2.shift()
            }
            this.setState({
                series3: temp2
            })
        }
    }

    async componentDidMount() {
        let _this = this
        await unirest('GET', 'https://rrplz186pb.execute-api.us-east-1.amazonaws.com/get-db')
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    mainDB: JSON.parse(res.raw_body)
                })
            });
    }


    handleError2(err) {
        // Nothing
    }

    handleScan2(data) {

        if (data !== null && data !== undefined) {
            this.setState({
                spaceQR2: "none"
            })
            ReactDOM.unmountComponentAtNode(document.getElementById("qrplace2"))
            this.checkDisplay2(data)
        }
    }

    async checkDisplay2(addr) {
        let _this = this
        await unirest('GET', 'https://rrplz186pb.execute-api.us-east-1.amazonaws.com/getData')
            .headers({
                'hash': addr
            })
            .end(function (res) {
                if (res.error) console.log(res.error);
                let temp = JSON.parse(res.raw_body).reverse()
                console.log(temp)
                let lat = 0
                let lon = 0
                let coodr_array = []
                let coodr_color_array = []
                let coodr_kind_array = []
                let obj_array = []
                for (let i = 0; i < temp.length; i++) {
                    let flag = false
                    for (let j = 0; j < _this.state.mainDB.length; j++) {
                        if (temp[i] === _this.state.mainDB[j]["Id"]) {
                            obj_array.push(_this.state.mainDB[j])
                            flag = true
                            break
                        }
                    }
                    if (!flag) {
                        continue
                    }
                    temp[i] = bs58.decode(temp[i]).toString('hex')
                    lat = parseInt(temp[i].substring(0, 2), 16)
                    let late = parseInt(temp[i].substring(2, 4), 16)
                    if ((late >> 7) === 1) {
                        lat = (-1) * lat
                        // 2's complement Hex to decimal
                        late = ~(parseInt(temp[i].substring(2, 4), 16)) + 1
                        late = late + 256
                        //
                        lat = lat - (late / 100)
                    }
                    else {
                        lat = lat + (late / 100)
                    }
                    lon = parseInt(temp[i].substring(4, 6), 16)
                    let lone = parseInt(temp[i].substring(6, 8), 16)
                    if ((lone >> 7) === 1) {
                        lon = (-1) * lon
                        // 2's complement Hex to decimal
                        lone = lone = ~(parseInt(temp[i].substring(6, 8), 16)) + 1 // 2's complement Hex to negative decimal
                        lone = lone + 256
                        // 
                        lon = lon - (lone / 100)
                    }
                    else {
                        lon = lon + (lone / 100)
                    }
                    coodr_array.push([lon, lat])
                    coodr_color_array.push(styles.Solana)
                    coodr_kind_array.push(0)
                }
                let maps = <MyMap
                    coord={[lon, lat]}
                    coords={coodr_array}
                    colors={coodr_color_array}
                    kind={coodr_kind_array}
                    zoom={14}
                />

                _this.setState({
                    buttonStateCheck: false,
                    buttonStateAdd: false,
                    coord_list: coodr_array,
                    address: addr,
                    mapAll: [[lon, lat], coodr_array, coodr_color_array, coodr_kind_array],
                    objList: obj_array,
                })
                ReactDOM.unmountComponentAtNode(document.getElementById("map-zone"))
                let __this = _this
                unirest('GET', 'https://rrplz186pb.execute-api.us-east-1.amazonaws.com/get-medicine')
                    .headers({
                        'address': addr
                    })
                    .end(function (res) {
                        if (res.error) throw new Error(res.error);
                        ReactDOM.render(maps, document.getElementById("map-zone"))
                        __this.setState({
                            iot: "inline",
                            infoDisplay: "inline",
                            medData: JSON.parse(res.raw_body)[0]
                        })
                    });
            });
    }

    handleScan(data) {
        if (data !== null && data !== undefined) {
            this.setState({
                spaceQR: "none"
            })
            ReactDOM.unmountComponentAtNode(document.getElementById("qrplace"))
            this.checkDisplay(data)
        }
    }

    handleError(err) {
        // Nothing
    }

    async checkDisplay(addr) {
        let _this = this
        await unirest('GET', 'https://rrplz186pb.execute-api.us-east-1.amazonaws.com/getData')
            .headers({
                'hash': addr
            })
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                let temp = JSON.parse(res.raw_body).reverse()
                console.log(temp)
                let lat = 0
                let lon = 0
                let coodr_array = []
                let coodr_color_array = []
                let coodr_kind_array = []
                let obj_array = []
                for (let i = 0; i < temp.length; i++) {
                    let flag = false
                    for (let j = 0; j < _this.state.mainDB.length; j++) {
                        if (temp[i] === _this.state.mainDB[j]["Id"]) {
                            obj_array.push(_this.state.mainDB[j])
                            flag = true
                            break
                        }
                    }
                    if (!flag) {
                        continue
                    }
                    temp[i] = bs58.decode(temp[i]).toString('hex')
                    lat = parseInt(temp[i].substring(0, 2), 16)
                    let late = parseInt(temp[i].substring(2, 4), 16)
                    if ((late >> 7) === 1) {
                        lat = (-1) * lat
                        // 2's complement Hex to decimal
                        late = ~(parseInt(temp[i].substring(2, 4), 16)) + 1
                        late = late + 256
                        //
                        lat = lat - (late / 100)
                    }
                    else {
                        lat = lat + (late / 100)
                    }
                    lon = parseInt(temp[i].substring(4, 6), 16)
                    let lone = parseInt(temp[i].substring(6, 8), 16)
                    if ((lone >> 7) === 1) {
                        lon = (-1) * lon
                        // 2's complement Hex to decimal
                        lone = lone = ~(parseInt(temp[i].substring(6, 8), 16)) + 1 // 2's complement Hex to negative decimal
                        lone = lone + 256
                        // 
                        lon = lon - (lone / 100)
                    }
                    else {
                        lon = lon + (lone / 100)
                    }
                    coodr_array.push([lon, lat])
                    coodr_color_array.push(styles.Solana)
                    coodr_kind_array.push(0)
                }
                let maps = <MyMap
                    coord={[lon, lat]}
                    coords={coodr_array}
                    colors={coodr_color_array}
                    kind={coodr_kind_array}
                    zoom={14}
                />
                console.log(coodr_array)
                if (_this.state.buttonStateLogin) {
                    _this.setState({
                        buttonStateCheck: false,
                        buttonStateAdd: false,
                        coord_list: coodr_array,
                        address: addr,
                        mapAll: [[lon, lat], coodr_array, coodr_color_array, coodr_kind_array],
                        objList: obj_array
                    })
                }
                else {
                    _this.setState({
                        buttonStateCheck: false,
                        coord_list: coodr_array,
                        address: addr,
                        mapAll: [[lon, lat], coodr_array, coodr_color_array, coodr_kind_array],
                        objList: obj_array
                    })
                }
                ReactDOM.unmountComponentAtNode(document.getElementById("map-zone"))
                let __this = _this
                unirest('GET', 'https://rrplz186pb.execute-api.us-east-1.amazonaws.com/get-medicine')
                    .headers({
                        'address': addr
                    })
                    .end(function (res) {
                        if (res.error) throw new Error(res.error);
                        __this.setState({
                            infoDisplay: "inline",
                            medData: JSON.parse(res.raw_body)[0]
                        })
                        ReactDOM.render(maps, document.getElementById("map-zone"))
                    });
            });
    }

    displayQR() {
        let previewStyle = {
            height: "80%",
            width: "80%"
        }
        let comp = ""
        if (isMobile) {
            comp = <Wrapper
                selectFacingMode
                delay={this.state.delay}
                onError={this.handleError}
                onScan={this.handleScan}
            />
        }
        else {
            comp = <QrReader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.handleScan}
            />
        }
        this.setState({
            infoDisplay: "none",
            buttonStateCheck: true,
            buttonStateAdd: true,
            spaceQR: "inline",
            iot: "none"
        })
        ReactDOM.unmountComponentAtNode(document.getElementById("map-zone"))
        ReactDOM.render(comp, document.getElementById("qrplace"))
    }

    displayQR2() {
        if (this.state.traceState === 0) {
            let previewStyle = {
                height: "80%",
                width: "80%"
            }
            let comp = ""
            if (isMobile) {
                comp = <Wrapper
                    selectFacingMode
                    delay={this.state.delay}
                    onError={this.handleError2}
                    onScan={this.handleScan2}
                />
            }
            else {
                comp = <QrReader
                    delay={this.state.delay}
                    style={previewStyle}
                    onError={this.handleError2}
                    onScan={this.handleScan2}
                />
            }
            this.setState({
                infoDisplay: "none",
                buttonStateCheck: true,
                buttonStateAdd: true,
                spaceQR2: "inline",
                iot: "none",
                traceState: 1
            })
            ReactDOM.unmountComponentAtNode(document.getElementById("map-zone"))
            ReactDOM.render(comp, document.getElementById("qrplace2"))
        }
        else if (this.state.traceState === 1) {
            window.scrollTo(0, 0)
            this.setState({
                infoDisplay: "none",
                modalOK: true,
                iot: "none",
                traceState: 0
            })
        }
    }

    modalToogle(state) {
        this.setState({
            modal: state
        })
    }

    moveMap(loc) {
        let maps = <MyMap
            coord={loc}
            coords={this.state.mapAll[1]}
            colors={this.state.mapAll[2]}
            kind={this.state.mapAll[3]}
            zoom={14}
        />
        this.setState({
            mapAll: [loc, this.state.mapAll[1], this.state.mapAll[2], this.state.mapAll[3]]
        })
        ReactDOM.unmountComponentAtNode(document.getElementById("map-zone"))
        ReactDOM.render(maps, document.getElementById("map-zone"))
    }

    onChangeForm(event) {
        if (event.target.id === "exampleEmail") {
            this.setState({
                email: event.target.value
            })
        }
        else if (event.target.id === "examplePassword") {
            this.setState({
                password: event.target.value
            })
        }
    }

    onSubmitForm() {
        if (this.state.email === "apolloprojectchain@gmail.com" && this.state.password === "toor") {
            this.modalToogle(false)
            this.setState({
                buttonStateLogin: true,
                buttonStateAdd: false,
                loginLabel: "Logged"
            })
        }
    }

    addTrace() {
        console.log("add")
    }

    camSelect(event) {
        let temp = "environment"
        if (event.target.value === "frontal") {
            temp = "user"
        }
        this.setState({
            cameraId: temp
        })
    }

    render() {
        if (isMobile) {
            return (
                <div className="App">
                    <IotReciever sub_topics={["/projectApollo/Sensor0001/data"]} callback={this.callBackIoT}></IotReciever>
                    <br />
                    <Modal style={{ backgroundColor: "#282d2b" }} isOpen={this.state.modalOK}>
                        <ModalBody style={{ backgroundColor: "#282d2b", color: "white", fontSize: "1.5rem" }}>
                            Trace added successfully
                        </ModalBody>
                        <ModalFooter style={{ backgroundColor: "#282d2b" }}>
                            <div style={{ textAlign: "center" }}>
                                <Button style={{ fontSize: "1.5rem", backgroundColor: "#1dd79b", color: "black" }} onClick={() => this.setState({ modalOK: false })}>OK</Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                    <Modal style={{ backgroundColor: "#282d2b" }} isOpen={this.state.modal}>
                        <ModalHeader style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>Login</ModalHeader>
                        <ModalBody style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>
                            <Form style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
                                    <Input onChange={this.onChangeForm} type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="examplePassword">Password</Label>
                                    <Input onChange={this.onChangeForm} type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter style={{ backgroundColor: "#282d2b" }}>
                            <Button style={{ backgroundColor: "#1dd79b", color: "black" }} onClick={this.onSubmitForm}>Login</Button>{' '}
                            <Button style={{ color: "black" }} onClick={() => this.modalToogle(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <Row md="2">
                        <Col xs="8">
                            <img alt="logo" src={logoApollo} style={{ width: "25%" }} />
                            {'\u00A0'}
                            <img alt="logo2" src={name} style={{ width: "60%" }} />
                        </Col>
                        <Col xs="4" style={{ paddingTop: "12px" }}>
                            <Button style={{ fontSize: "1.3rem", backgroundColor: "#1dd79b", color: "#1b4e3f" }} onClick={() => this.modalToogle(true)} disabled={this.state.buttonStateLogin}>
                                {this.state.loginLabel}
                            </Button>
                        </Col>
                    </Row>
                    <hr />
                    <Row md="1">
                        <Col xs="12">
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <div>
                                        <Button style={{
                                            fontSize: "1.3rem",
                                            backgroundColor: "#1dd79b", color: "#1b4e3f"
                                        }} onClick={() => this.displayQR()} disabled={this.state.buttonStateCheck}>
                                            Check Product!
                  </Button>
                                    </div>
                                    <br style={{ display: this.state.spaceQR }} />
                                    <div id="qrplace" />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12">
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <div>
                                        <Button style={{
                                            fontSize: "1.3rem", backgroundColor: "#1dd79b", color: "#1b4e3f"
                                        }} onClick={() => this.displayQR2()} disabled={this.state.buttonStateAdd}>
                                            Add Trace (only with Login)
                  </Button>
                                    </div>
                                    <br style={{ display: this.state.spaceQR2 }} />
                                    <div id="qrplace2" />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <hr />
                    <div style={{ display: this.state.infoDisplay }}>
                        <Row md="1">
                            <Col xs="12">
                                <div id="map-zone" />
                            </Col>
                            <br />
                            <Col xs="12">
                                <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                    <ol style={{ textAlign: "left" }}>
                                        {
                                            this.state.coord_list.map((number, index) => <li style={{ color: "blue" }} key={Math.random()} onClick={() => this.moveMap(number)}><a href="#">{number[1]}{", "}{number[0]}{" | "}{this.state.objList[index]["Place"]}</a></li>)
                                        }
                                    </ol>
                                </Card>
                            </Col>
                            <Col xs="12" style={{ display: this.state.iot }}>
                                <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                <hr />
                                <div style={{ fontSize: "2rem" }}>{"Temperature:"}</div>
                                    <LineGraph data={this.state.series1} />
                                    <div style={{ fontSize: "2rem" }}>{round2(avg(this.state.series1) * 1.8 + 32)}{" °F"}</div>
                                    <hr />
                                    <div style={{ fontSize: "2rem" }}>{"Relative Humidity:"}</div>
                                    <LineGraph data={this.state.series2} />
                                    <div style={{ fontSize: "2rem" }}>{avg(this.state.series2)}{" %"}</div>
                                    <hr />
                                    <div style={{ fontSize: "2rem" }}>{"Air Quality:"}</div>
                                    <LineGraph data={this.state.series3} />
                                    <div style={{ fontSize: "2rem" }}>{avg(this.state.series3)}{""}</div>
                                </Card>
                            </Col>
                            <hr />
                            <Col xs="12">
                                <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                    Solana Explorer link:
                <a href={"https://explorer.solana.com/address/" + this.state.address + "?cluster=devnet"} rel="noreferrer" target="_blank">{this.state.address}</a>
                                    <hr />
                                    <div style={{ textAlign: "center" }}>
                                        <CardImg top style={{ width: "90%" }} src={this.state.medData["Image"]} alt="Card image cap" />
                                    </div>
                                    <CardBody>
                                        <CardTitle tag="h4">{this.state.medData["Laboratory"] + " : " + this.state.medData["Name"]}</CardTitle>
                                        <CardSubtitle tag="h5" className="mb-2 text-muted">Content: {this.state.medData["Content"]} {" "} {this.state.medData["Kind"]}</CardSubtitle>
                                        <CardText style={{ fontSize: "0.9rem" }}> {this.state.medData["Tech"]} </CardText>
                                    </CardBody>
                                    <CardFooter style={{ fontSize: "0.7rem", color: "#ff5c5c" }}>
                                        Warning: {this.state.medData["Warning"]}
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="App">
                    <IotReciever sub_topics={["/projectApollo/Sensor0001/data"]} callback={this.callBackIoT}></IotReciever>
                    <Modal style={{ backgroundColor: "#282d2b" }} isOpen={this.state.modalOK}>
                        <ModalBody style={{ backgroundColor: "#282d2b", color: "white", fontSize: "1.5rem" }}>
                            Trace added successfully
                        </ModalBody>
                        <ModalFooter style={{ backgroundColor: "#282d2b" }}>
                            <div style={{ textAlign: "center" }}>
                                <Button style={{ fontSize: "1.5rem", backgroundColor: "#1dd79b", color: "black" }} onClick={() => this.setState({ modalOK: false })}>OK</Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                    <br />
                    <Modal style={{ backgroundColor: "#282d2b" }} isOpen={this.state.modal}>
                        <ModalHeader style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>Login</ModalHeader>
                        <ModalBody style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>
                            <Form style={{ backgroundColor: "#282d2b", color: "#1dd79b" }}>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
                                    <Input onChange={this.onChangeForm} type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="examplePassword">Password</Label>
                                    <Input onChange={this.onChangeForm} type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter style={{ backgroundColor: "#282d2b" }}>
                            <Button style={{ backgroundColor: "#1dd79b", color: "black" }} onClick={this.onSubmitForm}>Login</Button>{' '}
                            <Button style={{ color: "black" }} onClick={() => this.modalToogle(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <Row md="3">
                        <Col xs="4">
                            <img alt="logo" src={name} style={{ width: "33%" }} />
                        </Col>
                        <Col xs="4">
                            <img alt="logo2" src={logoApollo} style={{ width: "10%" }} />
                        </Col>
                        <Col xs="4">
                            <Button style={{ backgroundColor: "#1dd79b", color: "#1b4e3f" }} onClick={() => this.modalToogle(true)} disabled={this.state.buttonStateLogin}>
                                {this.state.loginLabel}
                            </Button>
                        </Col>
                    </Row>
                    <hr />
                    <Row md="2">
                        <Col xs="6">
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <div>
                                        <Button style={{ backgroundColor: "#1dd79b", color: "#1b4e3f" }} onClick={() => this.displayQR()} disabled={this.state.buttonStateCheck}>
                                            Check Product!
                  </Button>
                                    </div>
                                    <br style={{ display: this.state.spaceQR }} />
                                    <div style={{ marginLeft: "18%" }} id="qrplace" />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="6">
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <div>
                                        <Button style={{ backgroundColor: "#1dd79b", color: "#1b4e3f" }} onClick={() => this.displayQR2()} disabled={this.state.buttonStateAdd}>
                                            Add Trace (only with Login)
                  </Button>
                                    </div>
                                    <br style={{ display: this.state.spaceQR2 }} />
                                    <div style={{ marginLeft: "18%" }} id="qrplace2" />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <hr />
                    <div style={{ display: this.state.infoDisplay }}>
                        <Row md="2">
                            <Col xs="6">
                                <Row md="1">
                                    <Col xs="12">
                                        <div id="map-zone" />
                                    </Col>
                                    <Col xs="12">
                                        <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                            <ol style={{ textAlign: "left" }}>
                                                {
                                                    this.state.coord_list.map((number, index) => <li style={{ color: "blue" }} key={Math.random()} onClick={() => this.moveMap(number)}><a href="#">{number[1]}{", "}{number[0]}{" | "}{this.state.objList[index]["Place"]}</a></li>)
                                                }
                                            </ol>
                                        </Card>
                                    </Col>
                                    <Col xs="12" style={{ display: this.state.iot }}>
                                        <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                            <Row md="3">
                                                <Col xs="4">
                                                <div style={{ fontSize: "1.5rem" }}>{"Temperature:"}</div>
                                                    <LineGraph data={this.state.series1} />
                                                    <div style={{ fontSize: "2rem" }}>{round2(avg(this.state.series1) * 1.8 + 32)}{" °F"}</div>
                                                </Col>
                                                <Col xs="4">
                                                <div style={{ fontSize: "1.5rem" }}>{"RH:"}</div>
                                                    <LineGraph data={this.state.series2} />
                                                    <div style={{ fontSize: "2rem" }}>{avg(this.state.series2)}{" %"}</div>
                                                </Col>
                                                <Col xs="4">
                                                <div style={{ fontSize: "1.5rem" }}>{"Air Quality:"}</div>
                                                    <LineGraph data={this.state.series3} />
                                                    <div style={{ fontSize: "2rem" }}>{avg(this.state.series3)}</div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="6">
                                <Row md="1">
                                    <Col xs="12">
                                        <Card style={{ backgroundColor: "#282d2b", color: "white" }}>
                                            Solana Explorer link:
                <a href={"https://explorer.solana.com/address/" + this.state.address + "?cluster=devnet"} rel="noreferrer" target="_blank">{this.state.address}</a>
                                            <hr />
                                            <div style={{ textAlign: "center" }}>
                                                <CardImg top style={{ width: "60%" }} src={this.state.medData["Image"]} alt="Card image cap" />
                                            </div>
                                            <CardBody>
                                                <CardTitle tag="h4">{this.state.medData["Laboratory"] + " : " + this.state.medData["Name"]}</CardTitle>
                                                <CardSubtitle tag="h5" className="mb-2 text-muted">Content: {this.state.medData["Content"]} {" "} {this.state.medData["Kind"]}</CardSubtitle>
                                                <CardText style={{ fontSize: "0.9rem" }}> {this.state.medData["Tech"]} </CardText>
                                            </CardBody>
                                            <CardFooter style={{ fontSize: "0.7rem", color: "#ff5c5c" }}>
                                                Warning: {this.state.medData["Warning"]}
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }
}

export default MyApp;