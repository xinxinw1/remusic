var urlParams = new URLSearchParams(location.search);

getScore(urlParams.get('id')).then(function (score) {
  displayVersion(score.versions[0]);
});

function getScore(id) {
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
}

function displayVersion(version) {
  console.log("display version", version);
  displayPage(version, 0);
}

function insertCommentChain(highlightDiv) {
  console.log("insert comment chain", highlightDiv);
  return {
    // comment chain object
  };
}

function insertComment(commentChain, comment) {
  console.log("insert comment", commentChain, comment);
}

function displayPage(version, pageNum) {
  console.log("display page", version, pageNum);
  var url = version.file;

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
          insertCommentChain(dialog);
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
          displayCommentChains(version.commentChains);
        });
      });
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
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
    top: commentChain.highlightTop,
    left: commentChain.highlightLeft,
    width: commentChain.highlightWidth,
    height: commentChain.highlightHeight,
  });
}

function displayCommentChain(commentChain) {
  console.log("display comment chain", commentChain);
  displayHighlightDiv(commentChain);
  var commentChainDiv = makeCommentChainDiv();
  var p = document.createElement("p");
  p.appendChild(document.createTextNode("Yo hey what's up"));
  commentChainDiv.append(p);
}

function displayCommentChains(commentChains) {
  console.log("display comment chains", commentChains);
  commentChains.forEach(function (commentChain) {
    displayCommentChain(commentChain);
  });
}
