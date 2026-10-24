"use strict";Object.defineProperty(exports, "__esModule", {value: true});// vendor/core/files/src/lib/utils.ts
var _clsx = require('clsx');
var _tailwindmerge = require('tailwind-merge');
function cn(...inputs) {
  return _tailwindmerge.twMerge.call(void 0, _clsx.clsx.call(void 0, inputs));
}



exports.cn = cn;
