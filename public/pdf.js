// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = './acappella.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

function setDialogPosition(dialogElement, startEvent, currEvent) {
  var height = Math.abs(startEvent.pageY - currEvent.pageY);
  var width = Math.abs(startEvent.pageX - currEvent.pageX);
  var my;
  if (startEvent.pageX <= currEvent.pageX) {
    if (startEvent.pageY <= currEvent.pageY) {
      my = "left top";
    } else {
      // startY > currY
      my = "left bottom";
    }
  } else {
    // startX > currX
    if (startEvent.pageY <= currEvent.pageY) {
      my = "right top";
    } else {
      my = "right bottom";
    }
  }

  console.log(height, width);

  //dialogElement.dialog("option", "position", { my: my, at: "center", of: startEvent });
  //dialogElement.dialog("option", "width", width);
  //dialogElement.dialog("option", "height", 200);
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
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var mousedownEvent = null;
    var down = false;
    var dialog = $("#dialog-highlight");
    $(canvas).on("mousedown", function (e) {
      console.log("down", e);
      e.preventDefault();
      mousedownEvent = e;
      down = true;
      dialog.dialog({
        dialogClass: "highlight",
        minHeight: 1,
        minWidth: 1,
        height: 10,
        width: 200,
        position: {my: "left top", at: "center", of: mousedownEvent}
      });
    });
    $(document).on("mouseup", function (e) {
      console.log("up", e);
      down = false;
    });
    $(canvas).on("mousemove", function (e) {
      if (down) {
        e.preventDefault();
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
          position: {my: "left center", at: "right center", of: "#the-canvas"}
        });
      });
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
