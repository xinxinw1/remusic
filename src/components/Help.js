import React from "react";
import {Container} from 'reactstrap'
import "./Help.css";

import VexTab from './VexTab';

let defaultContent = `stave clef=treble key=Bb time=4/4
notes :4 (Cn/4.E#/4.G@/4) $.a./bottom.$ $Hi$
notes :16 E##-F@@-G-A/5 $.a-/top.,..,.a>/top.,..$ $Team,Xin-Xin,Sophie,Zack$
notes :8 DTF-A/4 ^3^ $.a@u/bottom.$ :8d B/4 $.a@a/top.$ :16 ## | :4 A/4 T A/4`;

const Help = () => (
  <Container fluid className="center-help">
    <VexTab value={defaultContent} />
    <p id="help">See <a href="http://my.vexflow.com/articles/134">this link</a> for instructions on how to use Music Editor</p>
  </Container>
);

export default Help
