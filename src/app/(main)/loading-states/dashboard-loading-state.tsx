
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { LuPlus } from "react-icons/lu";

export default function DashboardLoadingState() {

  return (
    <>
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-slate-800 mb-0">
                    My Portfolios
                </div>
                <Button>
                    <LuPlus
                        className="mr-2"
                    />
                        New Portfolio
                </Button>
            </div>
        </div>
        <Skeleton className="w-[240px] h-10"/>
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 items-center justify-between gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="h-full flex items-center justify-center">
                    <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                        <Skeleton className="w-[240px] h-10"/>
                    </CardContent>
                </Card>
            ))}
            </div>
        ))}
    </>
  );
};