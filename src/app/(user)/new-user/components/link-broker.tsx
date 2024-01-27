"use client";
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { Button } from '@/components/ui/button';

import { LuLink } from 'react-icons/lu';

interface LinkBrokerProps {
    onSuccess: (publicToken: string) => void
}

export default function LinkBroker({ onSuccess }: LinkBrokerProps) {
    const [LinkToken, setLinkToken] = useState<string | null>(null);

    const { open, ready } = usePlaidLink({
        token: LinkToken,
        onSuccess,
    });

    useEffect(() => {
        // open modal on ready
        if (ready) open();
    }, [ready, open]);

    const onLink = useCallback(async () => {
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
        <Button onClick={onLink}>
            <LuLink className="mr-2" />
            Link Broker
        </Button>
    )
}