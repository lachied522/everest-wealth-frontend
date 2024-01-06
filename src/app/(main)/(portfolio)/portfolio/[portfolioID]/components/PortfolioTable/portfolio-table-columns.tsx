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
        className={cn(
          "flex items-center space-x-2 text-sm h-8 data-[state=open]:bg-accent",
          title!=="Symbol" && "ml-6", 
          className
        )}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        {column.getIsSorted() === "desc" ? (
          <LuChevronDown className="ml-2 h-3.5 w-3.5" />
        ) : column.getIsSorted() === "asc" ? (
          <LuChevronUp className="ml-2 h-3.5 w-3.5" />
        ) : (
          <LuChevronsUpDown className="ml-2 h-3.5 w-3.5" />
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
          <div className="flex items-center gap-2 ml-[28px]">
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
    },
    {
      accessorKey: 'last_price',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"Price"} />
      ),
      cell: ({ row }) => (
        <div>{USDollar.format(row.getValue('last_price'))}</div>
      )
    },
    {
        accessorKey: 'totalCost',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Cost"} />
        ),
        cell: ({ row }) => (
          <div>{USDollar.format(row.getValue('totalCost'))}</div>
        )
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Value"} />
        ),
        cell: ({ row }) => (
          <div>{USDollar.format(row.getValue('value'))}</div>
        )
    },
    {
        accessorKey: 'totalProfit',
        header: ({ column }) => (
          <PortfolioTableColumnHeader column={column} title={"Profit/Loss"} />
        ),
        cell: ({ row }) => (
          <div>{USDollar.format(row.getValue('totalProfit'))}</div>
        )
    },
    {
      accessorKey: 'PE',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"PE Ratio"} />
      ),
    },
    {
      accessorKey: 'trailing_EPS',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"EPS"} />
      ),
      cell: ({ row }) => (
        <div>{USDollar.format(row.getValue('trailing_EPS'))}</div>
      )
  },
  {
    accessorKey: 'forward_EPS',
    header: ({ column }) => (
      <PortfolioTableColumnHeader column={column} title={"EPS Fwd"} />
    ),
    cell: ({ row }) => (
      <div>{USDollar.format(row.getValue('forward_EPS'))}</div>
    )
  },
  {
    accessorKey: 'EPSgrowth',
    header: ({ column }) => (
      <PortfolioTableColumnHeader column={column} title={"EPS Growth"} />
    ),
    cell: ({ row }) => (
      (100*Number(row.getValue('EPSgrowth'))).toFixed(2)+'%'
    )
  },
  {
      accessorKey: 'sector',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"Sector"} />
      ),
  },
  {
    accessorKey: 'div',
    header: ({ column }) => (
      <PortfolioTableColumnHeader column={column} title={"Div. Amount"} />
    ),
    cell: ({ row }) => (
      <div>{USDollar.format(row.getValue('div'))}</div>
    )
  },
  {
      accessorKey: 'div_yield',
      header: ({ column }) => (
        <PortfolioTableColumnHeader column={column} title={"Div. Yield"} />
      ),
      cell: ({ row }) => (
        (100*Number(row.getValue('div_yield'))).toFixed(2)+'%'
      )
  },
  {
    accessorKey: 'totalDiv',
    header: ({ column }) => (
      <PortfolioTableColumnHeader column={column} title={"Div. Total"} />
    ),
    cell: ({ row }) => (
      <div>{USDollar.format(row.getValue('totalDiv'))}</div>
    )
  },
  {
    accessorKey: 'weight',
    header: ({ column }) => (
      <PortfolioTableColumnHeader column={column} title={"Weight"} />
    ),
    cell: ({ row }) => (
      (100*Number(row.getValue('weight'))).toFixed(2)+'%'
    )
  },
]