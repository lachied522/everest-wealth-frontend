"use client";
// https://github.com/plaid/quickstart/blob/master/frontend/src/Components/Link/index.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { usePlaidLink } from 'react-plaid-link';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LuArrowUpRight, LuLink, LuLink2, LuLink2Off } from 'react-icons/lu';

import { usePortfolioContext, PortfolioState } from "@/context/portfolio/PortfolioState";
import { useGlobalContext, GlobalState } from '@/context/GlobalState';

import type { Institution } from 'plaid';

export default function BrokerPopup() {
    const { dispatch } = useGlobalContext() as GlobalState;
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const [institutionData, setInstitutionData] = useState<Institution | null>(null);
    const [LinkToken, setLinkToken] = useState<string | null>(null);
    const [isLoadingUnlink, setIsLoadingUnlink] = useState<boolean>(false);

    const isLinked: boolean = useMemo(() => {
        if (!currentPortfolio) return false;

        return currentPortfolio.item_access_token;
    }, [currentPortfolio.item_access_token]);

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

        if (response.ok) {
            dispatch({
                type: "UPDATE_SETTINGS",
                payload: {
                    id: currentPortfolio.id,
                    data: {
                        item_access_token: true,
                    }
                }
            })
        }
    }, [currentPortfolio.id, dispatch]);

    const { open, ready } = usePlaidLink({
        token: LinkToken,
        onSuccess,
    });

    useEffect(() => {
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

    const fetchInstitution = useCallback(async (id: string): Promise<Institution> => {
        return await fetch(`/api/get-institution?for=${id}`).then(res => res.json());
    }, []);

    useEffect(() => {
        let mounted = true;
        getInstitution();

        return () => {
            mounted = false;
        }

        async function getInstitution() {
            if (!isLinked) return

            const data = await fetchInstitution(currentPortfolio.id);

            if (mounted) setInstitutionData(data);
        }
    }, [isLinked, currentPortfolio.id, setInstitutionData, fetchInstitution]);

    const onUnlink = useCallback(() => {
        setIsLoadingUnlink(true);

        fetch('/api/remove-token', {
            method: "POST",
            body: JSON.stringify({
                portfolio_id: currentPortfolio.id,
            }),
            headers: {
                "Content-Type": "application/json",
            }
          })
        .then(res => res.json())
        .then(({ success } : { success: boolean }) => {
            if (success) {
                dispatch({
                    type: "UPDATE_SETTINGS",
                    payload: {
                        id: currentPortfolio.id,
                        data: {
                            item_access_token: false,
                        }
                    }
                })
            }
        })
        .finally(() => setIsLoadingUnlink(false));
    }, [currentPortfolio.id, setIsLoadingUnlink, dispatch]);

    return (
        <>
            {isLinked ? (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline'>
                        <LuLink2 className="mr-2" />
                        Broker Linked
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your Broker</DialogTitle>
                    </DialogHeader>
                    <div className="h-[60vh] flex flex-col items-stretch p-6">
                        <div className="text-lg text-slate-800 mb-6">Broker Linked</div>
                        <div className="flex items-center justify-between">
                            {institutionData ? (
                            <Link
                                href={institutionData.url || ""} 
                                target="_blank"
                                placeholder="blur"
                                className="no-underline"
                            >
                                <div className="flex items-center gap-3">
                                    {institutionData.logo && (
                                    <Image 
                                        src={`data:image/png;base64,${institutionData.logo}`}
                                        width={36}
                                        height={36}
                                        alt="Broker Logo"
                                    />
                                    )}
                                    <div className="flex items-center gap-1">
                                        <div className="text-base font-semibold text-slate-700">{institutionData.name}</div>
                                        <LuArrowUpRight className="h-3.5 w-3.5 text-slate-700" />
                                    </div>
                                </div>
                            </Link>
                            ) : (
                            <Skeleton className="h-8" />
                            )}
                            {isLoadingUnlink ? (
                            <Button variant="secondary" disabled>
                                Please wait...
                            </Button>
                            ) : (
                            <Button variant="secondary" onClick={onUnlink}>
                                <LuLink2Off className="mr-2" />
                                Unlink
                            </Button>
                            )}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 items-center gap-6">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button">
                                Done
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
            ) : (
            <Button variant='secondary' onClick={onLink}>
                <LuLink className="mr-2" />
                Link Broker
            </Button>
            )}
        </>
    )
}
