"use client";

import React from "react";

type DocPreviewProps = {
  label: string;
  url?: string | null;
};

function DocPreview({ label, url }: DocPreviewProps) {
  const isImage = url?.match(/\.(jpg|jpeg|png|webp)$/i);
  const isPdf = url?.endsWith(".pdf");

  return (
    <div className="bg-gray-50 rounded-2xl border overflow-hidden shadow-sm">
      <div className="px-4 py-2 border-b text-sm font-semibold">{label}</div>

      <div className="h-52 flex items-center justify-center bg-white">
        {!url ? (
          <span className="text-xs text-gray-400">Image Not Uploaded</span>
        ) : isImage ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : isPdf ? (
          <iframe src={url} title={label} className="w-full h-full" />
        ) : (
          <span className="text-xs text-gray-400">Unsupported File Type</span>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs py-2 font-medium hover:bg-gray-100 transition-colors"
        >
          Open Full Document
        </a>
      )}
    </div>
  );
}

export default DocPreview;
