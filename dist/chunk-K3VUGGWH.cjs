"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-card-activation.ts
var _stack = require('@epicbagel/saas-kit/primitives/stack');



var _react = require('react');
var INTERACTIVE_DESCENDANT = "button, a, input, select, textarea, [role='button'], [role='link']";
function shouldActivateCandidateCard(event) {
  if (!(event.target instanceof Element)) return true;
  const nestedControl = event.target.closest(INTERACTIVE_DESCENDANT);
  return nestedControl == null || nestedControl === event.currentTarget;
}
var CandidateCardRoot = _react.forwardRef.call(void 0,
  function CandidateCardRoot2({ onCardClick, role, tabIndex, ...props }, ref) {
    return _react.createElement.call(void 0, _stack.Stack, { ref, role, tabIndex, ...props, onClick: onCardClick });
  }
);
function candidateCardSelectProps(onSelect, handlers = {}) {
  return {
    role: "button",
    tabIndex: 0,
    onCardClick: (event) => {
      _optionalChain([handlers, 'access', _ => _.onCardClick, 'optionalCall', _2 => _2(event)]);
      if (!event.defaultPrevented && shouldActivateCandidateCard(event)) onSelect();
    },
    onKeyDown: (event) => {
      _optionalChain([handlers, 'access', _3 => _3.onKeyDown, 'optionalCall', _4 => _4(event)]);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    }
  };
}





exports.shouldActivateCandidateCard = shouldActivateCandidateCard; exports.CandidateCardRoot = CandidateCardRoot; exports.candidateCardSelectProps = candidateCardSelectProps;
