// TradingViewWidget.jsx
"use client";
import React, { useEffect, useRef, memo } from 'react';

function TradingViewNewsWidget({ symbol }) {
  let mounted = false; // useEffect was triggering twice in dev mode
  const container = useRef(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
      {
        "feedMode": "symbol",
        "symbol": "${symbol}",
        "colorTheme": "light",
        "isTransparent": false,
        "displayMode": "regular",
        "width": "480",
        "height": 830,
        "locale": "en"
      }
      `;
      if (!mounted) container.current.appendChild(script);
      mounted = true;
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewNewsWidget);