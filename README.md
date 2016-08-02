# tape-reel

[![Circle CI](https://img.shields.io/circleci/project/redsift/tape-reel.svg?style=flat-square)](https://circleci.com/gh/redsift/tape-reel)
[![npm](https://img.shields.io/npm/v/@redsift/tape-reel.svg?style=flat-square)](https://www.npmjs.com/package/@redsift/tape-reel)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/redsift/tape-reel/master/LICENSE)

Simple [tape](https://github.com/substack/tape) wrapper to better integrate server side JSDOM testing and CircleCI.

## Usage

Where you typically use Tape e.g.

    var tape = require("tape");

Simply

    var tape = require("@redsift/tape-reel")("<div id='test'></div>");

The HTML sets the JSDOM for environment for each test invocation. This document is provided in the global scope for easy integration with browser JavaScript components and passed as the second parameter to the function under test.

## Features

Compared to a naked Tape setup, this wrapper provides the following pre-configurations:

1. Setup and teardown a fresh JSDOM for each test.
1. When run on CircleCI, produce a JUnit.xml compatible output in `$CIRCLE_TEST_REPORTS/junit/junit.xml`.
1. When not run on CircleCI, pretty print with tap-diff and dump the DOM for failing tests. You may manually get a string representation of the DOM using `tape.dumpJSDOM(document)`.

## Options

    var tape = require("@redsift/tape-reel")(JSDOM-HTML, SUPRESS-DOM, REPORT-NAME);

Parameter|Purpose|Default
---------|-------|-------
`JSDOM-HTML`|May be null if no JSDOM environment is required|`null`
`SUPRESS-DOM`|By default, a failing test will dump the state of the DOM|`false`
`REPORT-NAME`|Names the test report when generating `junit.xml` files on CircleCI|`junit`

## Known Issues

Currently, `REPORT-NAME` does not produce multiple junit.xml files due to a bug in the imported `tap-xunit` module.