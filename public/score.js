// Initialize Firebase
var config = {
  apiKey: "AIzaSyBXZfUvEUcCSOdZBWbw_PMY2XCAEaS9Q94",
  authDomain: "remusic-cf7bd.firebaseapp.com",
  databaseURL: "https://remusic-cf7bd.firebaseio.com",
  projectId: "remusic-cf7bd",
  storageBucket: "remusic-cf7bd.appspot.com",
  messagingSenderId: "484094823628"
};
firebase.initializeApp(config);

var urlParams = new URLSearchParams(location.search);

var paramId = urlParams.get('id') || 'testid';

displayVersions(paramId);

function displayVersions(scoreId) {
  var versionsRef = firebase.database().ref('versions/' + scoreId);
  versionsRef.on('child_added', function (version) {
    displayVersion(scoreId, version);
  });
}


function displayScore(scoreId) {
  var scoreRef = firebase.database().ref('scores/' + scoreId);
  scoreRef.on('value', function (score) {
    document.title = score.val().title;
  });
}

displayScore(paramId);

function insertCommentChain(scoreId, versionId, pageNum, highlightDiv) {
  console.log("insert comment chain", scoreId, versionId, pageNum, highlightDiv);
  var commentChainsRef = firebase.database().ref('comment-chains/' + scoreId + '/' + versionId + '/' + pageNum);
  var commentChainRef = commentChainsRef.push();
  commentChainRef.set({
    highlightTop: highlightDiv.css("top"),
    highlightLeft: highlightDiv.css("left"),
    highlightWidth: highlightDiv.css("width"),
    highlightHeight: highlightDiv.css("height"),
    commentChainTop: highlightDiv.offset().top - $("#pdf-canvas").offset().top,
    commentChainLeft: $("#pdf-canvas").offset().left + $("#pdf-canvas").width() + 20,
  });
  // remove the div cause insert will readd it properly
  highlightDiv.remove();
}

function insertComment(scoreId, versionId, pageNum, commentChainId, commentInsertDiv, comment) {
  console.log("insert comment", scoreId, versionId, pageNum, commentChainId, comment);
  var commentsRef = firebase.database().ref('comments/' + scoreId + '/' + versionId + '/' + pageNum + '/' + commentChainId);
  var commentRef = commentsRef.push();
  commentRef.set(comment);
  commentInsertDiv.remove();
}

function displayVersion(scoreId, version) {
  console.log("display version", scoreId, version);
  var pdfRef = firebase.storage().ref("pdfs/" + scoreId + '/' + version.key + '/' + version.val().file);
  pdfRef.getDownloadURL().then(function (url) {
    console.log("url", url);
    //url = "./acappella.pdf";

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

    function setDialogPosition(dialogElement, startEvent, currEvent) {
      var offset = $("#highlights").offset();
      var currOffsetX = currEvent.pageX - offset.left;
      var currOffsetY = currEvent.pageY - offset.top;
      var startOffsetX = startEvent.pageX - offset.left;
      var startOffsetY = startEvent.pageY - offset.top;
      var topVal = Math.min(startOffsetY, currOffsetY);
      var leftVal = Math.min(startOffsetX, currOffsetX);
      var width = Math.abs(startOffsetX - currOffsetX);
      var height = Math.abs(startOffsetY - currOffsetY);
      console.log(startEvent);
      console.log('dialog position', currOffsetX, currOffsetY, topVal, leftVal, width, height);
      dialogElement.css({top: topVal, left: leftVal, height: height, width: width});
    }

    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
      console.log('PDF loaded');
      
      var pageNum = 0;
      var pageNumber = pageNum+1;
      pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');
        
        var scale = 2;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('pdf-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var mousedownEvent = null;
        var down = false;
        var dialog;
        $(canvas).on("mousedown", function (e) {
          if (e.which === 1) {
            console.log("down", e);
            e.preventDefault();
            mousedownEvent = e;
            down = true;
            dialog = makeHighlightDiv();
          }
        });
        $(document).on("mouseup", function (e) {
          if (down) {
            console.log("up", e);
            down = false;
            if (Math.abs(e.pageX-mousedownEvent.pageX) > 10 && Math.abs(e.pageY-mousedownEvent.pageY) > 10) {
              insertCommentChain(scoreId, version.key, pageNum, dialog);
            } else {
              dialog.remove();
            }
            dialog = undefined;
          }
        });
        $(document).on("mousemove", function (e) {
          if (down) {
            console.log("mouse move ",  e);
            setDialogPosition(dialog, mousedownEvent, e);
          }
        });

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.then(function () {
          console.log('Page rendered');
          $(function () {
            displayCommentChains(scoreId, version, pageNum);
          });
        });
      });
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });
  });
}

function makeHighlightDiv() {
  console.log("make highlight div");
  var div = document.createElement("div");
  div.setAttribute("class", "highlight");
  $(div).resizable({
    handles: "all",
    classes: {
      "ui-resizable-se": ""
    }
  });
  $(div).draggable();
  $("#highlights").append(div);
  return $(div);
}

function makeCommentChainDiv(scoreId, versionId, pageNum, commentChain) {
  console.log("make comment chain div", commentChain.val());
  var div = document.createElement("div");
  div.setAttribute("class", "comment-chain");

  var dialog = $(div).dialog({
    title: "",
    buttons: [
      {
        text: "+ Music",
        click: function () {
          addMusicToCommentChain(scoreId, versionId, pageNum, commentChain.key, $(this));
        }
      },
      {
        text: "+ Text",
        click: function () {
          addTextToCommentChain(scoreId, versionId, pageNum, commentChain.key, $(this));
        }
      }
    ],
    position: {"my": "left top", "at": "left+" + commentChain.val().commentChainLeft + " top+" + commentChain.val().commentChainTop, "of": "#pdf-canvas", "collision": "none"},
    width: commentChain.val().commentChainWidth || 300,
    height: commentChain.val().commentChainHeight || "auto",
    drag: function (e, ui) {
      updateData();
    },
    resize: function (e, ui) {
      updateData(ui.size);
    }
  });

  function updateData(size) {
    console.log("update data");
    var commentChainRef = firebase.database().ref('comment-chains/' + scoreId + '/' + versionId + '/' + pageNum + '/' + commentChain.key)
    var obj = {
      commentChainTop: $(div).dialog("widget").offset().top - $("#pdf-canvas").offset().top,
      commentChainLeft: $(div).dialog("widget").offset().left - $("#pdf-canvas").offset().left,
    };
    if (size) {
      obj.commentChainWidth = size.width;
      obj.commentChainHeight = size.height;
    }

    console.log(obj);
    commentChainRef.set(obj);
  }
  return dialog;
}

function addTextToCommentChain(scoreId, versionId, pageNum, commentChainId, commentChainDiv) {
  var div = document.createElement("div");
  div.appendChild(document.createElement("hr"));
  var p1 = document.createElement("p");
  var textarea = document.createElement("textarea");
  $(textarea).css({width: 250, height: 80});
  p1.appendChild(textarea)
  div.appendChild(p1);
  var p2 = document.createElement("p");
  var input = document.createElement("input");
  input.setAttribute("type", "button");
  input.setAttribute("value", "Submit");
  input.setAttribute("class", "btn btn-success");
  $(input).on("click", function () {
    insertComment(scoreId, versionId, pageNum, commentChainId, div, {
      username: "anonymous",
      type: "text",
      content: $(textarea).val(),
    });
  });
  p2.appendChild(input)
  div.appendChild(p2);
  commentChainDiv.append(div);
}

function addMusicToCommentChain(scoreId, versionId, pageNum, commentChainId, commentChainDiv) {
  var div = document.createElement("div");
  div.appendChild(document.createElement("hr"));
  var vextabCanvas = document.createElement("canvas");
  var vextabError = document.createElement("div");
  var p1 = document.createElement("p");
  var vextabTextarea = document.createElement("textarea");
  $(vextabTextarea).css({width: 250, height: 80});
  $(vextabTextarea).val(`stave clef=treble key=Bb time=4/4
notes :4 A/4 B/4 C/4 D/4`);
  renderVextab(vextabTextarea, vextabCanvas, vextabError);
  div.appendChild(vextabCanvas);
  div.appendChild(vextabError);
  p1.appendChild(vextabTextarea);
  div.appendChild(p1);
  var p3 = document.createElement("p");
  var input = document.createElement("input");
  input.setAttribute("type", "button");
  input.setAttribute("value", "Submit");
  input.setAttribute("class", "btn btn-success");
  $(input).on("click", function () {
    insertComment(scoreId, versionId, pageNum, commentChainId, div, {
      username: "anonymous",
      type: "music",
      content: $(vextabTextarea).val(),
    });
  });
  p3.appendChild(input);
  var a = document.createElement("a");
  a.setAttribute("href", "./help.html");
  a.setAttribute("class","btn btn-link");
  $(a).css("color", '#007bff');
  $(a).css("text-decoration", 'underline');
  $(a).css("margin-left", '7em');
  a.appendChild(document.createTextNode("Help"));
  p3.appendChild(a);
  div.appendChild(p3);
  commentChainDiv.append(div);
}

function renderVextabText(canvas, text) {
  var Renderer = Vex.Flow.Renderer;
  // Create VexFlow Renderer from canvas element with id #boo
  var renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
  // Initialize VexTab artist and parser.
  var artist = new VexTabDiv.Artist(0, 0, 330, {scale: 0.8});
  var vextab = new VexTabDiv.VexTab(artist);
  try {
    vextab.parse(text);
    artist.render(renderer);
  } catch (e) {
    console.error(e);
  }
}

/*
 * textarea, canvas, error are JS DOM objects
 */
function renderVextab(textarea, canvas, error) {
  var Renderer = Vex.Flow.Renderer;
  // Create VexFlow Renderer from canvas element with id #boo
  var renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
  // Initialize VexTab artist and parser.
  var artist = new VexTabDiv.Artist(0, 0, 330, {scale: 0.8});
  var vextab = new VexTabDiv.VexTab(artist);
  function render() {
    try {
      vextab.reset();
      artist.reset();
      vextab.parse($(textarea).val());
      artist.render(renderer);
      $(error).text("");
    } catch (e) {
      console.error(e);
      $(error).html(e.message.replace(/[\n]/g, '<br/>'));
    }
  }
  $(textarea).on("keyup", function () {
    render();
  });
  render();
}

function displayHighlightDiv(scoreId, versionId, pageNum, commentChain) {
  console.log("display hightlight div", commentChain);
  var div = makeHighlightDiv();
  div.css({
    top: commentChain.val().highlightTop,
    left: commentChain.val().highlightLeft,
    width: commentChain.val().highlightWidth,
    height: commentChain.val().highlightHeight,
  });
  function updateData() {
    console.log("update data");
    var commentChainRef = firebase.database().ref('comment-chains/' + scoreId + '/' + versionId + '/' + pageNum + '/' + commentChain.key)
    commentChainRef.set({
      highlightTop: div.css("top"),
      highlightLeft: div.css("left"),
      highlightWidth: div.css("width"),
      highlightHeight: div.css("height"),
    });
  }

  div.on("resize", function (e) {
    updateData();
  });
  div.on("drag", function (e) {
    updateData();
  });
  return div;
}

function displayCommentChain(scoreId, versionId, pageNum, commentChain) {
  console.log("display comment chain", commentChain);
  var highlightDiv = displayHighlightDiv(scoreId, versionId, pageNum, commentChain);
  var commentChainDiv = makeCommentChainDiv(scoreId, versionId, pageNum, commentChain);
  var commentsRef = firebase.database().ref('comments/' + scoreId + '/' + versionId + '/' + pageNum + '/' + commentChain.key);
  commentsRef.on('child_added', function (comment) {
    displayComment(commentChainDiv, comment);
  });
}

function displayComment(commentChainDiv, comment) {
  if (!commentChainDiv.is(":empty")) commentChainDiv.append(document.createElement("hr"));
  switch (comment.val().type) {
    case "text":
      var p = document.createElement("p");
      p.appendChild(document.createTextNode(comment.val().content));
      commentChainDiv.append(p);
      break;
    case "music":
      var vextabCanvas = document.createElement("canvas");
      renderVextabText(vextabCanvas, comment.val().content);
      commentChainDiv.append(vextabCanvas);
      break;
    default:
      console.error("Unknown comment type " + comment.val().type);
      break;
  }
}

function displayCommentChains(scoreId, version, pageNum) {
  console.log("display comment chains", version, pageNum);
  var commentChainsRef = firebase.database().ref('comment-chains/' + scoreId + '/' + version.key + '/' + pageNum);
  commentChainsRef.on('child_added', function (commentChain) {
    displayCommentChain(scoreId, version.key, pageNum, commentChain);
  });
}
