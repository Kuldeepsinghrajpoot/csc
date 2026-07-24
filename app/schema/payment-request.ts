import * as z from "zod";

export const requestSchema = z.object({
    amount: z.coerce.number()
        .min(1, { message: "Min ₹1" })
        .max(1000000, { message: "Limit ₹10L" }),
});
