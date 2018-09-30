import React from "react";
import { Jumbotron, Container, Table } from 'reactstrap';
import "./Home.css";

const Home = () => (
    <div>
        <Jumbotron fluid className="jumbo_colour">
            <Container fluid className="center">
                <h1 className="display-3">Welcome to Re:Music</h1>
                <h3>Easy Online Music Reviewing</h3>
                <hr/>
                <p className="lead">Share | Collaborate | Innovate</p>
            </Container>
        </Jumbotron>
        <Table dark >
            <thead>
                <th>Hi Sophie and XinXin</th>
            </thead>
            <tbody>
                <tr>
                    <td>Zack here btw</td>
                </tr>
                <tr>
                    <td>How are you guys doing?</td>
                </tr>
            </tbody>
        </Table>
    </div>
);

export default Home
