# tape-reel

Simple [tape](https://github.com/substack/tape) wrapper to better integrate server side JSDOM testing and CircleCI.

## Usage

Where you typically use Tape e.g.

	var tape = require("tape");
	
Simply

	var tape = require("tape-reel")("<div id='test'></div>");

The HTML sets the JSDOM for environment for each test invocation. This document is provided in the global scope for easy integration with browser Javascript components and passed as the second parameter to the function under test.

## Features

Compared to a naked Tape setup, this wrapper provides the following pre-configurations:

1. Setup and teardown a fresh JSDOM for each test.
2. When run on CircleCI, produce a JUnit.xml comptabile output in `$CIRCLE_TEST_REPORTS/junit/junit.xml`.
3. When not run on CircleCI, pretty print with tap-diff and dump the DOM for failing tests. You may manually get a string representation of the DOM using `tape.dumpJSDOM(document)`.