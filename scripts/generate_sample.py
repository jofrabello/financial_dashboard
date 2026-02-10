#!/usr/bin/env python3
"""Generate realistic sample data for local development when yfinance is unavailable."""

import json
import math
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

INSTRUMENTS = {
    "coreBenchmarks": [
        {"symbol": "^GSPC", "name": "S&P 500", "base": 6025.99, "vol": 0.012},
        {"symbol": "^IXIC", "name": "NASDAQ Composite", "base": 19654.02, "vol": 0.015},
        {"symbol": "^RUT", "name": "Russell 2000", "base": 2279.71, "vol": 0.014},
    ],
    "fearCreditGauges": [
        {"symbol": "^VIX", "name": "VIX (Fear Gauge)", "base": 16.54, "vol": 0.04},
        {"symbol": "^TNX", "name": "10-Year Treasury Yield", "base": 4.49, "vol": 0.02},
        {"symbol": "DX-Y.NYB", "name": "U.S. Dollar Index", "base": 107.58, "vol": 0.005},
    ],
    "sectorInternals": [
        {"symbol": "RSP", "name": "Equal Weight S&P 500", "base": 176.42, "vol": 0.011},
        {"symbol": "HYG", "name": "High Yield Corporate Bond ETF", "base": 78.91, "vol": 0.004},
        {"symbol": "XLK", "name": "Technology Select Sector", "base": 235.18, "vol": 0.014},
        {"symbol": "XLP", "name": "Consumer Staples Select Sector", "base": 82.07, "vol": 0.007},
    ],
    "macroCommodities": [
        {"symbol": "GC=F", "name": "Gold", "base": 2886.70, "vol": 0.01},
        {"symbol": "SI=F", "name": "Silver", "base": 32.15, "vol": 0.015},
        {"symbol": "CL=F", "name": "Crude Oil", "base": 71.03, "vol": 0.02},
        {"symbol": "BTC-USD", "name": "Bitcoin", "base": 97482.0, "vol": 0.03},
    ],
}


def generate_history(base: float, vol: float) -> list[dict]:
    points = []
    value = base * 0.88
    now = datetime(2026, 2, 10)
    for i in range(365, -1, -1):
        date = now - timedelta(days=i)
        if date.weekday() >= 5:
            continue
        daily = (random.random() - 0.47) * vol * value
        value = max(value * 0.7, value + daily)
        points.append({"date": date.strftime("%Y-%m-%d"), "close": round(value, 2)})
    return points


def main():
    output_dir = Path(__file__).parent.parent / "src" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    data = {
        "lastUpdated": "2026-02-10T01:00:00.000000Z",
        "categories": {},
        "ratios": {},
    }

    for category, instruments in INSTRUMENTS.items():
        cat_data = []
        for inst in instruments:
            hist = generate_history(inst["base"], inst["vol"])
            last = hist[-1]["close"]
            prev = hist[-2]["close"]
            change = round(last - prev, 2)
            pct = round(change / prev * 100, 2)
            cat_data.append({
                "symbol": inst["symbol"],
                "name": inst["name"],
                "value": last,
                "change": change,
                "changePercent": pct,
                "dayHigh": round(last * 1.005, 2),
                "dayLow": round(last * 0.995, 2),
                "yearHigh": round(max(p["close"] for p in hist), 2),
                "yearLow": round(min(p["close"] for p in hist), 2),
                "history": hist,
            })
        data["categories"][category] = cat_data

    # Compute ratios
    xlk_hist = {p["date"]: p["close"] for cat in data["categories"].values() for inst in cat for p in inst["history"] if inst["symbol"] == "XLK"}
    xlp_hist = {p["date"]: p["close"] for cat in data["categories"].values() for inst in cat for p in inst["history"] if inst["symbol"] == "XLP"}
    rsp_hist = {p["date"]: p["close"] for cat in data["categories"].values() for inst in cat for p in inst["history"] if inst["symbol"] == "RSP"}
    spx_hist = {p["date"]: p["close"] for cat in data["categories"].values() for inst in cat for p in inst["history"] if inst["symbol"] == "^GSPC"}

    tech_vs_staples = []
    for date in sorted(set(xlk_hist.keys()) & set(xlp_hist.keys())):
        if xlp_hist[date] != 0:
            tech_vs_staples.append({"date": date, "value": round(xlk_hist[date] / xlp_hist[date], 4)})

    ew_vs_sp = []
    for date in sorted(set(rsp_hist.keys()) & set(spx_hist.keys())):
        if spx_hist[date] != 0:
            ew_vs_sp.append({"date": date, "value": round(rsp_hist[date] / spx_hist[date], 4)})

    data["ratios"]["techVsStaples"] = tech_vs_staples
    data["ratios"]["equalWeightVsSP500"] = ew_vs_sp

    with open(output_dir / "generated.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"Sample data written to {output_dir / 'generated.json'}")


if __name__ == "__main__":
    main()
