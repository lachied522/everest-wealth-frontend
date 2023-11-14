import { useRouter } from "next/navigation";


const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL || "";

interface NewAdviceRequest {
    session: {
        user: {
            id: string
        }
        access_token: string
    }
    data: {
        amount: number
        reason: string
        portfolio_id: string
    }

}

export function GetNewAdvice({ data, session }: NewAdviceRequest) {
    const socket = new WebSocket(`${WEB_SERVER_BASE_URL}/${session.user.id}`);

    if (socket.readyState !== WebSocket.CLOSED) {
        socket.send(JSON.stringify(data));
    }
}