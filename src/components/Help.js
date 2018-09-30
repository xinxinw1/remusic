import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import vextab from 'vextab/releases/vextab-div';

class Help extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
          <div>
            <FontAwesomeIcon icon={faCoffee} />
            <div className="vex-tabdiv" width="680" scale="1.0" editor="true" editor_width="680" editor_height="110" style={{position: "relative"}}>stave clef=treble key=Bb time=4/4
                notes :4 (Cn/4.E#/4.G@/4) $.a./bottom.$ $Hi$
                notes :16 E##-F@@-G-A/5 $.a-/top.,..,.a>/top.,..$ $Team,Xin-Xin,Sophie,Zack$
                notes :8 DTF-A/4 ^3^ $.a@u/bottom.$ :8d B/4 $.a@a/top.$ :16 ## | :4 A/4 T A/4
            </div>
            <p id="help">See <a href="http://my.vexflow.com/articles/134">this link</a> for instructions on how to use Music Editor</p>
          </div>
        );
    }
}

export default Help
