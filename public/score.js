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

/*function getScore(id) {
  console.log("get score", id);
  return $.Deferred(function (deferred) {
    deferred.resolve({
      versions: [
        {
          file: "./acappella.pdf",
          commentChains: [
            {
              highlightTop: 25,
              highlightLeft: 63,
              highlightWidth: 100,
              highlightHeight: 100,
            }
          ]
        }
      ]
    });
  });
}*/

function insertCommentChain(scoreId, versionId, pageNum, highlightDiv) {
  console.log("insert comment chain", scoreId, versionId, pageNum, highlightDiv);
  var commentChainsRef = firebase.database().ref('comment-chains/' + scoreId + '/' + versionId + '/' + pageNum);
  var commentChainRef = commentChainsRef.push();
  console.log({
    highlightTop: highlightDiv.css("top"),
    highlightLeft: highlightDiv.css("left"),
    highlightWidth: highlightDiv.css("width"),
    highlightHeight: highlightDiv.css("height"),
  });
  commentChainRef.set({
    highlightTop: highlightDiv.css("top"),
    highlightLeft: highlightDiv.css("left"),
    highlightWidth: highlightDiv.css("width"),
    highlightHeight: highlightDiv.css("height"),
  });
}

function insertComment(commentChain, comment) {
  console.log("insert comment", commentChain, comment);
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
      var topVal = Math.min(startEvent.offsetY, currOffsetY);
      var leftVal = Math.min(startEvent.offsetX, currOffsetX);
      var width = Math.abs(startEvent.offsetX - currOffsetX);
      var height = Math.abs(startEvent.offsetY - currOffsetY);
      dialogElement.css({top: topVal, left: leftVal, height: height, width: width});
    }

    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
      console.log('PDF loaded');
      
      var pageNumber = 1;
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
          //console.log("down", e);
          e.preventDefault();
          mousedownEvent = e;
          down = true;
          dialog = makeHighlightDiv();
        });
        $(document).on("mouseup", function (e) {
          if (down) {
            //console.log("up", e);
            down = false;
            var offset = $("#highlights").offset();
            var currOffsetX = e.pageX - offset.left;
            var currOffsetY = e.pageY - offset.top;
            var width = Math.abs(mousedownEvent.offsetX - currOffsetX);
            var height = Math.abs(mousedownEvent.offsetY - currOffsetY);
            if (width > 3 && height > 3){
                  insertCommentChain(scoreId, version.key, 0, dialog);
            };
            dialog = undefined;
          }
        });
        $(document).on("mousemove", function (e) {
          if (down) {
            //console.log("mouse move ",  e);
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
            displayCommentChains(scoreId, version, 0);
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

function makeCommentChainDiv() {
  console.log("make comment chain div");
  var div = document.createElement("div");
  div.setAttribute("class", "comment-chain");
  return $(div).dialog({
    title: "Comment by Xin-Xin",
    position: {my: "left center", at: "right center", of: "#pdf-canvas"},
  });
}

function displayHighlightDiv(commentChain) {
  console.log("display hightlight div", commentChain);
  var div = makeHighlightDiv();
  div.css({
    top: commentChain.val().highlightTop,
    left: commentChain.val().highlightLeft,
    width: commentChain.val().highlightWidth,
    height: commentChain.val().highlightHeight,
  });
}

function displayCommentChain(scoreId, versionId, pageNum, commentChain) {
  console.log("display comment chain", commentChain);
  displayHighlightDiv(commentChain);
  var commentChainDiv = makeCommentChainDiv();
  var commentsRef = firebase.database().ref('comments/' + scoreId + '/' + versionId + '/' + pageNum + '/' + commentChain.key);
  commentsRef.on('child_added', function (comment) {
    displayComment(commentChainDiv, comment);
  });
}

function displayComment(commentChainDiv, comment) {
  var p = document.createElement("p");
  p.appendChild(document.createTextNode("Yo hey what's up"));
  commentChainDiv.append(p);
}

function displayCommentChains(scoreId, version, pageNum) {
  console.log("display comment chains", version, pageNum);
  var commentChainsRef = firebase.database().ref('comment-chains/' + scoreId + '/' + version.key + '/' + pageNum);
  commentChainsRef.on('child_added', function (commentChain) {
    displayCommentChain(scoreId, version.key, pageNum, commentChain);
  });
}
