"use client";

import { useState, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "var(--color-destructive)", width: "w-1/4" };
  if (score <= 3) return { label: "Fair", color: "var(--color-warning)", width: "w-2/4" };
  if (score <= 4) return { label: "Good", color: "var(--color-warning)", width: "w-3/4" };
  return { label: "Strong", color: "var(--color-success)", width: "w-full" };
}

function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options;
  let charset = "";
  if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((val) => charset[val % charset.length])
    .join("");
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const handleGenerate = useCallback(() => {
    const generated = Array.from({ length: count }, () => generatePassword(options));
    setPasswords(generated);
  }, [options, count]);

  const strength = passwords.length > 0 ? getStrength(passwords[0]) : null;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Password Generator"
        description="Generate secure random passwords with customizable options."
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Length: {options.length}
          </label>
          <input
            type="range"
            min={8}
            max={128}
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["uppercase", "lowercase", "numbers", "symbols"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="btn-primary w-full"
        >
          Generate Password{count > 1 ? "s" : ""}
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {strength && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Strength</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strength.width} transition-all rounded-full`} 
                  style={{ background: strength.color }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded p-2">
                <code className="flex-1 text-sm break-all font-mono">{pw}</code>
                <CopyButton text={pw} className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}