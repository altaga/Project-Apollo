import './App.css';
import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { isMobile } from "react-device-detect"
import logoApollo from "./logo.png"
import name from "./name.png"
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";

class MyApp2 extends Component {
    render() {
        let iconSize = "3rem"
        if (isMobile) {
            return (
                <div className="App">
                    <Row>
                        <Col xs="8" style={{ paddingLeft: "10%" }}>
                            <br />
                            <img alt="logo2" src={logoApollo} style={{ width: "60%" }} />
                            <br />
                            <br />
                            <img alt="logo" src={name} style={{ width: "100%" }} />
                        </Col>
                        <Col xs="4" style={{ paddingRight: "5%" }}>
                            <br />
                            <div style={{ color: "white", width: "100%" }}>
                                <Row md="1">
                                    <Col>
                                    <a style={{ color: "#4267B2" }} href="https://www.facebook.com/ProjectApolloo" target="_blank" rel="noreferrer">
                                    <FacebookIcon style={{ fontSize: iconSize }} />
                                </a>
                                    </Col>
                                    <Col>
                                    <a style={{ color: "#1DA1F2" }} href="https://twitter.com/ProjectApolloo" target="_blank" rel="noreferrer">
                                    <TwitterIcon style={{ fontSize: iconSize }} />
                                </a>
                                    </Col>
                                    <Col>
                                    <a style={{ color: "#7289da" }} href="https://discord.com/invite/2RjMjDG9" target="_blank" rel="noreferrer">
                                    <FaDiscord style={{ fontSize: iconSize }} />
                                </a>
                                    </Col>
                                    <Col>
                                    <a style={{ color: "#C13584" }} href="https://www.instagram.com/projectapolloo/" target="_blank" rel="noreferrer">
                                    <InstagramIcon style={{ fontSize: iconSize }} />
                                </a>
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col xs="12" style={{ paddingLeft: "5%", paddingRight: "7%" }}>
                            <div style={{ fontSize: "2rem", color: "white", fontFamily: 'Orbitron', textAlign: "center" }} >Provenance DApp that integrates Internet of Things devices with the Solana blockchain.</div>
                            <br />
                            <br />
                            <Row md="2">
                                <Col xs="6">
                                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                                        <Button style={{ backgroundColor: "#b441ba", color: "white", fontSize: "2rem" }}>{'\u25B6 '} Video Demo</Button>
                                    </a>
                                </Col>
                                <Col xs="6">
                                    <a href="/" target="_blank" rel="noreferrer">
                                        <Button style={{ backgroundColor: "#1dd79b", color: "white", fontSize: "2rem" }}> Demo</Button>
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="12">
                            <hr />
                        </Col>
                        <Col xs="12" style={{ paddingRight: "5%" }}>
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <Row md="1">
                                        <Col xs="12">
                                            <div style={{ fontSize: "4rem", color: "white", fontFamily: 'Orbitron' }}>
                                                Join our
                                            <br />
                                            Alpha
                                            </div>
                                        </Col>
                                        <Col>
                                            <br />
                                        </Col>
                                        <Col xs="12">
                                            <img alt="logo2" src={logoApollo} style={{ width: "40%" }} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div >
            );
        }
        else {
            return (
                <div className="App">
                    <Row>
                        <Col xs="8" style={{ paddingLeft: "5%" }}>
                            <br />
                            <img alt="logo2" src={logoApollo} style={{ width: "10%" }} />
                            {" "}
                            <img alt="logo" src={name} style={{ width: "33%" }} />
                        </Col>
                        <Col xs="4" style={{ paddingRight: "5%" }}>
                            <br />
                            <div style={{ color: "white", width: "100%" }}>
                                <a style={{ color: "#4267B2" }} href="https://www.facebook.com/ProjectApolloo" target="_blank" rel="noreferrer">
                                    <FacebookIcon style={{ fontSize: iconSize }} />
                                </a>
                                {" | "}
                                <a style={{ color: "#1DA1F2" }} href="https://twitter.com/ProjectApolloo" target="_blank" rel="noreferrer">
                                    <TwitterIcon style={{ fontSize: iconSize }} />
                                </a>
                                {" | "}
                                <a style={{ color: "#7289da" }} href="https://discord.com/invite/2RjMjDG9" target="_blank" rel="noreferrer">
                                    <FaDiscord style={{ fontSize: iconSize }} />
                                </a>
                                {" | "}
                                <a style={{ color: "#C13584" }} href="https://www.instagram.com/projectapolloo/" target="_blank" rel="noreferrer">
                                    <InstagramIcon style={{ fontSize: iconSize }} />
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col xs="8" style={{ paddingLeft: "5%" }}>
                            <br />
                            <br />
                            <div style={{ fontSize: "2rem", color: "white", fontFamily: 'Orbitron', textAlign: "left" }} >Provenance DApp that integrates Internet of Things devices with the Solana blockchain.</div>
                            <br />
                            <br />
                            <Row md="2">
                                <Col xs="6">
                                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                                        <Button style={{ backgroundColor: "#b441ba", color: "white", fontSize: "2rem" }}>{'\u25B6 '} Video Demo</Button>
                                    </a>
                                </Col>
                                <Col xs="6">
                                    <a href="/" target="_blank" rel="noreferrer">
                                        <Button style={{ backgroundColor: "#1dd79b", color: "white", fontSize: "2rem" }}> Demo</Button>
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="4" style={{ paddingRight: "5%" }}>
                            <Card style={{ backgroundColor: "#282d2b" }}>
                                <CardBody>
                                    <Row md="1">
                                        <Col xs="12">
                                            <div style={{ fontSize: "4rem", color: "white", fontFamily: 'Orbitron' }}>
                                                Join our
                                            <br />
                                            Alpha
                                            </div>
                                        </Col>
                                        <Col>
                                            <br />
                                        </Col>
                                        <Col xs="12">
                                            <img alt="logo2" src={logoApollo} style={{ width: "40%" }} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div >
            );
        }
    }
}

export default MyApp2;