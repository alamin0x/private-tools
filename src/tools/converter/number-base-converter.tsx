import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

type Base = 2 | 8 | 10 | 16;

const baseNames: Record<Base, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal",
};

const basePatterns: Record<Base, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

function isValidForBase(value: string, base: Base): boolean {
  if (!value) return true;
  return basePatterns[base].test(value);
}

function convertBase(value: string, fromBase: Base, toBase: Base): string {
  if (!value) return "";
  const decimal = parseInt(value, fromBase);
  if (isNaN(decimal)) return "";
  return decimal.toString(toBase).toUpperCase();
}

export default function NumberBaseConverter() {
  const [inputValue, setInputValue] = useState("255");
  const [inputBase, setInputBase] = useState<Base>(10);
  const [error, setError] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value && !isValidForBase(value, inputBase)) {
      setError(
        `Invalid input for ${baseNames[inputBase]} (base ${inputBase})`
      );
    } else {
      setError("");
    }
  };

  const handleBaseChange = (base: Base) => {
    setInputBase(base);
    if (inputValue && !isValidForBase(inputValue, base)) {
      setError(`Invalid input for ${baseNames[base]} (base ${base})`);
    } else {
      setError("");
    }
  };

  const isValid = inputValue !== "" && isValidForBase(inputValue, inputBase);

  const results: { base: Base; label: string; value: string }[] = [
    {
      base: 2,
      label: "Binary (Base 2)",
      value: isValid ? convertBase(inputValue, inputBase, 2) : "",
    },
    {
      base: 8,
      label: "Octal (Base 8)",
      value: isValid ? convertBase(inputValue, inputBase, 8) : "",
    },
    {
      base: 10,
      label: "Decimal (Base 10)",
      value: isValid ? convertBase(inputValue, inputBase, 10) : "",
    },
    {
      base: 16,
      label: "Hexadecimal (Base 16)",
      value: isValid ? convertBase(inputValue, inputBase, 16) : "",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Number Base Converter"
        description="Convert numbers between binary, octal, decimal, and hexadecimal"
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a number"
          />
          <select
            value={inputBase}
            onChange={(e) => handleBaseChange(Number(e.target.value) as Base)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {([2, 8, 10, 16] as Base[]).map((base) => (
              <option key={base} value={base}>
                {baseNames[base]} (Base {base})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-3">
        {results.map(({ base, label, value }) => (
          <div
            key={base}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              base === inputBase
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <span className="text-sm font-medium text-gray-700 w-40">
              {label}
            </span>
            <span className="flex-1 font-mono text-sm text-gray-900 break-all">
              {value || "—"}
            </span>
            {value && <CopyButton text={value} />}
          </div>
        ))}
      </div>
    </div>
  );
}
