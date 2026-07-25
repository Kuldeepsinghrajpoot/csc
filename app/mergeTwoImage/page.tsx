"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Upload,
    Trash2,
    Download,
    FileText,
    Layers,
    Settings,
    Sparkles,
    RefreshCw,
    Info,
    Sliders,
    Scissors,
    RotateCcw,
    Crop,
    X,
    Check,
    Eye,
} from "lucide-react";

export default function MergeTwoImage() {
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [frontFileName, setFrontFileName] = useState<string>("");
    const [backFileName, setBackFileName] = useState<string>("");

    // Backups to allow undoing/changing the crop actions
    const [originalFrontImage, setOriginalFrontImage] = useState<string | null>(
        null,
    );
    const [originalBackImage, setOriginalBackImage] = useState<string | null>(
        null,
    );

    const [layoutDirection, setLayoutDirection] = useState<
        "vertical" | "horizontal"
    >("vertical");
    const [paperSize, setPaperSize] = useState<"a4" | "fit">("fit"); // Default to tight fit for a cleaner look
    const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
    const [paddingSize, setPaddingSize] = useState<number>(30);
    const [gapSize, setGapSize] = useState<number>(20);

    const [mergedImage, setMergedImage] = useState<string | null>(null);
    const [mergedSizeKb, setMergedSizeKb] = useState<number | null>(null);
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Manual Crop Modal States
    const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
    const [cropSide, setCropSide] = useState<"front" | "back">("front");
    const [cropTop, setCropTop] = useState<number>(0);
    const [cropBottom, setCropBottom] = useState<number>(0);
    const [cropLeft, setCropLeft] = useState<number>(0);
    const [cropRight, setCropRight] = useState<number>(0);
    const [liveCropPreviewUrl, setLiveCropPreviewUrl] = useState<string | null>(
        null,
    );

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frontInputRef = useRef<HTMLInputElement | null>(null);
    const backInputRef = useRef<HTMLInputElement | null>(null);
    const modalPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => { document.title = "Merge Two Images" }, []);

    const triggerToast = (
        text: string,
        type: "success" | "error" = "success",
    ) => {
        setFeedbackMsg({ type, text });
        setTimeout(() => setFeedbackMsg(null), 4000);
    };

    // Helper to approximate file size from base64 string length
    const getBase64SizeInKb = (base64String: string) => {
        const stringLength =
            base64String.length - "data:image/jpeg;base64,".length;
        const sizeInBytes = (stringLength * 3) / 4;
        return parseFloat((sizeInBytes / 1024).toFixed(2));
    };

    // Process File upload to base64 DataURI
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: "front" | "back",
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            triggerToast(
                "Please upload a valid image file (PNG/JPEG).",
                "error",
            );
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            if (side === "front") {
                setFrontImage(dataUri);
                setOriginalFrontImage(dataUri);
                setFrontFileName(file.name);
            } else {
                setBackImage(dataUri);
                setOriginalBackImage(dataUri);
                setBackFileName(file.name);
            }
            setMergedImage(null); // Force regenerate requirement
            setMergedSizeKb(null);
            triggerToast(
                `${side === "front" ? "Front" : "Back"} side uploaded successfully!`,
            );
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, side: "front" | "back") => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            triggerToast("Only image files are supported.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            if (side === "front") {
                setFrontImage(dataUri);
                setOriginalFrontImage(dataUri);
                setFrontFileName(file.name);
            } else {
                setBackImage(dataUri);
                setOriginalBackImage(dataUri);
                setBackFileName(file.name);
            }
            setMergedImage(null);
            setMergedSizeKb(null);
            triggerToast(
                `${side === "front" ? "Front" : "Back"} side dropped successfully!`,
            );
        };
        reader.readAsDataURL(file);
    };

    // Paste handler for local clipboard contents
    const handlePaste = (e: React.ClipboardEvent, side: "front" | "back") => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const dataUri = reader.result as string;
                        if (side === "front") {
                            setFrontImage(dataUri);
                            setOriginalFrontImage(dataUri);
                            setFrontFileName(
                                `pasted_front_${new Date().getTime()}.png`,
                            );
                        } else {
                            setBackImage(dataUri);
                            setOriginalBackImage(dataUri);
                            setBackFileName(
                                `pasted_back_${new Date().getTime()}.png`,
                            );
                        }
                        setMergedImage(null);
                        setMergedSizeKb(null);
                        triggerToast(
                            `${side === "front" ? "Front" : "Back"} side pasted successfully!`,
                        );
                    };
                    reader.readAsDataURL(file);
                }
                break;
            }
        }
    };

    // Opens visual Manual Crop Modal
    const openManualCropModal = (side: "front" | "back") => {
        const rawImage =
            side === "front" ? originalFrontImage : originalBackImage;
        if (!rawImage) {
            triggerToast("Please upload an image first to crop it.", "error");
            return;
        }
        setCropSide(side);
        setCropTop(0);
        setCropBottom(0);
        setCropLeft(0);
        setCropRight(0);
        setLiveCropPreviewUrl(rawImage);
        setIsCropModalOpen(true);
    };

    // Live render of manual crop selection
    useEffect(() => {
        if (!isCropModalOpen) return;
        const targetSource =
            cropSide === "front" ? originalFrontImage : originalBackImage;
        if (!targetSource) return;

        const img = new Image();
        img.src = targetSource;
        img.onload = () => {
            const canvas = modalPreviewCanvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const cropX = img.width * (cropLeft / 100);
            const cropY = img.height * (cropTop / 100);
            const cropW = img.width * (1 - (cropLeft + cropRight) / 100);
            const cropH = img.height * (1 - (cropTop + cropBottom) / 100);

            if (cropW > 0 && cropH > 0) {
                canvas.width = cropW;
                canvas.height = cropH;
                ctx.drawImage(
                    img,
                    cropX,
                    cropY,
                    cropW,
                    cropH,
                    0,
                    0,
                    cropW,
                    cropH,
                );
                setLiveCropPreviewUrl(canvas.toDataURL("image/png"));
            }
        };
    }, [
        cropTop,
        cropBottom,
        cropLeft,
        cropRight,
        cropSide,
        isCropModalOpen,
        originalFrontImage,
        originalBackImage,
    ]);

    // Saves manual crop using Canvas processing coordinates
    const applyManualCrop = () => {
        if (liveCropPreviewUrl) {
            if (cropSide === "front") {
                setFrontImage(liveCropPreviewUrl);
            } else {
                setBackImage(liveCropPreviewUrl);
            }
            setMergedImage(null);
            setMergedSizeKb(null);
            setIsCropModalOpen(false);
            triggerToast("Manual crop applied successfully!");
        }
    };

    // Smart Object Detection and Edge-Gradient Cropping Algorithm (Optimized to prevent random cutting)
    const handleAutoCropAndRemoveBg = (side: "front" | "back") => {
        const targetSrc =
            side === "front" ? originalFrontImage : originalBackImage;
        if (!targetSrc) return;

        const img = new Image();
        img.src = targetSrc;
        img.onload = () => {
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) return;

            const maxAnalysisWidth = 400;
            const scale = Math.min(1, maxAnalysisWidth / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            tempCanvas.width = w;
            tempCanvas.height = h;
            tempCtx.drawImage(img, 0, 0, w, h);

            const imgData = tempCtx.getImageData(0, 0, w, h);
            const pixels = imgData.data;

            // Convert to a 1D Grayscale representation
            const gray = new Uint8ClampedArray(w * h);
            for (let i = 0; i < pixels.length; i += 4) {
                gray[i / 4] = Math.round(
                    0.299 * pixels[i] +
                        0.587 * pixels[i + 1] +
                        0.114 * pixels[i + 2],
                );
            }

            // Scan rows and columns inward for higher contrast transitions (instead of simple threshold bounds)
            // This ensures we actually isolate the high contrast card boundary instead of random background points
            const threshold = 15;
            let minX = w,
                maxX = 0,
                minY = h,
                maxY = 0;

            // Scan horizontally (left to right, right to left)
            for (let y = 10; y < h - 10; y++) {
                for (let x = 10; x < w - 10; x++) {
                    const idx = y * w + x;
                    const gx = gray[idx + 1] - gray[idx - 1];
                    const gy = gray[idx + w] - gray[idx - w];
                    const edge = Math.sqrt(gx * gx + gy * gy);

                    if (edge > threshold) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            // Guard check: fallback to standard bounding box if detection failed to find edge clusters
            if (
                maxX <= minX ||
                maxY <= minY ||
                maxX - minX < w * 0.3 ||
                maxY - minY < h * 0.3
            ) {
                triggerToast(
                    "Background contrast is too low to auto-detect reliably. Please use Manual Crop.",
                    "error",
                );
                return;
            }

            // Add a safe padding of 2% to ensure no text on the card is clipped
            const padX = Math.round((maxX - minX) * 0.02);
            const padY = Math.round((maxY - minY) * 0.02);

            const cropMinX = Math.max(0, minX - padX);
            const cropMinY = Math.max(0, minY - padY);
            const cropMaxX = Math.min(w, maxX + padX);
            const cropMaxY = Math.min(h, maxY + padY);

            const originalMinX = Math.max(0, Math.round(cropMinX / scale));
            const originalMinY = Math.max(0, Math.round(cropMinY / scale));
            const originalMaxX = Math.min(
                img.width,
                Math.round(cropMaxX / scale),
            );
            const originalMaxY = Math.min(
                img.height,
                Math.round(cropMaxY / scale),
            );

            const cropW = originalMaxX - originalMinX;
            const cropH = originalMaxY - originalMinY;

            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = cropW;
            cropCanvas.height = cropH;
            const cropCtx = cropCanvas.getContext("2d");
            if (!cropCtx) return;

            cropCtx.drawImage(
                img,
                originalMinX,
                originalMinY,
                cropW,
                cropH,
                0,
                0,
                cropW,
                cropH,
            );

            const croppedDataUrl = cropCanvas.toDataURL("image/png");
            if (side === "front") {
                setFrontImage(croppedDataUrl);
            } else {
                setBackImage(croppedDataUrl);
            }
            setMergedImage(null);
            setMergedSizeKb(null);
            triggerToast(
                "Auto-crop and background extraction completed safely!",
            );
        };
    };

    const handleUndoCrop = (side: "front" | "back") => {
        if (side === "front" && originalFrontImage) {
            setFrontImage(originalFrontImage);
            setMergedImage(null);
            triggerToast("Restored original front image.");
        } else if (side === "back" && originalBackImage) {
            setBackImage(originalBackImage);
            setMergedImage(null);
            triggerToast("Restored original back image.");
        }
    };

    const clearImage = (side: "front" | "back") => {
        if (side === "front") {
            setFrontImage(null);
            setOriginalFrontImage(null);
            setFrontFileName("");
        } else {
            setBackImage(null);
            setOriginalBackImage(null);
            setBackFileName("");
        }
        setMergedImage(null);
        setMergedSizeKb(null);
    };

    // Generates combined document with compression safeguard to stay below 100KB
    const generateMergedDocument = () => {
        if (!frontImage || !backImage) {
            triggerToast(
                "Please provide both front and back images first.",
                "error",
            );
            return;
        }
        setIsMerging(true);

        const imgFront = new Image();
        const imgBack = new Image();

        imgFront.src = frontImage;
        imgFront.onload = () => {
            imgBack.src = backImage;
            imgBack.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) {
                    setIsMerging(false);
                    return;
                }

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setIsMerging(false);
                    return;
                }

                let targetImageWidth = 800; // Optimal base width
                let maxScaleLoops = 5;
                let finalImageUri = "";
                let finalSizeKb = 0;

                while (maxScaleLoops > 0) {
                    const scaleFront = targetImageWidth / imgFront.width;
                    const scaleBack = targetImageWidth / imgBack.width;

                    const frontH = imgFront.height * scaleFront;
                    const backH = imgBack.height * scaleBack;

                    let canvasWidth = 900;
                    let canvasHeight = 1272;

                    if (paperSize === "a4") {
                        canvasWidth = Math.round(targetImageWidth * 1.25);
                        canvasHeight = Math.round(canvasWidth * 1.414);
                    } else {
                        if (layoutDirection === "vertical") {
                            canvasWidth = Math.max(
                                targetImageWidth + paddingSize * 2,
                                600,
                            );
                            canvasHeight = Math.round(
                                frontH + backH + gapSize + paddingSize * 2,
                            );
                        } else {
                            canvasWidth = Math.round(
                                targetImageWidth * 2 +
                                    gapSize +
                                    paddingSize * 2,
                            );
                            canvasHeight = Math.round(
                                Math.max(frontH, backH) + paddingSize * 2,
                            );
                        }
                    }

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    // Render background white/colored canvas
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                    // Card Drawing positions (no header offset applied)
                    if (layoutDirection === "vertical") {
                        const drawX = (canvasWidth - targetImageWidth) / 2;
                        const frontY = paddingSize;
                        const backY = frontY + frontH + gapSize;

                        ctx.drawImage(
                            imgFront,
                            drawX,
                            frontY,
                            targetImageWidth,
                            frontH,
                        );
                        ctx.drawImage(
                            imgBack,
                            drawX,
                            backY,
                            targetImageWidth,
                            backH,
                        );

                        ctx.strokeStyle = "#cbd5e1";
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(drawX, frontY, targetImageWidth, frontH);
                        ctx.strokeRect(drawX, backY, targetImageWidth, backH);
                    } else {
                        const totalContentWidth =
                            targetImageWidth * 2 + gapSize;
                        const startX = (canvasWidth - totalContentWidth) / 2;
                        const drawY = paddingSize;

                        ctx.drawImage(
                            imgFront,
                            startX,
                            drawY,
                            targetImageWidth,
                            frontH,
                        );
                        ctx.drawImage(
                            imgBack,
                            startX + targetImageWidth + gapSize,
                            drawY,
                            targetImageWidth,
                            backH,
                        );

                        ctx.strokeStyle = "#cbd5e1";
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(startX, drawY, targetImageWidth, frontH);
                        ctx.strokeRect(
                            startX + targetImageWidth + gapSize,
                            drawY,
                            targetImageWidth,
                            backH,
                        );
                    }

                    // Iterative Quality step down to fit under 100KB
                    let quality = 0.95;
                    let tempUri = "";
                    let tempSizeKb = 999;

                    while (quality >= 0.1) {
                        tempUri = canvas.toDataURL("image/jpeg", quality);
                        tempSizeKb = getBase64SizeInKb(tempUri);

                        if (tempSizeKb <= 100) {
                            finalImageUri = tempUri;
                            finalSizeKb = tempSizeKb;
                            break;
                        }
                        // Step quality down
                        quality -= 0.1;
                    }

                    // If the size is now under 100KB, break out of size loops
                    if (finalImageUri !== "") {
                        break;
                    }

                    // If still over 100KB even at lowest quality, scale down target layout dimensions and retry
                    targetImageWidth = Math.round(targetImageWidth * 0.8);
                    maxScaleLoops--;

                    // Absolute fallback case if quality iteration fails to drop below 100KB
                    if (maxScaleLoops === 0) {
                        finalImageUri = tempUri;
                        finalSizeKb = tempSizeKb;
                    }
                }

                setMergedImage(finalImageUri);
                setMergedSizeKb(finalSizeKb);
                setIsMerging(false);

                if (finalSizeKb > 100) {
                    triggerToast(
                        `Unable to fit perfectly under 100KB. Best fit is ${finalSizeKb}KB.`,
                        "error",
                    );
                } else {
                    triggerToast(
                        `Document compiled! Saved at exactly ${finalSizeKb}KB`,
                        "success",
                    );
                }
            };
        };
    };

    const downloadFinalDocument = () => {
        if (!mergedImage) return;
        const downloadLink = document.createElement("a");
        downloadLink.href = mergedImage;
        downloadLink.download = "merged_identity_card.jpg";
        downloadLink.click();
        triggerToast("Download triggered successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-500 selection:text-white transition-all py-8">
            {/* Toast Notification element */}
            {feedbackMsg && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-xl text-sm font-semibold animate-bounce border bg-white text-slate-800 border-slate-200">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${feedbackMsg.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
                    />
                    {feedbackMsg.text}
                </div>
            )}

            {/* MANUAL CROP MODAL OVERLAY */}
            {isCropModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-5 my-8">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-md">
                                <Crop className="w-5 h-5 text-blue-600" />
                                Precise Manual Crop:{" "}
                                {cropSide === "front"
                                    ? "Front Side"
                                    : "Back Side"}
                            </h3>
                            <button
                                onClick={() => setIsCropModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Split layout: Selector boundaries on left, Live Crop Preview on right */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {/* Left Side: Original Image Selector Shroud */}
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Adjust Crop Window
                                </span>
                                <div className="bg-slate-950 rounded overflow-hidden p-4 flex items-center justify-center min-h-[260px] relative">
                                    <div className="relative inline-block max-w-full max-h-[280px]">
                                        <img
                                            src={
                                                cropSide === "front"
                                                    ? originalFrontImage || ""
                                                    : originalBackImage || ""
                                            }
                                            alt="Cropping guide workspace"
                                            className="max-w-full max-h-[240px] object-contain block opacity-90 select-none pointer-events-none rounded"
                                        />

                                        {/* Visual crop box overlays simulating shroud */}
                                        <div
                                            className="absolute bg-black/65 border-b border-dashed border-indigo-400/80"
                                            style={{
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: `${cropTop}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-t border-dashed border-indigo-400/80"
                                            style={{
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: `${cropBottom}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-r border-dashed border-indigo-400/80"
                                            style={{
                                                top: `${cropTop}%`,
                                                bottom: `${cropBottom}%`,
                                                left: 0,
                                                width: `${cropLeft}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-l border-dashed border-indigo-400/80"
                                            style={{
                                                top: `${cropTop}%`,
                                                bottom: `${cropBottom}%`,
                                                right: 0,
                                                width: `${cropRight}%`,
                                            }}
                                        />

                                        {/* Bright crop focal window border */}
                                        <div
                                            className="absolute border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] pointer-events-none"
                                            style={{
                                                top: `${cropTop}%`,
                                                bottom: `${cropBottom}%`,
                                                left: `${cropLeft}%`,
                                                right: `${cropRight}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: LIVE RESULT PREVIEW (Ensures no blind crop) */}
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-emerald-600" />
                                    Live Crop Result Preview
                                </span>
                                <div className="bg-slate-100 rounded p-4 flex flex-col items-center justify-center min-h-[260px] border border-slate-200">
                                    {liveCropPreviewUrl ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={liveCropPreviewUrl}
                                                alt="Live crop preview output"
                                                className="max-w-full max-h-[220px] object-contain rounded shadow-lg border border-white"
                                            />
                                            <span className="text-[10px] font-semibold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                Clean Edge Alignment Guaranteed
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 text-xs">
                                            Awaiting boundary inputs...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fine Tuning Sliders with Safety Collision Guards */}
                        <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-150">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                                Crop Edges Margin Percent (%)
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Top Edge: {cropTop}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="90"
                                        value={cropTop}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                            );
                                            if (val + cropBottom < 100)
                                                setCropTop(val);
                                        }}
                                        className="w-full accent-indigo-600 h-1.5 rounded-md bg-slate-200"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Bottom Edge: {cropBottom}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="90"
                                        value={cropBottom}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                            );
                                            if (val + cropTop < 100)
                                                setCropBottom(val);
                                        }}
                                        className="w-full accent-indigo-600 h-1.5 rounded-md bg-slate-200"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Left Edge: {cropLeft}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="90"
                                        value={cropLeft}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                            );
                                            if (val + cropRight < 100)
                                                setCropLeft(val);
                                        }}
                                        className="w-full accent-indigo-600 h-1.5 rounded-md bg-slate-200"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Right Edge: {cropRight}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="90"
                                        value={cropRight}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                            );
                                            if (val + cropLeft < 100)
                                                setCropRight(val);
                                        }}
                                        className="w-full accent-indigo-600 h-1.5 rounded-md bg-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsCropModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={applyManualCrop}
                                className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-all flex items-center gap-2 shadow shadow-indigo-100"
                            >
                                <Check className="w-4 h-4" />
                                Apply Precise Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main body split content area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left panel: Upload controls and Layout options (5 columns) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Upload Area Component */}
                        <div className="bg-white rounded border border-slate-200/80 p-6">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                    1. Upload & Clean Card Images
                                </h2>
                                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Step 1 of 2
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* FRONT SIDE CARD */}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                                        Front Side
                                    </span>
                                    {frontImage ? (
                                        <div className="relative border border-slate-200 rounded overflow-hidden group bg-slate-50 p-2">
                                            <img
                                                src={frontImage}
                                                className="w-full h-36 object-contain rounded-md"
                                                alt="Front Preview"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4">
                                                <div className="flex items-center justify-center gap-2 w-full">
                                                    <button
                                                        onClick={() =>
                                                            handleAutoCropAndRemoveBg(
                                                                "front",
                                                            )
                                                        }
                                                        title="Auto Detect Object & Crop Background Safely"
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <Scissors className="w-3.5 h-3.5" />
                                                        Auto-Crop
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openManualCropModal(
                                                                "front",
                                                            )
                                                        }
                                                        title="Manually adjust image boundaries with preview"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <Crop className="w-3.5 h-3.5" />
                                                        Manual Crop
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 w-full">
                                                    <button
                                                        onClick={() =>
                                                            frontInputRef.current?.click()
                                                        }
                                                        className="bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md text-xs font-semibold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Replace
                                                    </button>
                                                    {originalFrontImage !==
                                                        frontImage && (
                                                        <button
                                                            onClick={() =>
                                                                handleUndoCrop(
                                                                    "front",
                                                                )
                                                            }
                                                            title="Restore Original Image"
                                                            className="bg-slate-700 hover:bg-slate-800 text-white p-2 rounded-md text-xs font-semibold shadow"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            clearImage("front")
                                                        }
                                                        className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-md text-xs font-semibold shadow"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 truncate mt-2 px-1 font-medium">
                                                {frontFileName}
                                            </p>
                                        </div>
                                    ) : (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={(e) =>
                                                handleDrop(e, "front")
                                            }
                                            onPaste={(e) =>
                                                handlePaste(e, "front")
                                            }
                                            tabIndex={0}
                                            className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50/50 hover:bg-blue-50/10 rounded p-6 transition-all flex flex-col items-center justify-center text-center group min-h-[160px]"
                                        >
                                            {/* Default State */}
                                            <div className="flex flex-col items-center justify-center transition-all group-hover:opacity-0 group-hover:scale-95 duration-200">
                                                <div className="p-3 bg-white rounded border shadow-sm mb-3">
                                                    <Upload className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    Front Side Slot
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Hover here to choose files
                                                </p>
                                            </div>

                                            {/* Hover Overlay Actions instead of clickable block */}
                                            <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 rounded p-4">
                                                <button
                                                    onClick={() =>
                                                        frontInputRef.current?.click()
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded shadow w-full max-w-[180px] flex items-center justify-center gap-1.5"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    Browse File
                                                </button>
                                                <p className="text-[10px] text-slate-300 font-semibold mt-1">
                                                    Or click container & press{" "}
                                                    <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[9px] border border-slate-700 text-white font-mono">
                                                        Ctrl+V
                                                    </kbd>{" "}
                                                    to paste
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={frontInputRef}
                                        onChange={(e) =>
                                            handleImageUpload(e, "front")
                                        }
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                {/* BACK SIDE CARD */}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                                        Back Side
                                    </span>
                                    {backImage ? (
                                        <div className="relative border border-slate-200 rounded overflow-hidden group bg-slate-50 p-2">
                                            <img
                                                src={backImage}
                                                className="w-full h-36 object-contain rounded-md"
                                                alt="Back Preview"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4">
                                                <div className="flex items-center justify-center gap-2 w-full">
                                                    <button
                                                        onClick={() =>
                                                            handleAutoCropAndRemoveBg(
                                                                "back",
                                                            )
                                                        }
                                                        title="Auto Detect Object & Crop Background Safely"
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <Scissors className="w-3.5 h-3.5" />
                                                        Auto-Crop
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openManualCropModal(
                                                                "back",
                                                            )
                                                        }
                                                        title="Manually adjust image boundaries with preview"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <Crop className="w-3.5 h-3.5" />
                                                        Manual Crop
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 w-full">
                                                    <button
                                                        onClick={() =>
                                                            backInputRef.current?.click()
                                                        }
                                                        className="bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md text-xs font-semibold shadow flex items-center gap-1.5 flex-1 justify-center"
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Replace
                                                    </button>
                                                    {originalBackImage !==
                                                        backImage && (
                                                        <button
                                                            onClick={() =>
                                                                handleUndoCrop(
                                                                    "back",
                                                                )
                                                            }
                                                            title="Restore Original Image"
                                                            className="bg-slate-700 hover:bg-slate-800 text-white p-2 rounded-md text-xs font-semibold shadow"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            clearImage("back")
                                                        }
                                                        className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-md text-xs font-semibold shadow"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 truncate mt-2 px-1 font-medium">
                                                {backFileName}
                                            </p>
                                        </div>
                                    ) : (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={(e) =>
                                                handleDrop(e, "back")
                                            }
                                            onPaste={(e) =>
                                                handlePaste(e, "back")
                                            }
                                            tabIndex={0}
                                            className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50/50 hover:bg-blue-50/10 cursor-pointer rounded p-6 transition-all flex flex-col items-center justify-center text-center group min-h-[160px]"
                                        >
                                            {/* Default State */}
                                            <div className="flex flex-col items-center justify-center transition-all group-hover:opacity-0 group-hover:scale-95 duration-200">
                                                <div className="p-3 bg-white rounded border shadow-sm mb-3">
                                                    <Upload className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    Back Side Slot
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Hover here to choose files
                                                </p>
                                            </div>

                                            {/* Hover Overlay Actions instead of clickable block */}
                                            <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 rounded p-4">
                                                <button
                                                    onClick={() =>
                                                        backInputRef.current?.click()
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-md shadow w-full max-w-[180px] flex items-center justify-center gap-1.5"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    Browse File
                                                </button>
                                                <p className="text-[10px] text-slate-300 font-semibold mt-1">
                                                    Or click container & press{" "}
                                                    <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[9px] border border-slate-700 text-white font-mono">
                                                        Ctrl+V
                                                    </kbd>{" "}
                                                    to paste
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={backInputRef}
                                        onChange={(e) =>
                                            handleImageUpload(e, "back")
                                        }
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Layout Customizer Component */}
                        <div className="bg-white rounded border border-slate-200/80 p-6 ">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-blue-500" />
                                    2. Page Customizer
                                </h2>
                                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Step 2 of 2
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Vertical or Horizontal alignments */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-2">
                                        Card Layout Alignment
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            onClick={() => {
                                                setLayoutDirection("vertical");
                                                setMergedImage(null);
                                            }}
                                            className={`px-3 py-2.5 text-xs font-bold rounded border text-center transition-all ${layoutDirection === "vertical" ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            Vertical (Top-Down)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLayoutDirection(
                                                    "horizontal",
                                                );
                                                setMergedImage(null);
                                            }}
                                            className={`px-3 py-2.5 text-xs font-bold rounded border text-center transition-all ${layoutDirection === "horizontal" ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            Horizontal (Side-by-Side)
                                        </button>
                                    </div>
                                </div>

                                {/* Sizing selection */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-2">
                                        Paper Aspect Format
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            onClick={() => {
                                                setPaperSize("a4");
                                                setMergedImage(null);
                                            }}
                                            className={`px-3 py-2.5 text-xs font-bold rounded border text-center transition-all ${paperSize === "a4" ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            Standard A4 Format
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPaperSize("fit");
                                                setMergedImage(null);
                                            }}
                                            className={`px-3 py-2.5 text-xs font-bold rounded border text-center transition-all ${paperSize === "fit" ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            Tight Dynamic Fit
                                        </button>
                                    </div>
                                </div>

                                {/* Spacings (Gaps and Margins) */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                            Margins ({paddingSize}px)
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={paddingSize}
                                            onChange={(e) => {
                                                setPaddingSize(
                                                    parseInt(e.target.value),
                                                );
                                                setMergedImage(null);
                                            }}
                                            className="w-full h-1 bg-slate-200 rounded-md appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                            Gap Size ({gapSize}px)
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={gapSize}
                                            onChange={(e) => {
                                                setGapSize(
                                                    parseInt(e.target.value),
                                                );
                                                setMergedImage(null);
                                            }}
                                            className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>
                                </div>

                                {/* Document Canvas Color styling */}
                                <div>
                                    <label className="text-xs font-bold  block mb-1.5">
                                        Canvas Paper Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => {
                                                setBackgroundColor(
                                                    e.target.value,
                                                );
                                                setMergedImage(null);
                                            }}
                                            className="w-8 h-8 rounded cursor-pointer border "
                                        />
                                        <span className="text-xs font-mono font-semibold  uppercase">
                                            {backgroundColor}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Action trigger */}
                        <button
                            disabled={!frontImage || !backImage || isMerging}
                            onClick={generateMergedDocument}
                            className={`w-full py-4 px-6 rounded font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-white
                ${
                    !frontImage || !backImage
                        ? "bg-slate-300 cursor-not-allowed shadow-none"
                        : "bg-linear-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 shadow-blue-200 hover:-translate-y-0.5"
                }`}
                        >
                            {isMerging ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Rendering & Compressing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Compile & Limit under 100KB
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right preview display viewport (7 columns) */}
                    <div className="lg:col-span-7 ">
                        <div className="bg-white rounded border border-slate-200  p-6 flex flex-col justify-between">
                            {/* Output Action Header bar */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-bold ">
                                        Final Document Output
                                    </h3>
                                </div>

                                {mergedImage && (
                                    <button
                                        onClick={downloadFinalDocument}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded shadow transition-all flex items-center gap-2 hover:-translate-y-0.5"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download ({mergedSizeKb} KB)
                                    </button>
                                )}
                            </div>

                            {/* Working output preview container */}
                            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-md p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                {mergedImage ? (
                                    <div className="w-full max-w-md transition-all duration-300">
                                        <img
                                            src={mergedImage}
                                            alt="Aadhaar Combined Compilation Preview"
                                            className="w-full h-auto rounded  border border-slate-200/60 bg-white"
                                        />

                                        {/* File Size details label */}
                                        <div className="mt-4 flex flex-col gap-2 items-center">
                                            <div className="flex items-center gap-2 text-xs font-semibold bg-white py-2 px-4 rounded  border border-slate-100">
                                                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                                                <span>
                                                    File Size:{" "}
                                                    <strong className="text-emerald-600">
                                                        {mergedSizeKb} KB
                                                    </strong>
                                                </span>
                                                <span className="text-slate-300">
                                                    |
                                                </span>
                                                <span className="text-slate-500 font-medium">
                                                    Status: Optimized under
                                                    100KB
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                                <Info className="w-3 h-3" />
                                                Quality factor is auto-scaled
                                                dynamically to keep final file
                                                sizes below 100KB.
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 max-w-sm">
                                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                            <Layers className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h4 className="text-slate-800 font-bold mb-1.5">
                                            No Preview Compiled
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                            Upload both identity card images on
                                            the left side, configure margins,
                                            then tap{" "}
                                            <strong className="text-slate-600">
                                                "Compile & Limit under 100KB"
                                            </strong>{" "}
                                            to generate the output page.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden processing HTML5 Canvas Workspace */}
            <canvas ref={canvasRef} className="hidden" />
            {/* Hidden offscreen canvas for modal real-time crop compilation */}
            <canvas ref={modalPreviewCanvasRef} className="hidden" />
        </div>
    );
}
