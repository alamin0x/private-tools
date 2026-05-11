import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

type CssUnit = "px" | "rem" | "em" | "pt" | "vw" | "vh";

const cssUnits: CssUnit[] = ["px", "rem", "em", "pt", "vw", "vh"];

function toPx(
  value: number,
  unit: CssUnit,
  baseFontSize: number,
  viewportWidth: number,
  viewportHeight: number
): number {
  switch (unit) {
    case "px":
      return value;
    case "rem":
      return value * baseFontSize;
    case "em":
      return value * baseFontSize;
    case "pt":
      return value * (96 / 72);
    case "vw":
      return (value / 100) * viewportWidth;
    case "vh":
      return (value / 100) * viewportHeight;
  }
}

function fromPx(
  px: number,
  unit: CssUnit,
  baseFontSize: number,
  viewportWidth: number,
  viewportHeight: number
): number {
  switch (unit) {
    case "px":
      return px;
    case "rem":
      return px / baseFontSize;
    case "em":
      return px / baseFontSize;
    case "pt":
      return px / (96 / 72);
    case "vw":
      return (px / viewportWidth) * 100;
    case "vh":
      return (px / viewportHeight) * 100;
  }
}

function getFormula(from: CssUnit, to: CssUnit, baseFontSize: number, viewportWidth: number, viewportHeight: number): string {
  if (from === to) return "No conversion needed";

  const toPixel = (unit: CssUnit): string => {
    switch (unit) {
      case "px": return "value";
      case "rem": return `value * ${baseFontSize} (base font size)`;
      case "em": return `value * ${baseFontSize} (base font size)`;
      case "pt": return "value * (96 / 72)";
      case "vw": return `value / 100 * ${viewportWidth} (viewport width)`;
      case "vh": return `value / 100 * ${viewportHeight} (viewport height)`;
    }
  };

  const fromPixel = (unit: CssUnit): string => {
    switch (unit) {
      case "px": return "px";
      case "rem": return `px / ${baseFontSize} (base font size)`;
      case "em": return `px / ${baseFontSize} (base font size)`;
      case "pt": return "px / (96 / 72)";
      case "vw": return `px / ${viewportWidth} * 100 (viewport width)`;
      case "vh": return `px / ${viewportHeight} * 100 (viewport height)`;
    }
  };

  if (to === "px") return `${from} to px: ${toPixel(from)}`;
  if (from === "px") return `px to ${to}: ${fromPixel(to)}`;
  return `${from} to px: ${toPixel(from)}, then px to ${to}: ${fromPixel(to)}`;
}

export default function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<CssUnit>("px");
  const [toUnit, setToUnit] = useState<CssUnit>("rem");
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [viewportWidth, setViewportWidth] = useState("1920");
  const [viewportHeight, setViewportHeight] = useState("1080");

  const numValue = parseFloat(value);
  const numBase = parseFloat(baseFontSize) || 16;
  const numVw = parseFloat(viewportWidth) || 1920;
  const numVh = parseFloat(viewportHeight) || 1080;

  const pxValue = !isNaN(numValue)
    ? toPx(numValue, fromUnit, numBase, numVw, numVh)
    : NaN;
  const result = !isNaN(pxValue)
    ? fromPx(pxValue, toUnit, numBase, numVw, numVh)
    : NaN;

  const resultStr = !isNaN(result)
    ? parseFloat(result.toFixed(6)).toString()
    : "";

  const formula = getFormula(fromUnit, toUnit, numBase, numVw, numVh);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="CSS Unit Converter"
        description="Convert between CSS units like px, rem, em, pt, vw, and vh"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as CssUnit)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cssUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as CssUnit)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cssUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Font Size (px)
          </label>
          <input
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Viewport Width (px)
          </label>
          <input
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Viewport Height (px)
          </label>
          <input
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {resultStr && (
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-blue-900">
              {value} {fromUnit} = {resultStr} {toUnit}
            </p>
            <CopyButton text={`${resultStr}${toUnit}`} />
          </div>
          <p className="text-sm text-blue-700">
            <span className="font-medium">Formula:</span> {formula}
          </p>
        </div>
      )}
    </div>
  );
}
