import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let relative: string;
  if (seconds < 60) relative = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  else if (minutes < 60)
    relative = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  else if (hours < 24) relative = `${hours} hour${hours !== 1 ? "s" : ""}`;
  else if (days < 30) relative = `${days} day${days !== 1 ? "s" : ""}`;
  else if (months < 12)
    relative = `${months} month${months !== 1 ? "s" : ""}`;
  else relative = `${years} year${years !== 1 ? "s" : ""}`;

  return isFuture ? `in ${relative}` : `${relative} ago`;
}

function formatDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState(formatDatetimeLocal(new Date()));

  const handleNow = () => {
    const now = new Date();
    const seconds = Math.floor(now.getTime() / 1000);
    setUnixInput(seconds.toString());
    setDateInput(formatDatetimeLocal(now));
  };

  // Unix to Date conversion
  const unixNum = parseInt(unixInput);
  const unixDate = !isNaN(unixNum) ? new Date(unixNum * 1000) : null;
  const unixFormats = unixDate
    ? {
        iso: unixDate.toISOString(),
        local: unixDate.toLocaleString(),
        utc: unixDate.toUTCString(),
        relative: getRelativeTime(unixDate),
      }
    : null;

  // Date to Unix conversion
  const dateObj = dateInput ? new Date(dateInput) : null;
  const dateUnixSeconds =
    dateObj && !isNaN(dateObj.getTime())
      ? Math.floor(dateObj.getTime() / 1000)
      : null;
  const dateUnixMs =
    dateObj && !isNaN(dateObj.getTime()) ? dateObj.getTime() : null;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Timestamp Converter"
        description="Convert between Unix timestamps and human-readable dates"
      />

      <button
        onClick={handleNow}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Now
      </button>

      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Unix to Date</h2>
        <input
          type="number"
          value={unixInput}
          onChange={(e) => setUnixInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Unix timestamp (seconds)"
        />
        {unixFormats && (
          <div className="space-y-2">
            {[
              { label: "ISO 8601", value: unixFormats.iso },
              { label: "Local", value: unixFormats.local },
              { label: "UTC", value: unixFormats.utc },
              { label: "Relative", value: unixFormats.relative },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium text-gray-600 w-20">
                  {label}
                </span>
                <span className="flex-1 text-sm text-gray-900 font-mono">
                  {value}
                </span>
                <CopyButton text={value} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Date to Unix</h2>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {dateUnixSeconds !== null && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-600 w-28">
                Seconds
              </span>
              <span className="flex-1 text-sm text-gray-900 font-mono">
                {dateUnixSeconds}
              </span>
              <CopyButton text={dateUnixSeconds.toString()} />
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-600 w-28">
                Milliseconds
              </span>
              <span className="flex-1 text-sm text-gray-900 font-mono">
                {dateUnixMs}
              </span>
              <CopyButton text={dateUnixMs!.toString()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
