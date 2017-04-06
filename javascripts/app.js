class RocketReadability {

  constructor() {
    this.init();
  }

  init() {
    this.initParsedArticle();
    this.showParsedArticle();
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
        <h1>${this.article.title}</h1>
        <p>${this.article.content}</p>
      </div>
    `

    // Remove alll or most stylesheets.
    document.head.outerHTML = ''

    // Assign the template to the body.
    document.body.innerHTML = template;

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
