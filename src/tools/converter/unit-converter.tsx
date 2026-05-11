import { useState } from "react";
import ToolHeader from "@/components/tool-header";

type Category = "Length" | "Weight" | "Temperature" | "Speed" | "Data Storage";

const units: Record<Category, string[]> = {
  Length: ["mm", "cm", "m", "km", "inch", "foot", "yard", "mile"],
  Weight: ["mg", "g", "kg", "lb", "oz", "ton"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Speed: ["m/s", "km/h", "mph", "knots"],
  "Data Storage": ["bytes", "KB", "MB", "GB", "TB"],
};

const lengthToMeters: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

const weightToGrams: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  lb: 453.592,
  oz: 28.3495,
  ton: 907185,
};

const speedToMs: Record<string, number> = {
  "m/s": 1,
  "km/h": 1 / 3.6,
  mph: 0.44704,
  knots: 0.514444,
};

const dataToBytes: Record<string, number> = {
  bytes: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

function convertTemperature(
  value: number,
  from: string,
  to: string
): number {
  if (from === to) return value;

  let celsius: number;
  switch (from) {
    case "Fahrenheit":
      celsius = (value - 32) * (5 / 9);
      break;
    case "Kelvin":
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  switch (to) {
    case "Fahrenheit":
      return celsius * (9 / 5) + 32;
    case "Kelvin":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

function convert(
  value: number,
  from: string,
  to: string,
  category: Category
): number {
  if (from === to) return value;

  switch (category) {
    case "Length":
      return (value * lengthToMeters[from]) / lengthToMeters[to];
    case "Weight":
      return (value * weightToGrams[from]) / weightToGrams[to];
    case "Temperature":
      return convertTemperature(value, from, to);
    case "Speed":
      return (value * speedToMs[from]) / speedToMs[to];
    case "Data Storage":
      return (value * dataToBytes[from]) / dataToBytes[to];
    default:
      return value;
  }
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState(units["Length"][0]);
  const [toUnit, setToUnit] = useState(units["Length"][2]);
  const [fromValue, setFromValue] = useState("1");

  const numericValue = parseFloat(fromValue);
  const result = isNaN(numericValue)
    ? ""
    : convert(numericValue, fromUnit, toUnit, category).toPrecision(10).replace(/\.?0+$/, "");

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory][0]);
    setToUnit(units[newCategory][1]);
    setFromValue("1");
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) {
      setFromValue(result);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Unit Converter"
        description="Convert between different units of measurement"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value as Category)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(units).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full space-y-2">
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {units[category].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          aria-label="Swap units"
        >
          ⇄
        </button>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={result}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            placeholder="Result"
          />
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {units[category].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-lg font-medium text-blue-900">
            {fromValue} {fromUnit} = {result} {toUnit}
          </p>
        </div>
      )}
    </div>
  );
}
