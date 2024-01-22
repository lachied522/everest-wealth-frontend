import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";

import { cn } from "@/components/lib/utils";

import { 
  LuCheck,
  LuX,
} from "react-icons/lu";

export type Transaction = {
    symbol: string;
    name: string;
    units: Number;
    price: Number;
    transaction: string;
    value: Number;
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


interface DataTableColumnHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}

function AdviceTableColumnHeader ({
    title,
    className,
}: DataTableColumnHeaderProps) {

    return (
      <div className={cn("flex items-center justify-center text-sm h-8 data-[state=open]:bg-accent", className)} >
        {title}
      </div>
    )
}

const IsActionedIndicator = ({ status }: { status?: string }) => {

  return (
    <div className="flex items-center justify-center">
        {status? (
        <LuCheck size={20} />
        ) : (
        <LuX size={20} />
        )}
    </div>
  )
}

export const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'transaction',
      header: ({ column }) => (
        <AdviceTableColumnHeader title='Transaction' />
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
          <AdviceTableColumnHeader title='Symbol' />
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
          <AdviceTableColumnHeader title='Name' />
        ),
    },
    {
        accessorKey: 'units',
        header: ({ column }) => (
          <AdviceTableColumnHeader title='Units' />
        )
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <AdviceTableColumnHeader title='Price' />
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('price'))
      )
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
          <AdviceTableColumnHeader title='Value' />
        ),
        cell: ({ row }) => (
          USDollar.format(row.getValue('value'))
        )
    },
    {
      accessorKey: 'brokerage',
      header: ({ column }) => (
        <AdviceTableColumnHeader title='Brokerage' />
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('brokerage') || 0)
      )
    },
    {
      accessorKey: 'net',
      header: ({ column }) => (
        <AdviceTableColumnHeader title='Net' />
      ),
      cell: ({ row }) => (
        USDollar.format(row.getValue('net'))
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <AdviceTableColumnHeader title='Actioned?' />
      ),
      cell: ({ row }) => (
        <IsActionedIndicator status={row.getValue('status')} />
      )
    },
]