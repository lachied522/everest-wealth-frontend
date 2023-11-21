"use client";
import { useRouter } from "next/navigation";

import useWebSocket, { ReadyState } from 'react-use-websocket';


const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL|| "";

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

export function StreamNewAdvice({ data, session }: NewAdviceRequest) {
    console.log(data);
    const { sendMessage, lastMessage, readyState } = useWebSocket(`${WEB_SOCKET_URL}/${session.user.id}`, {
        onOpen: () => console.log('opened'),
    });
}