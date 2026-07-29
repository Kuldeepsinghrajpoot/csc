"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

declare global {
    interface Window {
        cv: any;
    }
}

export default function DocumentScanner() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [opencvReady, setOpenCvReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/opencv.js";
    script.async = true;

    script.onload = () => {
      window.cv["onRuntimeInitialized"] = () => {
        setOpenCvReady(true);
        console.log("OpenCV Loaded");
      };
    };

    document.body.appendChild(script);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);

      const img = new Image();

      img.onload = () => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">
        Document Scanner
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {!opencvReady && (
        <p>Loading OpenCV...</p>
      )}

      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border shadow"
      />
    </div>
  );
}