class Face {
  constructor(id, text, width, height, fontSize) {
    let div = document.getElementById(id);
    this.div = div.getElementsByTagName("DIV")[0];
    this.canvas = div.getElementsByTagName("CANVAS")[0];
    this.ctx = this.canvas.getContext('2d');
    this.id=id;
    this.text=text;
    this.bg_image="";
    this.bg_color="none";
    this.fg_color="#00000";
    this.width=width;
    this.height=height;
    this.fontFamily="";
    this.fontSize=fontSize;
    this.lineHeight="20mm";
  };

  set text(value) {
    this._text = value;
    this.div.innerHTML = value;
  }

  set bg_color(value) {
    this._bg_color = value;
    this.div.style.backgroundColor = value;
  }

  set fg_color(value) {
    this._fg_color = value;
    this.div.style.color = value;
  }

  set width(value) {
    this._width = value;
    this.div.style.width = value;
    this.canvas.width = value;
  }

  set height(value) {
    this._height = value;
    this.div.style.height = value;
    this.canvas.height = value;
  }

  set fontFamily(value) {
    this._fontFamily = value;
    this.div.style.fontFamily = value;
  }

  set fontSize(value) {
    this._fontSize = value;
    this.div.style.fontSize = value;
  }

  set lineHeight(value) {
    this._fontSize = value;
    this.div.style.lineHeight = value;
  }

  set bg_image(value) {
    this._bg_image = value;
    let that =  this;
    if(value!="") {
      let reader = new FileReader();
      reader.onload = (function() {
        return function(e) {
          let img = new Image();
          img.onload = function() {
            that.canvas.width = img.width;
            that.canvas.height = img.height;
            that.div.style.height = img.height;
            that.ctx.drawImage(img, 0, 0);
          };
          img.src = e.target.result;
        };
      })();
      reader.readAsDataURL(value);
    }
  }
  
  fileSelect(tgt) {
    let files = tgt.files;
    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*')) { // Only process image files.
        continue;
      }
      this.bg_image=f;
    }
  }
  // updateFontfamily();
  
};

class Pane {
  static families = ["Serif", "Sans-Serif", "Monospace", "Tahoma",
     "Verdana", "Lucida Sans Unicode", "Arial", "Arial Black", "Calibri",
    "Comic Sans MS", "Courier new", "Impact", "Libre Baskerville",
    "Martel Sans", "Unifraktur Cook"];
  
  constructor(id, tgt) {
    this.div = document.getElementById(id);
    this.id = id;
    this.tgt = tgt;
  }
};

front = new Face("front", "", "100mm", "131mm","20mm");
back = new Face("back", "", "100mm", "131mm","10mm");
side = new Face("side", "Book Title", "20mm", "131mm","20mm");

function showBlock(dst) {
  var doc = document.getElementById(dst);
  document.getElementById('back-tab').style.display = "none";
  document.getElementById('center-tab').style.display = "none";
  document.getElementById('front-tab').style.display = "none";
  doc.style.display = "block";
  tablinks = document.getElementsByClassName("w3-bar-item");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
}
