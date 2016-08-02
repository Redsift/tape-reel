var tape = require("../")("<div id='test'></div>");
var tapeNull = require("../")(null, false, 'null');

tape("test() has a document", function(t, document) {
    t.notEqual(document, undefined, 'JSDOM is undefined');
    t.notEqual(document, null, 'JSDOM is null');
    
    var html = tape.dumpJSDOM(document);
    t.notEqual(html.length, 0, 'HTML in document');
    
    t.notEqual(html.indexOf('test'), -1, 'div in document');
    
    t.end();
});

function _junk(t) {
    junk
}

tape("test() skip works", { skip: true }, function(t, document) {
    _junk();
});

tapeNull('test() works without dom element', function(t, document){
  t.equal('test', 'test');
  t.end();
})

