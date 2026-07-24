"use client";

import { useRef } from "react";
import { PassbookPreviewProps } from "@/lib/types";
import { banks } from "@/app/data/banks";

export default function PassbookPreview({
    customer,
}: PassbookPreviewProps) {
    const bank =
        banks.find((b) => b.id === customer.bank) ?? banks[0];

    const today = new Date().toLocaleDateString("en-IN");

    const passbookRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = async () => {
        if (!passbookRef.current) return;

        try {
            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import("html2canvas"),
                import("jspdf"),
            ]);

            // jsPDF cannot parse modern CSS color functions (lab, oklch, color-mix, etc.)
            // that Tailwind v4 and modern browsers emit as computed styles.
            // Fix: walk every element in the subtree and replace any unsupported color
            // value with a plain hex fallback BEFORE html2canvas reads the styles.
            const UNSUPPORTED_COLOR = /\b(lab|oklab|oklch|lch|color-mix|color)\s*\(/i;

            const fixColors = (el: HTMLElement) => {
                const style = el.style;
                const computed = window.getComputedStyle(el);

                const props = [
                    "color",
                    "backgroundColor",
                    "borderColor",
                    "borderTopColor",
                    "borderRightColor",
                    "borderBottomColor",
                    "borderLeftColor",
                    "outlineColor",
                    "textDecorationColor",
                ] as const;

                props.forEach((prop) => {
                    const computedVal = computed[prop];
                    if (computedVal && UNSUPPORTED_COLOR.test(computedVal)) {
                        // Convert the modern color to a canvas pixel value (the browser
                        // already knows how to render it — we just need a hex string).
                        try {
                            const tmp = document.createElement("div");
                            tmp.style.position = "absolute";
                            tmp.style.opacity = "0";
                            tmp.style.pointerEvents = "none";
                            tmp.style[prop] = computedVal;
                            document.body.appendChild(tmp);
                            const resolved = window.getComputedStyle(tmp)[prop];
                            document.body.removeChild(tmp);
                            // resolved is now rgb(...) which jsPDF handles fine
                            style[prop] = resolved;
                        } catch {
                            style[prop] = prop.toLowerCase().includes("background")
                                ? "#ffffff"
                                : "#000000";
                        }
                    }
                });

                Array.from(el.children).forEach((child) => {
                    if (child instanceof HTMLElement) fixColors(child);
                });
            };

            // Clone the node so we don't mutate the live UI
            const clone = passbookRef.current.cloneNode(true) as HTMLElement;
            clone.style.position = "absolute";
            clone.style.top = "-9999px";
            clone.style.left = "-9999px";
            clone.style.width = passbookRef.current.offsetWidth + "px";
            document.body.appendChild(clone);

            fixColors(clone);

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: "#ffffff",
            });

            document.body.removeChild(clone);

            const imgData = canvas.toDataURL("image/jpeg", 0.98);

            const margin = 10;
            const pdfWidth = 210;
            const usableWidth = pdfWidth - margin * 2;
            const imgHeight = usableWidth * (canvas.height / canvas.width);

            const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
            pdf.addImage(imgData, "JPEG", margin, margin, usableWidth, imgHeight);
            pdf.save(`Passbook_${customer.customerName.replace(/\s+/g, "_")}.pdf`);
        } catch (err) {
            console.error("PDF export failed:", err);
            if (err instanceof Error) {
                alert(`PDF export failed: ${err.message}`);
            } else {
                alert("PDF export failed. Check the browser console for details.");
            }
        }
    };

    return (
        <div className="w-full lg:sticky lg:top-5">
            <div className="rounded-sm bg-white shadow-sm p-4 md:p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold uppercase tracking-[0.12em] text-slate-900">
                            Identity Card / Mini Passbook
                        </h2>
                        <p className="text-xs text-slate-500">
                            A compact passbook for customer identity.
                        </p>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                        Export PDF
                    </button>
                </div>

                <div ref={passbookRef} className="overflow-hidden rounded-sm border bg-white">
                    {/* Header */}
                    <div
                        className="px-5 py-4 md:px-6 md:py-5"
                        style={{
                            backgroundColor: bank.color,
                            color: bank.textColor,
                        }}
                    >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-sm bg-white p-3 text-slate-900">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path d="M4 6h16v2H4V6zm2 4h12v2H6v-2zm-2 4h16v2H4v-2zm2 4h12v2H6v-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                                        {bank.name}
                                    </p>
                                    <p className="text-xs opacity-90">
                                        Payments Bank
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs leading-5 md:text-right text-white/90 max-w-xs">
                                Gram vijaypur Post vijaypur Tehsil Kulpahar District Mahoba Uttar Pradesh - 210429
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="border-t px-4 py-4 md:px-5 md:py-5">
                        <div className="grid gap-4 md:grid-cols-[95px_minmax(180px,1fr)] lg:grid-cols-[120px_minmax(220px,1fr)]">
                            {/* Photo */}
                            <div>
                                <div className="h-36 w-full bg-white border border-slate-200 p-3 text-center text-xs text-slate-400">
                                    {customer.photo ? (
                                        /*
                                         * Using a plain <img> instead of next/image here
                                         * because html2canvas cannot capture next/image's
                                         * optimised /_next/image?url=... URLs (cross-origin
                                         * canvas taint). crossOrigin="anonymous" is required
                                         * so html2canvas can read the pixel data.
                                         */
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={customer.photo}
                                            alt="Customer"
                                            crossOrigin="anonymous"
                                            className="mx-auto h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center">
                                            <span>Paste Photo Here</span>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                    Authorized Signatory
                                </p>
                            </div>

                            {/* Details */}
                            <div className="grid gap-2 p-0">
                                <DetailRow
                                    label="Account Holder Name"
                                    value={customer.customerName}
                                />
                                <DetailRow
                                    label="Account Number"
                                    value={customer.accountNumber}
                                />
                                <DetailRow
                                    label="IFSC Code"
                                    value={customer.ifsc || `${bank.ifscPrefix}0000001`}
                                />
                                <DetailRow
                                    label="Mobile Number"
                                    value={customer.mobile}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 bg-slate-100 px-4 py-4 md:px-5 md:py-4">
                        <div className="flex flex-col gap-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p>Generated at: Pradeep CSC &amp; Digital Seva Kendra</p>
                                <p>Date: {today}</p>
                            </div>
                            <p className="font-semibold uppercase tracking-[0.2em] text-slate-700">
                                Bank Official Seal &amp; Sign
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DetailRowProps {
    label: string;
    value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="flex items-center justify-between rounded rounded-b-sm border px-3 py-2 text-sm">
            <span className="text-[15px] text-slate-500">{label}</span>
            <span className="font-semibold text-slate-900">{value || "-"}</span>
        </div>
    );
}