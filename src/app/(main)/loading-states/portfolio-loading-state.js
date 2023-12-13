
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { LuPencil, LuLink, LuTrendingUp } from "react-icons/lu";

export default function PortfolioLoadingState() {

  return (
    <>
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <Skeleton className="w-[240px] h-10"/>
                <div className="flex gap-4">
                    <Button>
                        <LuLink 
                            className="mr-2"
                        />
                        Link Broker
                    </Button>
                    <Button>
                        <LuPencil 
                            className="mr-2"
                        />
                        Edit Portfolio
                    </Button>
                    <Button>
                        <LuTrendingUp 
                            className="mr-2"
                        />
                        Get Advice
                    </Button>
                </div>
            </div>
        </div>
        <div className="gap-4 flex-wrap grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between grid mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
            <Card className="h-full flex items-center justify-center">
                <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                    <Skeleton className="w-[240px] h-10"/>
                </CardContent>
            </Card>
            ))}
        </div>
        <div className="flex gap-3 mb-4 px-3">
            <Button variant="tab">
                Recommendations
            </Button>
            <Button variant="tab" className="underline">
                Overview
            </Button>
            <Button variant="tab">
                Income
            </Button>
        </div>
    </>
  );
};