// route.ts or actions.ts
export async function fetchPhonePeToken() {
    const url =
        "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

    const params = new URLSearchParams();
    params.append("client_version", "1");
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.PHONEPE_CLIENT_ID!); // Replace with Env Var
    params.append(

        "client_secret",
        process.env.PHONEPE_CLIENT_SECRET!,
    ); // Replace with Env Var

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(), // Crucial: must be a string
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("PhonePe Auth Error Details:", data);
            throw new Error(data.error_description || "Failed to fetch token");
        }

        return data; // This usually contains { access_token, expires_in, ... }
    } catch (error) {
        console.error("fetchPhonePeToken Exception:", error);
        throw error;
    }
}
