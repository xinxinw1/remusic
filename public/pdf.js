// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = './acappella.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

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

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.then(function () {
      console.log('Page rendered');
      $(function () {
        $("#dialog-highlight").dialog({
          dialogClass: "highlight",
          minHeight: 1,
          minWidth: 1,
          height: 100,
          width: 100
        });
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
