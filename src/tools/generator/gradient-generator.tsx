"use client";

import { useState, useCallback, useMemo } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const PRESETS = [
  { name: "Sunset", stops: [{ color: "#ff512f", position: 0 }, { color: "#dd2476", position: 100 }], type: "linear" as const, angle: 135 },
  { name: "Ocean", stops: [{ color: "#2193b0", position: 0 }, { color: "#6dd5ed", position: 100 }], type: "linear" as const, angle: 90 },
  { name: "Forest", stops: [{ color: "#134e5e", position: 0 }, { color: "#71b280", position: 100 }], type: "linear" as const, angle: 45 },
  { name: "Purple Haze", stops: [{ color: "#7b4397", position: 0 }, { color: "#dc2430", position: 100 }], type: "linear" as const, angle: 180 },
  { name: "Warm Flame", stops: [{ color: "#ff9a9e", position: 0 }, { color: "#fecfef", position: 50 }, { color: "#fecfef", position: 100 }], type: "linear" as const, angle: 45 },
  { name: "Night Sky", stops: [{ color: "#141e30", position: 0 }, { color: "#243b55", position: 100 }], type: "radial" as const, angle: 0 },
];

let stopIdCounter = 0;
function createStop(color: string, position: number): ColorStop {
  return { id: `stop-${++stopIdCounter}`, color, position };
}

export default function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    createStop("#667eea", 0),
    createStop("#764ba2", 100),
  ]);

  const gradientCSS = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
    return `radial-gradient(circle, ${stopsStr})`;
  }, [type, angle, stops]);

  const cssCode = `background: ${gradientCSS};`;

  const addStop = useCallback(() => {
    if (stops.length >= 10) return;
    const newPosition = 50;
    setStops([...stops, createStop("#ffffff", newPosition)]);
  }, [stops]);

  const removeStop = useCallback((id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  }, [stops]);

  const updateStop = useCallback((id: string, field: "color" | "position", value: string | number) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, [stops]);

  const applyPreset = useCallback((preset: typeof PRESETS[number]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s) => createStop(s.color, s.position)));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Gradient Generator"
        description="Create CSS gradients with a visual editor."
      />

      <div
        className="w-full h-48 rounded-lg border shadow-inner"
        style={{ background: gradientCSS }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1.5 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "linear" | "radial")}
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {type === "linear" && (
            <div>
              <label className="block text-sm font-medium mb-1">Angle: {angle}deg</label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Color Stops</span>
            <button
              onClick={addStop}
              disabled={stops.length >= 10}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Stop
            </button>
          </div>
          {stops.map((stop) => (
            <div key={stop.id} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                className="w-20 border rounded px-2 py-1 text-sm"
              />
              <span className="text-xs text-gray-500">%</span>
              <button
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                className="text-red-500 hover:text-red-700 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">CSS Code</span>
            <CopyButton text={cssCode} className="text-sm" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
            <code className="text-sm break-all font-mono">{cssCode}</code>
          </div>
        </div>
      </div>
    </div>
  );
}