var xunit = require("tap-xunit"),
    jsdom = require("jsdom"),
    html = require("html"),
    pretty = require("tap-diff"),
    fs = require("fs");
        
function _setupReporting(tape, name) {
    // var _name = name || 'junit';
    var _name = 'junit';
    
    if (process.env.CIRCLE_TEST_REPORTS) {
        // Pretty errors on CircleCI
        var path = process.env.CIRCLE_TEST_REPORTS + '/junit';
        try {
            fs.mkdirSync(path);
        } catch (e) {
            if (e.code !== 'EEXIST') throw e;
            // ignore, just use the path
        }

    
        var wstream = fs.createWriteStream(path + '/' + _name + '.xml');
        tape.createStream().pipe(xunit({ package: name || ''})).pipe(wstream);
    } else {
        // Pretty errors on Console
        tape.createStream().pipe(pretty({})).pipe(process.stdout);
    }
}

function _dumpJSDOM(document) {
    return html.prettyPrint(jsdom.serializeDocument(document), {indent_size: 2});
}

function _reel(tape, pre, post) {

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

module.exports = function reel(body, supressDOM, name) {
    // Hack to ensure multiple loads of the tape dependency do not end up 
    // causing tests to get appended across instances
    delete require.cache[require.resolve("tape")];
    
    var tape = tape = require("tape");
  
    _setupReporting(tape, name);

    function pre() {
        var document = null;
        if (body != null) {
            document = jsdom.jsdom(body);
            global.document = document;
        }
        return document;
    }

    function post(t, document) {
        if (document == null) return;
        
        delete global.document;
        
        if (t._ok || process.env.CI || supressDOM) return;

        console.log(_dumpJSDOM(document));
    }
    
    return _reel(tape, pre, post);
}