#!/usr/bin/env python3
"""Fetch market data from Yahoo Finance and generate JSON for the dashboard."""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

import yfinance as yf

TICKERS = {
    "coreBenchmarks": [
        {"symbol": "^GSPC", "name": "S&P 500"},
        {"symbol": "^IXIC", "name": "NASDAQ Composite"},
        {"symbol": "^RUT", "name": "Russell 2000"},
    ],
    "fearCreditGauges": [
        {"symbol": "^VIX", "name": "VIX (Fear Gauge)"},
        {"symbol": "^TNX", "name": "10-Year Treasury Yield"},
        {"symbol": "DX-Y.NYB", "name": "U.S. Dollar Index"},
    ],
    "sectorInternals": [
        {"symbol": "RSP", "name": "Equal Weight S&P 500"},
        {"symbol": "HYG", "name": "High Yield Corporate Bond ETF"},
        {"symbol": "XLK", "name": "Technology Select Sector"},
        {"symbol": "XLP", "name": "Consumer Staples Select Sector"},
    ],
    "macroCommodities": [
        {"symbol": "GC=F", "name": "Gold"},
        {"symbol": "SI=F", "name": "Silver"},
        {"symbol": "CL=F", "name": "Crude Oil"},
        {"symbol": "BTC-USD", "name": "Bitcoin"},
    ],
}


def fetch_instrument(symbol: str, name: str) -> dict | None:
    """Fetch current quote and 1-year history for a single instrument."""
    try:
        ticker = yf.Ticker(symbol)

        # Get current info
        info = ticker.fast_info
        hist = ticker.history(period="1y")

        if hist.empty:
            print(f"  WARNING: No history for {symbol}", file=sys.stderr)
            return None

        last_close = float(hist["Close"].iloc[-1])
        prev_close = float(hist["Close"].iloc[-2]) if len(hist) > 1 else last_close
        change = last_close - prev_close
        change_pct = (change / prev_close * 100) if prev_close != 0 else 0

        day_high = float(hist["High"].iloc[-1])
        day_low = float(hist["Low"].iloc[-1])
        year_high = float(hist["High"].max())
        year_low = float(hist["Low"].min())

        # Build history points
        history = []
        for date, row in hist.iterrows():
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": round(float(row["Close"]), 2),
            })

        return {
            "symbol": symbol,
            "name": name,
            "value": round(last_close, 2),
            "change": round(change, 2),
            "changePercent": round(change_pct, 2),
            "dayHigh": round(day_high, 2),
            "dayLow": round(day_low, 2),
            "yearHigh": round(year_high, 2),
            "yearLow": round(year_low, 2),
            "history": history,
        }
    except Exception as e:
        print(f"  ERROR fetching {symbol}: {e}", file=sys.stderr)
        return None


def compute_ratio(data: dict, numerator_sym: str, denominator_sym: str) -> list[dict]:
    """Compute a price ratio between two instruments using their histories."""
    num_hist = None
    den_hist = None

    for cat in data["categories"].values():
        for inst in cat:
            if inst["symbol"] == numerator_sym:
                num_hist = {p["date"]: p["close"] for p in inst["history"]}
            if inst["symbol"] == denominator_sym:
                den_hist = {p["date"]: p["close"] for p in inst["history"]}

    if not num_hist or not den_hist:
        return []

    ratio = []
    for date in sorted(set(num_hist.keys()) & set(den_hist.keys())):
        if den_hist[date] != 0:
            ratio.append({
                "date": date,
                "value": round(num_hist[date] / den_hist[date], 4),
            })
    return ratio


def main():
    output_dir = Path(__file__).parent.parent / "src" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "generated.json"

    print("Fetching market data from Yahoo Finance...")

    data = {
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "categories": {},
        "ratios": {},
    }

    success = True
    for category, instruments in TICKERS.items():
        print(f"\n[{category}]")
        category_data = []
        for inst in instruments:
            print(f"  Fetching {inst['symbol']} ({inst['name']})...")
            result = fetch_instrument(inst["symbol"], inst["name"])
            if result:
                category_data.append(result)
            else:
                success = False
        data["categories"][category] = category_data

    # If most fetches failed, fall back to sample generator
    total = sum(len(v) for v in data["categories"].values())
    if total < 5:
        print("\nToo many fetch failures. Falling back to sample data generator...")
        import subprocess
        subprocess.run([sys.executable, str(Path(__file__).parent / "generate_sample.py")])
        return

    # Compute ratios
    print("\nComputing ratios...")
    data["ratios"]["techVsStaples"] = compute_ratio(data, "XLK", "XLP")
    data["ratios"]["equalWeightVsSP500"] = compute_ratio(data, "RSP", "^GSPC")

    # Write output
    with open(output_file, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\nData written to {output_file}")
    print(f"Last updated: {data['lastUpdated']}")


if __name__ == "__main__":
    main()
