import { plaidClient } from "@/lib/plaid-client";

export async function POST() {
    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: process.env.PLAID_CLIENT_ID },
        client_name: "Everest Wealth",
        language: 'en',
        products: ['investments'],
        country_codes: ['US'],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return Response.json(tokenResponse.data);
}