import vextab from 'vextab/releases/vextab-div';
vextab.Artist.prototype.origReset = Artist.prototype.reset;
vextab.Artist.prototype.reset = function () {
  this.origReset();
  // see http://my.vexflow.com/articles/53#comment-2117647808
  this.customizations["beam-rests"] = "false";
};

export default vextab
