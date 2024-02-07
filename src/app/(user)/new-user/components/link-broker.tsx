"use client";
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { Button } from '@/components/ui/button';

import { LuLink, LuLink2 } from 'react-icons/lu';

interface LinkPopupProps {
    setPublicToken: (publicToken: string) => void
}

export default function LinkPopup({ setPublicToken }: LinkPopupProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLinked, setIsLinked] = useState<boolean>(false);
    const [LinkToken, setLinkToken] = useState<string | null>(null);

    const onSuccess = useCallback((publicToken: string) => {
        setIsLinked(true);
        setPublicToken(publicToken);
    }, [])

    const { open, ready } = usePlaidLink({
        token: LinkToken,
        onSuccess,
        onExit: () => setIsLoading(false),
    });

    useEffect(() => {
        // open modal on ready
        if (ready) open();
    }, [ready, open]);

    const onClick = useCallback(async () => {
        setIsLoading(true);
        const response = await fetch('/api/create-link-token', {
            method: 'POST',
        });

        if (!response.ok) {
            return
        }

        const res = await response.json();

        setLinkToken(res.link_token);
    }, [setLinkToken]);
    
    return (
        <>
            {!isLinked? (
            <Button
                variant="ghost"
                onClick={onClick}
                disabled={isLoading}
            >
                <LuLink className="mr-2" />
                {!isLoading ? "Link Broker": "Loading..."}
            </Button>
            ) : (
            <Button variant='outline' disabled>
                <LuLink2 className="mr-2" />
                Broker Linked
            </Button>
            )}
        </>
    )
}