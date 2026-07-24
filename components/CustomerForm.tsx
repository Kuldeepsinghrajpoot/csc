"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import Image from "next/image";
import { banks } from "@/app/data/banks";

const customerSchema = z.object({
    bank: z.string().min(1, "Select Bank"),
    customerName: z.string().min(3, "Customer name is required"),
    fatherName: z.string().min(3, "Father name is required"),
    accountNumber: z.string().min(8, "Invalid account number"),
    ifsc: z.string().min(5, "Invalid IFSC"),
    mobile: z.string().min(10, "Invalid mobile number"),
    cif: z.string().min(4, "Invalid CIF"),
    address: z.string().min(5, "Address is required"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

import { CustomerFormProps } from "@/lib/types";

export default function CustomerForm({
    customer,
    setCustomer,
}: CustomerFormProps) {
    const [photo, setPhoto] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: customer,
    });

    useEffect(() => {
        reset(customer);
    }, [customer, reset]);
    const onSubmit = (data: CustomerFormData) => {
        console.log(data);
    };

    function handlePhotoUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const image = reader.result as string;

            setPhoto(image);

            setCustomer((prev) => ({
                ...prev,
                photo: image,
            }));
        };

        reader.readAsDataURL(file);
    }

    return (
        <div className="rounded-md bg-white p-5 shadow-sm ">

            <h2 className="mb-3 text-xl font-semibold">
                Customer Details
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Select Bank
                        </label>

                        <select
                            className="w-full rounded-lg border p-3"
                            value={customer.bank}
                            onChange={(e) => {
                                console.log("Selected Bank:", e.target.value);

                                setCustomer((prev) => ({
                                    ...prev,
                                    bank: e.target.value,
                                }));
                            }}
                        >
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-red-500">
                            {errors.bank?.message}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            placeholder="Customer Name"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("customerName", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        customerName: e.target.value,
                                    })),
                            })}
                        />
                        <div>
                            { }
                        </div>

                        <p className="text-sm text-red-500">
                            {errors.customerName?.message}
                        </p>
                    </div>


                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Father Name
                        </label>

                        <input
                            type="text"
                            placeholder="Father Name"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("fatherName", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        fatherName: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.fatherName?.message}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Account Number
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("accountNumber", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        accountNumber: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.accountNumber?.message}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            IFSC Code
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("ifsc", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        ifsc: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.ifsc?.message}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("mobile", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        mobile: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.mobile?.message}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Customer ID (CIF)
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("cif", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        cif: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.cif?.message}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Address
                        </label>

                        <textarea
                            rows={3}
                            className="w-full rounded-sm border p-2 text-sm"
                            {...register("address", {
                                onChange: (e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    })),
                            })}
                        />

                        <p className="text-sm text-red-500">
                            {errors.address?.message}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            Customer Photo
                        </label>

                        <label className="flex cursor-pointer items-center justify-center rounded-sm border-2 border-dashed p-3 hover:bg-gray-50">
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handlePhotoUpload}
                            />

                            <div className="text-center">
                                <Upload className="mx-auto mb-2 h-8 w-8" />
                                <p>Upload Photo</p>
                            </div>
                        </label>


                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-sm bg-blue-600 py-2 font-semibold text-sm text-white hover:bg-blue-700"
                >
                    Save Customer
                </button>
            </form>

        </div>
    )
}