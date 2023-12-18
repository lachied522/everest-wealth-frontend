import { ColumnDef, Column } from "@tanstack/react-table";

import Link from "next/link";

import { cn } from "@/components/lib/utils";

import { 
  LuChevronsUpDown, 
  LuChevronUp, 
  LuChevronDown,
} from "react-icons/lu";

import { Button } from "@/components/ui/button"

export type Transaction = {
    symbol: string;
    name: string;
    units: number;
    price: number;
    brokerage: number;
    transaction: string;
    value: number;
}

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Badge = ({ type }: {
  type: string
}) => {
    return (
      <>
        <div className={cn(
            "flex border rounded-full px-2.5 py-2 text-xs items-center justify-center h-[30px] w-[90px] text-center text-white",
            type==="Buy" && "text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee] ",
            type==="Sell" && "text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0] "
        )}>
            {type}
        </div>
      </>
    );
}


interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

function AdviceTableColumnHeader<TData, TValue> ({
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

export const columns: ColumnDef<Transaction, any>[] = [
    {
      accessorKey: 'transaction',
      header: ({ column }) => (
        <div className="ml-8" >Transaction</div>
      ),
      cell: ({ row }) => (
          <div className="ml-8">
            <Badge type={String(row.getValue('transaction'))}/>
          </div>
      )
    },
    {
        accessorKey: 'symbol',
        header: ({ column }) => (
          <div>Symbol</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link href={`/symbol/${row.getValue('symbol')}`} className="font-semibold">
              {row.getValue('symbol')}
            </Link>
          </div>
        )
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
          <div>Name</div>
        ),
    },
    {
        accessorKey: 'units',
        header: ({ column }) => (
          <div>Units</div>
        )
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <div>Price</div>
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('price'))
      )
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
          <div>Value</div>
        ),
        cell: ({ row }) => (
          USDollar.format(row.getValue('value'))
        )
    },
    {
      accessorKey: 'brokerage',
      header: ({ column }) => (
        <div>Brokerage</div>
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('brokerage') || 0)
      )
    },
    {
      accessorKey: 'net',
      header: ({ column }) => (
        <div>Net</div>
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('net'))
      )
    },
]