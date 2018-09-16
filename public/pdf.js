// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = './acappella.pdf';

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

function makeHighlight() {
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


// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
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
      console.log("down", e);
      e.preventDefault();
      mousedownEvent = e;
      down = true;
      dialog = makeHighlight();
    });
    $(document).on("mouseup", function (e) {
      console.log("up", e);
      down = false;
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
        $("#dialog-comment").dialog({
          title: "Comment by Xin-Xin",
          position: {my: "left center", at: "right center", of: "#pdf-canvas"},
        });
      });
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
