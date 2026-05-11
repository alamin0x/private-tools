import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const updateFromHex = (value: string) => {
    setHex(value);
    const rgbVal = hexToRgb(value);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbVal = hslToRgb(h, s, l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  const hexString = hex.toUpperCase();
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Color Converter"
        description="Convert colors between HEX, RGB, and HSL formats"
      />

      <div className="flex flex-col items-center gap-4">
        <input
          type="color"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-20 h-20 cursor-pointer rounded-lg border-0"
        />
        <div
          className="w-full h-24 rounded-lg border border-gray-200"
          style={{ backgroundColor: hex }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="w-12 text-sm font-medium text-gray-700">HEX</label>
          <input
            type="text"
            value={hexString}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CopyButton text={hexString} />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-12 text-sm font-medium text-gray-700">RGB</label>
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              min={0}
              max={255}
              value={rgb.r}
              onChange={(e) =>
                updateFromRgb(Number(e.target.value), rgb.g, rgb.b)
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="R"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={rgb.g}
              onChange={(e) =>
                updateFromRgb(rgb.r, Number(e.target.value), rgb.b)
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="G"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={rgb.b}
              onChange={(e) =>
                updateFromRgb(rgb.r, rgb.g, Number(e.target.value))
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="B"
            />
          </div>
          <CopyButton text={rgbString} />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-12 text-sm font-medium text-gray-700">HSL</label>
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) =>
                updateFromHsl(Number(e.target.value), hsl.s, hsl.l)
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="H"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) =>
                updateFromHsl(hsl.h, Number(e.target.value), hsl.l)
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="S"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) =>
                updateFromHsl(hsl.h, hsl.s, Number(e.target.value))
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="L"
            />
          </div>
          <CopyButton text={hslString} />
        </div>
      </div>
    </div>
  );
}
