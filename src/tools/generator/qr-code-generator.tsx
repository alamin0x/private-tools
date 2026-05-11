"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import QRCode from "qrcode";
import ToolHeader from "@/components/tool-header";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!text || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        margin: 2,
      });
      setGenerated(true);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }, [text, size, fgColor, bgColor]);

  useEffect(() => {
    if (generated && text) {
      const generate = async () => {
        if (!canvasRef.current) return;
        try {
          await QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            color: {
              dark: fgColor,
              light: bgColor,
            },
            margin: 2,
          });
        } catch (err) {
          console.error("QR generation failed:", err);
        }
      };
      generate();
    }
  }, [size, fgColor, bgColor, text, generated]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="QR Code Generator"
        description="Generate QR codes from text or URLs."
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Text or URL</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={512}>512px</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm font-mono">{fgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm font-mono">{bgColor}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!text}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate QR Code
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className={generated ? "" : "hidden"} />
        {generated && (
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors font-medium"
          >
            Download PNG
          </button>
        )}
      </div>
    </div>
  );
}