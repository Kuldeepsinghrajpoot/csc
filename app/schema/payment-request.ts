import * as z from "zod";

export const requestSchema = z.object({
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number" }),
    amount: z.coerce.number()
        .min(1, { message: "Min ₹1" })
        .max(1000000, { message: "Limit ₹10L" }),
});
