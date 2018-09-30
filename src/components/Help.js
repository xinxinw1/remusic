import React from "react";
import "../css/font-awesome-4.7.0/css/font-awesome.min.css"

export default class Help extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        const script1 = document.createElement("script");
        script1.src = "vextab-div.js"
        script1.async = true;

        document.body.appendChild(script1);
    }

    render(){
        return (
            <body>
            <div className="vex-tabdiv" width="680" scale="1.0" editor="true" editor_width="680" editor_height="110" style="position: relative;">stave clef=treble key=Bb time=4/4
                notes :4 (Cn/4.E#/4.G@/4) $.a./bottom.$ $Hi$
                notes :16 E##-F@@-G-A/5 $.a-/top.,..,.a>/top.,..$ $Team,Xin-Xin,Sophie,Zack$
                notes :8 DTF-A/4 ^3^ $.a@u/bottom.$ :8d B/4 $.a@a/top.$ :16 ## | :4 A/4 T A/4
            </div>
            <p id="help">See <a href="http://my.vexflow.com/articles/134">this link</a> for instructions on how to use Music Editor</p>
            </body>

        );
    }
}

export default Help
