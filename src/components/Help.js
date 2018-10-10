import React from "react";
import {Container} from 'reactstrap'
import "./Help.css";

import vextab from 'vextab/releases/vextab-div';

let string = 'stave clef=treble key=Bb time=4/4\n' +
    'notes :4 (Cn/4.E#/4.G@/4) $.a./bottom.$ $Hi$\n' +
    'notes :16 E##-F@@-G-A/5 $.a-/top.,..,.a>/top.,..$ $Team,Xin-Xin,Sophie,Zack$\n' +
    'notes :8 DTF-A/4 ^3^ $.a@u/bottom.$ :8d B/4 $.a@a/top.$ :16 ## | :4 A/4 T A/4';

class Help extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){

        return (

          <Container fluid className="center-help">
            <div className="vex-tabdiv" width="680" scale="1.0" editor="true" editor_width="680" editor_height="110" style={{position: "relative"}}>
              {string}
            </div>
            <p id="help">See <a href="http://my.vexflow.com/articles/134">this link</a> for instructions on how to use Music Editor</p>
          </Container>

        );
    }

}

export default Help
