"use client";
// https://github.com/plaid/quickstart/blob/master/frontend/src/Components/Link/index.tsx
import { useState, useEffect, useCallback } from 'react';

import {
    usePlaidLink,
    PlaidLinkOptions,
} from 'react-plaid-link';

import { Button } from '@/components/ui/button';
import { LuLink, LuLink2 } from 'react-icons/lu';

import { usePortfolioContext } from '../context/PortfolioState';

// The usePlaidLink hook manages Plaid Link creation
// It does not return a destroy function;
// instead, on unmount it automatically destroys the Link instance
const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {},
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
    token: 'GENERATED_LINK_TOKEN',
};

export default function PlainLinkButton() {
    const { currentPortfolio } = usePortfolioContext();
    const [isLinked, setIsLinked] = useState(!!currentPortfolio.item_access_token); // keeps track of whether a broker is linked
    const [LinkToken, setLinkToken] = useState(null);

    const onSuccess = useCallback(async (publicToken: string) => {
        const response = await fetch('/api/exchange-public-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                portfolio_id: currentPortfolio.id,
                public_token: publicToken,
            }),
        });

        if (response.ok) setIsLinked(true);
    }, [currentPortfolio]);

    const { open, ready } = usePlaidLink({
        token: LinkToken,
        onSuccess,
    });

    useEffect(() => {
        if (ready) open();
    }, [ready, open]);

    const onClick = useCallback(async () => {
        const response = await fetch('/api/create-link-token', {
            method: 'POST',
        });

        if (!response.ok) {
            return
        }

        const res = await response.json();
        
        setLinkToken(res.link_token);
    }, []);

    const onUnlink = useCallback(() => {

    }, []);

    return (
        <>
        {isLinked ? (
            <Button 
                variant='outline' 
                onClick={() => onUnlink()} 
            >
                <LuLink2 className="mr-2" />
                Broker Linked
            </Button>
        ) : (
            <Button variant='secondary' onClick={() => onClick()}>
                <LuLink className="mr-2" />
                Link Broker
            </Button>
        )}
        </>
    )
}
