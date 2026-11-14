"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/dictation-support.ts
var _usedictation = require('@epicbagel/saas-kit/hooks/use-dictation');
var _react = require('react');
function useDictationSupport() {
  const { supported } = _usedictation.useDictation.call(void 0, );
  const [known, setKnown] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => setKnown(true), []);
  return known ? supported : null;
}



exports.useDictationSupport = useDictationSupport;
