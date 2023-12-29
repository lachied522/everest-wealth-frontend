import { ColumnDef, Column } from "@tanstack/react-table";

import Link from "next/link";

import { cn } from "@/components/lib/utils";

import { 
  LuChevronsUpDown, 
  LuChevronUp, 
  LuChevronDown,
  LuGlobe2,
} from "react-icons/lu";

import { GiAustralia } from "react-icons/gi";

import { Button } from "@/components/ui/button";

import type { PopulatedHolding } from "@/types/types";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

function PortfolioTableColumnHeader<TData, TValue> ({
    column,
    title,
    className,
  }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
    }

    return (
      <Button
        variant="ghost"
        className={cn("flex items-center space-x-2 text-sm -ml-3 h-8 data-[state=open]:bg-accent", className)}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        {column.getIsSorted() === "desc" ? (
          <LuChevronDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <LuChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <LuChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    )
}

export const columns: ColumnDef<PopulatedHolding>[] = [
    // {
    //     accessorKey: 'domestic',
    //     header: '', //empty header
    //     cell: ({ row }) => (
    //       <div className="flex items-center justify-center">
    //         {row.getValue('domestic')? <GiAustralia size={20} />: <LuGlobe2 size={20} />}
    //       </div>
    //     )
    // },
    {
        accessorKey: 'symbol',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Symbol"} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original['domestic']? <GiAustralia size={18} />: <LuGlobe2 size={18} />}
            <Link href={`/symbol/${row.getValue('symbol')}`} className="font-semibold">
              {row.getValue('symbol')}
            </Link>
          </div>
        )
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Name"} />
        ),
        maxSize: 24
    },
    {
      accessorKey: 'units',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"Units"} />
      ),
      cell: ({ row }) => (
        <div className="text-right mr-3">{row.getValue('units')}</div>
      )
    },
    {
        accessorKey: 'totalCost',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Cost"} />
        ),
        cell: ({ row }) => (
          <div className="text-right mr-3">{USDollar.format(row.getValue('totalCost'))}</div>
        )
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Value"} />
        ),
        cell: ({ row }) => (
          <div className="text-right mr-3">{USDollar.format(row.getValue('value'))}</div>
        )
    },
    {
        accessorKey: 'totalProfit',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Profit/Loss"} />
        ),
        cell: ({ row }) => (
          <div className="text-right mr-3">{USDollar.format(row.getValue('totalProfit'))}</div>
        )
    },
    {
        accessorKey: 'sector',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Sector"} />
        ),
    },
    {
        accessorKey: 'div_yield',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Yield"} />
        ),
        cell: ({ row }) => (
          (100*Number(row.getValue('div_yield'))).toFixed(2)+'%'
        )
    },
    {
      accessorKey: 'weight',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"Weight"} />
      ),
      cell: ({ row }) => (
        '0%'
      )
    },
]