// var back  = document.getElementById('back');
var title = document.getElementById('title');
// var front = document.getElementById('front');
// var canvas = document.getElementById('source');
// var ctx = canvas.getContext('2d');

// handle file selection. Update image
function fileSelect(tgt, dst) {
  var files = tgt.files; // FileList object
  for (var i = 0, f; f = files[i]; i++) {
    if (!f.type.match('image.*')) { // Only process image files.
      continue;
    }
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        let img = new Image();
        img.onload = function() {
          img.title =  escape(theFile.name);
          console.log(img.title, img.width, img.height);
          // document.getElementById(dst).appendChild(img);
          let c = document.getElementById(dst).getElementsByTagName("canvas")[0];
          c.width = img.width;
          c.height = img.height;
          c.getContext('2d').drawImage(img, 0, 0);
        };
        img.src = e.target.result;
      };
    })(f);
    reader.readAsDataURL(f);
  }
}

function loadFont(tgt) {
  var selector = document.getElementById("selectFontFamily");
  var family = selector.options[selector.selectedIndex].value;
  var fontName = tgt.value;
  console.log(fontName);
  if(fontName !="") {
    WebFont.load({ google: { families: [fontName] } });
    title.style.fontFamily = fontName;
  }
}

function changeAttribute(tgt, dst, attr) {
  var col = tgt.value;
  console.log(dst, attr, col)
  document.getElementById(dst).style[attr] = col;
}

function updateFontfamily(selector) {
  var family = selector.options[selector.selectedIndex].value;
	console.log(family);
  if(family==="Other ...") {
     fontName = document.getElementById("other_font").value
	console.log(fontName);
     if(fontName != "") {
	  console.log(WebFont.load({ google: { families: [fontName] } }));
	  title.style.fontFamily = fontName;
     }
  } else {
	title.style.fontFamily = family;
  }
}

function updateTitle(tgt) {
  title.innerHTML = tgt.value;
}

function showBlock(tgt, dst) {
  var doc = document.getElementById(dst);
  document.getElementById('back-tab').style.display = "none";
  document.getElementById('center-tab').style.display = "none";
  document.getElementById('front-tab').style.display = "none";
  doc.style.display = "block";
  tablinks = document.getElementsByClassName("w3-bar-item");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  tgt.className += " w3-red";
}

function openTab(tabName) {
  var x = document.getElementsByClassName("tab");
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function drawCrosshair(r, g, b) {
  var ctx = document.getElementById('crosshair').getContext('2d')
  ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.25)'
  ctx.beginPath()
  ctx.moveTo(5.5, 0)
  ctx.lineTo(5.5, 4)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(7, 5.5)
  ctx.lineTo(11, 5.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(5.5, 7)
  ctx.lineTo(5.5, 11)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 5.5)
  ctx.lineTo(4, 5.5)
  ctx.stroke()
}


info = document.getElementById("info");
zoomed = document.getElementById('zoomed');
zoomer= document.getElementById("zoomer");
coord= document.getElementById("coord");
hex_hover= document.getElementById("hex-hover");
rgb_hover= document.getElementById("rgb-hover");
color_hover= document.getElementById("color-hover");
ztx = zoomed.getContext('2d');

// “Update details” button opens the <dialog> modally
function createImage(canvas_id, tab_id, attr_id) {
  // info.onmouseleave = function() {
  //   $(this).find('input').blur()
  // };

  const zoom = 3;
  // var tab = document.getElementById(tab_id);
  var canvas = document.getElementById(canvas_id);
  var ctx = canvas.getContext('2d');
  let img = new Image()
img.onload = function() {
  zoomed.width = img.width * zoom
  zoomed.height = img.height * zoom
  ztx.imageSmoothingEnabled = false
  ztx.mozImageSmoothingEnabled = false
  ztx.webkitImageSmoothingEnabled = false
  // ztx.putImageData(img, 0, 0)
  ztx.drawImage(img, 0, 0, zoomed.width, zoomed.height)

  info.style.display = "block";
  var hex;
  canvas.onclick = function(e) {
	changeAttribute(tab_id,attr_id, hex)
  }
  canvas.onmousemove = function(e) {
    var x = e.offsetX/canvas.clientWidth *canvas.width,
	      y = e.offsetY/canvas.clientHeight*canvas.height,
	      d = ctx.getImageData(x, y, 1, 1).data,
	      r = d[0], g = d[1], b = d[2],
	      ir = 255 - r, ig = 255 - g, ib = 255 - b,
	      inv = rgbToHex(ir, ig, ib);

    hex = rgbToHex(r, g, b);
    // console.log( x + ' x ' + y, hex);
    coord.innerHtml = x + ' x ' + y;
    coord.style.color= inv;
    hex_hover.value = hex;
    rgb_hover.value = r + ',' + g + ',' + b;
    color_hover.style.background= hex;

    zoomed.style.left= (-(zoom * x) + (zoomer.clientWidth)/2)+"px";
    zoomed.style.top = (-(zoom * y) + (zoomer.clientHeight)/2)+"px";

    drawCrosshair(ir, ig, ib)
  };
}
  img.src=canvas.toDataURL()
}
