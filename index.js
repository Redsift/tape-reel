var tape = require("tape"),
    jsdom = require("jsdom"),
    html = require("html"),
    xunit = require("tap-xunit"),
    pretty = require("tap-diff"),
    fs = require("fs");
        
function _setupReporting() {
    if (process.env.CIRCLE_TEST_REPORTS) {
        // Pretty errors on CircleCI
        var path = process.env.CIRCLE_TEST_REPORTS + '/junit';
        fs.mkdirSync(path);
        var wstream = fs.createWriteStream(path + '/junit.xml');
        tape.createStream().pipe(xunit({})).pipe(wstream);
    } else {
        // Pretty errors on Console
        tape.createStream().pipe(pretty({})).pipe(process.stdout);
    }
}

function _dumpJSDOM(document) {
    return html.prettyPrint(jsdom.serializeDocument(document), {indent_size: 2});
}

function _reel(pre, post) {

  function testCase(test, name, options, cb) {
    var opts = {};
      
    if (arguments.length === 3 && typeof options === 'function') {
      cb = options;
    } else {
        opts = options;
    }
    
    test(name, opts, function (t) {
        var args = pre(t);
        if (!Array.isArray(args)) args = [ args ];
        
        t.on('end', function() {
            post.apply(null, [t].concat(args));
        })
        
        try {
            cb.apply(null, [t].concat(args));
        }
        catch (e) {
            t.end(e);
            throw e;
        }
    });
  }

  var _t = testCase.bind(null, tape);
  _t.only = testCase.bind(null, tape.only);
  _t.ignore = function () {};
  _t.dumpJSDOM = _dumpJSDOM;
  
  return _t;
}

_setupReporting();

module.exports = function reel(body, supressDOM) {
    function pre() {
        var document = global.document = jsdom.jsdom(body);
        
        return document;
    }

    function post(t, document) {
        delete global.document;
        
        if (t._ok || process.env.CI || supressDOM) return;

        console.log(_dumpJSDOM(document));
    }
    
    return _reel(pre, post);
}