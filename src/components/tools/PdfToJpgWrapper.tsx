"use client";

import dynamic from "next/dynamic";

const PdfToJpg = dynamic(() => import("./PdfToJpg"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading PDF engine...</p>
    </div>
  )
});

export default PdfToJpg;
