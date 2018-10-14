import React from "react";
import { Link } from "react-router-dom";
import { Jumbotron, Container, Table } from 'reactstrap';
import "./Home.css";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../firebase/firebase";


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scores: {}
    };

    this.scoreRef = firebase.database().ref('scores');

    this.setScores = this.setScores.bind(this);
  }

  setScores(scores) {
    this.setState({scores: scores.val()});
  }

  componentDidMount() {
    this.scoreRef.on('value', this.setScores);
  }

  componentWillUnmount() {
    this.scoreRef.off('value', this.setScores);
  }
    
  render() {
    let scoreId = this.generateRows();
    return (
      <div>
        <Jumbotron fluid className="jumbo_colour">
          <Container fluid className="center">
            <FontAwesomeIcon icon={faPlay} size="4x"/>
            <br/>
            <h1 className="display-3">Welcome to Re:Music</h1>
            <h3>Easy Online Music Reviewing</h3>
            <br/>
            <hr/>
            <br/>
            <p className="lead">Share | Collaborate | Innovate</p>
          </Container>
        </Jumbotron>
        <Table dark>
          <thead>
          <tr>
            <th>Scores</th>
          </tr>
          </thead>
          <tbody>
            {scoreId}
          </tbody>
        </Table>
      </div>)
    }
    displayScore() {
    }

    generateRows() {
      return Object.keys(this.state.scores).map((scoreId) => {
        let url = "/score/" + scoreId;
        return <tr key={scoreId}>
          <td><Link to={url}>{this.state.scores[scoreId].title}</Link></td>
          </tr>;
      });
    }
}

export default Home
