"use client";

import React, { useState, useRef, useEffect } from "react";
import { enhanceScan, detectDocumentBox, ScanMode } from "@/lib/docScan";

type Cut = { top: number; bottom: number; left: number; right: number };
const emptyCut: Cut = { top: 0, bottom: 0, left: 0, right: 0 };
const cutClip = (c: Cut) => `inset(${c.top}% ${c.right}% ${c.bottom}% ${c.left}%)`;
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
    ArrowLeftRight,
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
    const [scanMode, setScanMode] = useState<ScanMode>("color"); // document-scan look
    const [cardFit, setCardFit] = useState<boolean>(true); // standard Aadhaar card size
    const [paperSize, setPaperSize] = useState<"a4" | "fit">("fit"); // Default to tight fit for a cleaner look
    const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
    const [paddingSize, setPaddingSize] = useState<number>(0);
    const [gapSize, setGapSize] = useState<number>(10);

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

    
    // Direct cut controls (live on the image) + auto-cut
    const [frontCut, setFrontCut] = useState<Cut>(emptyCut);
    const [backCut, setBackCut] = useState<Cut>(emptyCut);
    const [showCut, setShowCut] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });
    const [autoCutOnUpload, setAutoCutOnUpload] = useState<boolean>(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const skipAutoCut = useRef(false);
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

    const readFile = (file: File) =>
        new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });

    const setSideImage = (side: "front" | "back", dataUri: string, name: string) => {
        if (side === "front") {
            setFrontImage(dataUri);
            setOriginalFrontImage(dataUri);
            setFrontFileName(name);
            setFrontCut(emptyCut);
        } else {
            setBackImage(dataUri);
            setOriginalBackImage(dataUri);
            setBackFileName(name);
            setBackCut(emptyCut);
        }
        setMergedImage(null); // Force regenerate requirement
        setMergedSizeKb(null);
    };

    // Takes one or two files. One file -> the slot it was dropped on.
    // Two files at once -> first one becomes Front, second one Back (same order as chosen).
    const acceptFiles = async (files: File[], side: "front" | "back") => {
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (images.length === 0) {
            triggerToast("Please upload a valid image file (PNG/JPEG).", "error");
            return;
        }
        if (images.length >= 2) {
            const [a, b] = await Promise.all([readFile(images[0]), readFile(images[1])]);
            setSideImage("front", a, images[0].name);
            setSideImage("back", b, images[1].name);
            triggerToast("Both sides added in the order you picked.");
            return;
        }
        const uri = await readFile(images[0]);
        setSideImage(side, uri, images[0].name);
        triggerToast(`${side === "front" ? "Front" : "Back"} side added.`);
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: "front" | "back",
    ) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = ""; // allow picking the same file again
        if (files.length) acceptFiles(files, side);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, side: "front" | "back") => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files ?? []);
        if (files.length) acceptFiles(files, side);
    };

    // Paste handler for local clipboard contents
    const handlePaste = (e: React.ClipboardEvent, side: "front" | "back") => {
        const items = Array.from(e.clipboardData?.items ?? []);
        const item = items.find((it) => it.type.startsWith("image"));
        const file = item?.getAsFile();
        if (file) acceptFiles([file], side);
    };

    // Swap which photo is first / second (left<->right or top<->bottom)
    const swapSides = () => {
        skipAutoCut.current = true; // do not re-run auto-cut and lose manual cuts
        const f = frontImage, b = backImage;
        const fo = originalFrontImage, bo = originalBackImage;
        const fn = frontFileName, bn = backFileName;
        const fc = frontCut, bc = backCut;
        setFrontImage(b); setBackImage(f);
        setOriginalFrontImage(bo); setOriginalBackImage(fo);
        setFrontFileName(bn); setBackFileName(fn);
        setFrontCut(bc); setBackCut(fc);
        setMergedImage(null);
        setMergedSizeKb(null);
    };

    // ---- AUTO-CUT: finds the card in the photo and cuts the background away ----
    const autoCutFromOriginal = (side: "front" | "back", notify: boolean) => {
        const src = side === "front" ? originalFrontImage : originalBackImage;
        if (!src) return;
        const img = new Image();
        img.onload = () => {
            const box = detectDocumentBox(img);
            if (!box) {
                if (notify) triggerToast("Card edges are not clear. Use Manual cut.", "error");
                return;
            }
            const c = document.createElement("canvas");
            c.width = Math.round(box.w);
            c.height = Math.round(box.h);
            const ctx = c.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, c.width, c.height);
            const url = c.toDataURL("image/jpeg", 0.95);
            if (side === "front") {
                setFrontImage(url);
                setFrontCut(emptyCut);
            } else {
                setBackImage(url);
                setBackCut(emptyCut);
            }
            setMergedImage(null);
            setMergedSizeKb(null);
            if (notify) triggerToast("Card cut automatically.");
        };
        img.src = src;
    };

    // Auto-cut right after a new photo is uploaded
    useEffect(() => {
        if (autoCutOnUpload && originalFrontImage && !skipAutoCut.current) autoCutFromOriginal("front", false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalFrontImage]);
    useEffect(() => {
        if (autoCutOnUpload && originalBackImage && !skipAutoCut.current) autoCutFromOriginal("back", false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalBackImage]);
    useEffect(() => {
        skipAutoCut.current = false;
    }, [originalFrontImage, originalBackImage]);

    // ---- MANUAL CUT: applies the slider margins directly to the image ----
    const applyCut = (side: "front" | "back") => {
        const src = side === "front" ? frontImage : backImage;
        const cut = side === "front" ? frontCut : backCut;
        if (!src) return;
        const img = new Image();
        img.onload = () => {
            const x = (img.width * cut.left) / 100;
            const y = (img.height * cut.top) / 100;
            const w = img.width * (1 - (cut.left + cut.right) / 100);
            const h = img.height * (1 - (cut.top + cut.bottom) / 100);
            if (w < 20 || h < 20) {
                triggerToast("Cut is too large.", "error");
                return;
            }
            const c = document.createElement("canvas");
            c.width = Math.round(w);
            c.height = Math.round(h);
            const ctx = c.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
            const url = c.toDataURL("image/jpeg", 0.95);
            if (side === "front") {
                setFrontImage(url);
                setFrontCut(emptyCut);
            } else {
                setBackImage(url);
                setBackCut(emptyCut);
            }
            setMergedImage(null);
            setMergedSizeKb(null);
            triggerToast("Cut applied.");
        };
        img.src = src;
    };

    const renderCutPanel = (side: "front" | "back") => {
        const cut = side === "front" ? frontCut : backCut;
        const setCut = side === "front" ? setFrontCut : setBackCut;
        const open = showCut[side];
        const hasCut = cut.top + cut.bottom + cut.left + cut.right > 0;
        const sliders: [keyof Cut, string][] = [
            ["top", "Top"],
            ["bottom", "Bottom"],
            ["left", "Left"],
            ["right", "Right"],
        ];
        return (
            <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setShowCut((s) => ({ ...s, [side]: !s[side] }))}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-blue-600"
                    >
                        <Crop className="h-3.5 w-3.5" /> {open ? "Hide edge sliders" : "Fine-tune edges"}
                    </button>
                </div>

                {open && (
                    <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                            Crop edges margin percent (%)
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {sliders.map(([key, label]) => (
                                <label key={key} className="block text-xs font-bold text-slate-600">
                                    {label} Edge: {cut[key]}%
                                    <input
                                        type="range"
                                        min={0}
                                        max={45}
                                        step={0.5}
                                        value={cut[key]}
                                        onChange={(e) => setCut({ ...cut, [key]: parseFloat(e.target.value) })}
                                        className="mt-1 w-full accent-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => applyCut(side)}
                                disabled={!hasCut}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                <Check className="h-3.5 w-3.5" /> Apply cut
                            </button>
                            <button
                                type="button"
                                onClick={() => setCut(emptyCut)}
                                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
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
    const generateMergedDocument = async () => {
        if (!frontImage || !backImage) {
            triggerToast(
                "Please provide both front and back images first.",
                "error",
            );
            return;
        }
        setIsMerging(true);

        let frontSrc = frontImage;
        let backSrc = backImage;
        try {
            frontSrc = await enhanceScan(frontImage, scanMode, { cardFit });
            backSrc = await enhanceScan(backImage, scanMode, { cardFit });
        } catch {
            triggerToast("Scan effect failed, using original photos.", "error");
        }

        const imgFront = new Image();
        const imgBack = new Image();

        imgFront.src = frontSrc;
        imgFront.onload = () => {
            imgBack.src = backSrc;
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

                    if (paperSize === "a4" && !cardFit) {
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

    const isHorizontal = layoutDirection === "horizontal";
    const posLabel = (n: 1 | 2) =>
        isHorizontal ? (n === 1 ? "Left" : "Right") : n === 1 ? "Top" : "Bottom";

    const card = "rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
    const stepNum = "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white";

    const renderSlot = (side: "front" | "back", n: 1 | 2) => {
        const row = !isHorizontal; // stacked layout -> compact row per photo
        const image = side === "front" ? frontImage : backImage;
        const name = side === "front" ? frontFileName : backFileName;
        const original = side === "front" ? originalFrontImage : originalBackImage;
        const cut = side === "front" ? frontCut : backCut;
        const inputRef = side === "front" ? frontInputRef : backInputRef;
        const title = side === "front" ? "Front side" : "Back side";
        const toolBtn =
            "inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-blue-700";

        return (
            <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{n}</span>
                    <span className="text-sm font-bold text-slate-800">{title}</span>
                    <span className={`rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ${row ? "" : "ml-auto"}`}>
                        {posLabel(n)}
                    </span>
                </div>

                {image ? (
                    <div className={row ? "flex flex-col gap-3 sm:flex-row sm:items-start" : ""}>
                        <div className={row ? "sm:w-64 sm:shrink-0" : ""}>
                            <div className="flex aspect-[85.6/54] items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                                <img
                                    src={image}
                                    alt={`${title} preview`}
                                    className="max-h-full max-w-full object-contain transition-[clip-path]"
                                    style={{ clipPath: cutClip(cut) }}
                                />
                            </div>
                            <p className="mt-1.5 truncate text-[11px] font-medium text-slate-400">{name}</p>
                        </div>
                        <div className={row ? "min-w-0 flex-1" : "mt-2"}>
                            <div className="flex flex-wrap gap-1.5">
                                <button type="button" onClick={() => autoCutFromOriginal(side, true)} className={toolBtn}>
                                    <Scissors className="h-3.5 w-3.5" /> Auto-cut
                                </button>
                                <button type="button" onClick={() => openManualCropModal(side)} className={toolBtn}>
                                    <Crop className="h-3.5 w-3.5" /> Crop
                                </button>
                                <button type="button" onClick={() => inputRef.current?.click()} title="Replace photo" aria-label="Replace photo" className={toolBtn}>
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </button>
                                {original !== image && (
                                    <button type="button" onClick={() => handleUndoCrop(side)} title="Restore original photo" aria-label="Restore original photo" className={toolBtn}>
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => clearImage(side)}
                                    title="Remove photo"
                                    aria-label="Remove photo"
                                    className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 text-rose-600 ring-1 ring-slate-200 transition hover:bg-rose-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            {renderCutPanel(side)}
                        </div>
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, side)}
                        onPaste={(e) => handlePaste(e, side)}
                        tabIndex={0}
                        role="button"
                        onClick={() => inputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
                        }}
                        className={`group flex ${row ? "h-28 w-full" : "aspect-[85.6/54]"} cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center outline-none transition hover:border-blue-400 hover:bg-blue-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                    >
                        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 ring-1 ring-slate-200 transition group-hover:bg-blue-600 group-hover:text-white">
                            <Upload className="h-5 w-5" />
                        </span>
                        <p className="text-sm font-bold text-slate-800">Add {title.toLowerCase()}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Tap to choose, drop, or paste</p>
                    </div>
                )}
                <input
                    type="file"
                    ref={inputRef}
                    onChange={(e) => handleImageUpload(e, side)}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
            </div>
        );
    };

    const swapBtn = (
        <button
            type="button"
            onClick={swapSides}
            disabled={!frontImage && !backImage}
            title="Swap order"
            className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-white text-slate-600 ring-1 ring-slate-300 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
            <ArrowLeftRight className={`h-4 w-4 ${isHorizontal ? "" : "rotate-90"}`} />
            <span className="sr-only">Swap order</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
            {/* Toast */}
            {feedbackMsg && (
                <div
                    role="status"
                    className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl"
                >
                    <span className={`h-2 w-2 rounded-full ${feedbackMsg.type === "success" ? "bg-emerald-400" : "bg-rose-400"}`} />
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
                                            className="absolute bg-black/65 border-b border-dashed border-blue-400/80"
                                            style={{
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: `${cropTop}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-t border-dashed border-blue-400/80"
                                            style={{
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: `${cropBottom}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-r border-dashed border-blue-400/80"
                                            style={{
                                                top: `${cropTop}%`,
                                                bottom: `${cropBottom}%`,
                                                left: 0,
                                                width: `${cropLeft}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute bg-black/65 border-l border-dashed border-blue-400/80"
                                            style={{
                                                top: `${cropTop}%`,
                                                bottom: `${cropBottom}%`,
                                                right: 0,
                                                width: `${cropRight}%`,
                                            }}
                                        />

                                        {/* Bright crop focal window border */}
                                        <div
                                            className="absolute border-2 border-blue-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] pointer-events-none"
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
                                    <Eye className="w-4 h-4 text-blue-600" />
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
                                            <span className="text-[10px] font-semibold text-blue-600 mt-2 bg-blue-50 px-2 py-0.5 rounded-md">
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
                                        className="w-full accent-blue-600 h-1.5 rounded-md bg-slate-200"
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
                                        className="w-full accent-blue-600 h-1.5 rounded-md bg-slate-200"
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
                                        className="w-full accent-blue-600 h-1.5 rounded-md bg-slate-200"
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
                                        className="w-full accent-blue-600 h-1.5 rounded-md bg-slate-200"
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
                                className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-all flex items-center gap-2 shadow shadow-blue-100"
                            >
                                <Check className="w-4 h-4" />
                                Apply Precise Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                <header className="mb-8 max-w-2xl">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
                        <Layers className="h-4 w-4" /> Card merge tool
                    </span>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Front and back, one clean scan
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Add both sides, pick how they sit on the page, and download a single scanned image under 100 KB.
                        The merged page keeps the same order you see below.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                    {/* LEFT: setup */}
                    <div className="space-y-6">
                        {/* 1. Photos + layout */}
                        <section className={`${card} p-5 sm:p-6`}>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                                <div className="flex items-center gap-3">
                                    <span className={stepNum}>1</span>
                                    <h2 className="font-bold text-slate-900">Add the photos</h2>
                                </div>
                                <div role="group" aria-label="Layout" className="inline-flex rounded-xl bg-slate-100 p-1">
                                    {([
                                        ["horizontal", "Left → Right", "Side by side"],
                                        ["vertical", "Top → Bottom", "Stacked"],
                                    ] as ["horizontal" | "vertical", string, string][]).map(([value, title]) => {
                                        const active = layoutDirection === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-pressed={active}
                                                onClick={() => {
                                                    setLayoutDirection(value);
                                                    setMergedImage(null);
                                                }}
                                                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                                                    active ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
                                                }`}
                                            >
                                                <span className={`flex gap-0.5 ${value === "vertical" ? "flex-col" : ""}`}>
                                                    <span className={`block rounded-[2px] ${value === "vertical" ? "h-1.5 w-4" : "h-3 w-2.5"} ${active ? "bg-blue-600" : "bg-slate-400"}`} />
                                                    <span className={`block rounded-[2px] ${value === "vertical" ? "h-1.5 w-4" : "h-3 w-2.5"} ${active ? "bg-blue-300" : "bg-slate-300"}`} />
                                                </span>
                                                {title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={`flex gap-3 ${isHorizontal ? "flex-col sm:flex-row" : "flex-col"}`}>
                                <div className={isHorizontal ? "sm:flex-1" : ""}>{renderSlot("front", 1)}</div>
                                {swapBtn}
                                <div className={isHorizontal ? "sm:flex-1" : ""}>{renderSlot("back", 2)}</div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                <span>Tip: pick two files at once to fill front, then back.</span>
                                <label className="flex items-center gap-2 font-semibold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={autoCutOnUpload}
                                        onChange={(e) => setAutoCutOnUpload(e.target.checked)}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    Auto-cut after upload
                                </label>
                            </div>
                        </section>

                        {/* Scan style */}
                        <section className={`${card} p-5 sm:p-6`}>
                            <div className="mb-4 flex items-center gap-3">
                                <span className={stepNum}>2</span>
                                <h2 className="font-bold text-slate-900">Scan style</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    ["color", "Colour"],
                                    ["gray", "Grey"],
                                    ["bw", "Black & white"],
                                    ["original", "Original"],
                                ] as [ScanMode, string][]).map(([mode, label]) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        aria-pressed={scanMode === mode}
                                        onClick={() => {
                                            setScanMode(mode);
                                            setMergedImage(null);
                                        }}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                            scanMode === mode
                                                ? "bg-slate-900 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <details className="group mt-5 border-t border-slate-100 pt-4">
                                <summary className="flex cursor-pointer select-none list-none items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                                    <Settings className="h-4 w-4" /> More options
                                </summary>
                                <div className="mt-4 space-y-5">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={cardFit}
                                            onChange={(e) => {
                                                setCardFit(e.target.checked);
                                                setMergedImage(null);
                                            }}
                                            className="h-4 w-4 accent-blue-600"
                                        />
                                        Aadhaar card size (85.6 × 54 mm, both sides equal)
                                    </label>

                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Page format</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {([
                                                ["fit", "Tight fit"],
                                                ["a4", "A4 page"],
                                            ] as ["fit" | "a4", string][]).map(([v, label]) => (
                                                <button
                                                    key={v}
                                                    type="button"
                                                    aria-pressed={paperSize === v}
                                                    onClick={() => {
                                                        setPaperSize(v);
                                                        setMergedImage(null);
                                                    }}
                                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                                        paperSize === v
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block text-xs font-bold text-slate-600">
                                            Margin: {paddingSize}px
                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={paddingSize}
                                                onChange={(e) => {
                                                    setPaddingSize(parseInt(e.target.value));
                                                    setMergedImage(null);
                                                }}
                                                className="mt-1 w-full accent-blue-600"
                                            />
                                        </label>
                                        <label className="block text-xs font-bold text-slate-600">
                                            Gap: {gapSize}px
                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={gapSize}
                                                onChange={(e) => {
                                                    setGapSize(parseInt(e.target.value));
                                                    setMergedImage(null);
                                                }}
                                                className="mt-1 w-full accent-blue-600"
                                            />
                                        </label>
                                    </div>

                                    <label className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        Page colour
                                        <input
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => {
                                                setBackgroundColor(e.target.value);
                                                setMergedImage(null);
                                            }}
                                            className="h-8 w-10 cursor-pointer rounded border border-slate-200"
                                        />
                                        <span className="font-mono uppercase text-slate-500">{backgroundColor}</span>
                                    </label>
                                </div>
                            </details>
                        </section>
                    </div>

                    {/* RIGHT: result */}
                    <aside className="space-y-4 lg:sticky lg:top-24">
                        <section className={`${card} p-5 sm:p-6`}>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="font-bold text-slate-900">Merged result</h2>
                                {mergedSizeKb !== null && (
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${mergedSizeKb <= 100 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                        {mergedSizeKb} KB
                                    </span>
                                )}
                            </div>

                            <div className="flex min-h-[260px] items-center justify-center rounded-xl bg-[repeating-conic-gradient(#eef1f6_0_25%,#f8fafc_0_50%)] bg-[length:16px_16px] p-4 ring-1 ring-slate-200">
                                {mergedImage ? (
                                    <img
                                        src={mergedImage}
                                        alt="Merged front and back preview"
                                        className="max-h-[560px] w-full object-contain bg-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                                    />
                                ) : (
                                    <div className="max-w-[16rem] p-4 text-center">
                                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
                                            <Layers className="h-6 w-6" />
                                        </span>
                                        <p className="text-sm font-bold text-slate-800">Nothing merged yet</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Add both photos, then tap Merge. Your page shows here, {isHorizontal ? "front on the left" : "front on top"}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {mergedImage && (
                                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                                    {scanMode !== "original" && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Scanned</span>}
                                    {cardFit && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Aadhaar size</span>}
                                    {mergedSizeKb !== null && mergedSizeKb <= 100 && (
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Under 100 KB</span>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                disabled={!frontImage || !backImage || isMerging}
                                onClick={generateMergedDocument}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isMerging ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" /> Working...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" /> Merge, scan &amp; compress
                                    </>
                                )}
                            </button>

                            {mergedImage && (
                                <button
                                    type="button"
                                    onClick={downloadFinalDocument}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                                >
                                    <Download className="h-4 w-4" /> Download JPG
                                </button>
                            )}

                            <p className="mt-3 text-center text-xs text-slate-500">
                                Your photos stay on your device. Nothing is uploaded.
                            </p>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Hidden processing HTML5 Canvas Workspace */}
            <canvas ref={canvasRef} className="hidden" />
            {/* Hidden offscreen canvas for modal real-time crop compilation */}
            <canvas ref={modalPreviewCanvasRef} className="hidden" />
        </div>
    );
}
