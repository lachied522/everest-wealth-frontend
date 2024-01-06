import { plaidClient } from "@/lib/plaid-client";

import type { CountryCode, Products } from "plaid";

export async function POST() {
    if (!process.env.PLAID_CLIENT_ID) return;

    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: process.env.PLAID_CLIENT_ID },
        client_name: "Everest Wealth",
        language: 'en',
        products: ['investments' as Products],
        country_codes: ['US' as CountryCode],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return Response.json(tokenResponse.data);
}