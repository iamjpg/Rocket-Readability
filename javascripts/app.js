class RocketReadability {

  constructor() {
    this.init();
  }

  init() {
    this.initParsedArticle();
    this.showParsedArticle();
    this.setInitialMode();
    this.setEventListeners();
  }

  createElement(options) {
    var el = document.createElement(options.type.toUpperCase());
    el.id = options.id || '';
    el.className = options.className || '';
    el.innerHTML = options.innerHTML || '';
    return el;
  }

  initParsedArticle() {
    var self = this;
    var loc = document.location;
    var uri = {
      spec: loc.href,
      host: loc.host,
      prePath: loc.protocol + "//" + loc.host,
      scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
      pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };
    self.article = new Readability(uri, document).parse();
  }

  showParsedArticle() {
    if (this.article === null) {
      var sadHorn = this.createElement({
        type: 'DIV',
        id: 'readability-message',
        innerHTML: `<div>Sorry but we couldn't parse this page :( - Rocket Readability</div>`
      })

      // Append the button to the body
      document.body.appendChild(sadHorn);

      setTimeout(function() {
        document.querySelector('#readability-message').outerHTML = '';
        window.location = window.location;
      }, 5000);
      return false;
    }

    // Remove everything.
    document.body.outerHTML = '';

    // Small template for ReadabilityJS output.
    var template = `
      <div id="readability-container">
        <div id="readability-options-cog"></div>
        <div id="readability-options">
          <strong>Choose Reading Mode</strong><br />
          <div>
            <label><input type="radio" name="mode" value="default">Default</label> &nbsp; &nbsp; <label><input type="radio" name="mode" value="sepia">Sepia</label> &nbsp; &nbsp; <label><input type="radio" name="mode" value="grey">Grey</label> &nbsp; &nbsp; <label><input type="radio" name="mode" value="night">Night</label>
          </div>
        </div>
        <h1>${this.toTitleCase(this.article.title)}</h1>
        <p>${this.article.content}</p>
      </div>
    `

    // Remove alll or most stylesheets.
    document.head.outerHTML = ''

    // Assign the template to the body.
    document.body.innerHTML = template;

  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  setReadingMode(name) {
    document.body.className = name
    chrome.storage.sync.set({mode: name});
    document.querySelector(`input[value="${name}"]`).checked = true
  }

  setInitialMode() {
    const self = this;
    chrome.storage.sync.get(['mode'], function(result) {
      let selectedMode = result.mode
      if (selectedMode) {
        self.setReadingMode(selectedMode);
      } else {
        self.setReadingMode('default');
      }
    });
  }

  setEventListeners() {
    const self = this;
    const elem = document.querySelector('#readability-options')
    document.addEventListener('click', function(e) {
      if (e.target.name && e.target.name === 'mode') {
        self.setReadingMode(e.target.value);
        return false;
      }
      if (e.target.id === 'readability-options-cog') {
        if (elem.style.display === 'block') {
          elem.style.display = 'none';
        } else {
          elem.style.display = 'block';
        }
        
      }
    })
  }

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var rr;
  if (document.querySelector('#readability-container') === null) {
    rr = new RocketReadability();
  } else {
    window.location = window.location;
  }
})

// var rr = new RocketReadability();
