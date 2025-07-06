import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { PurchaseRequest } from "@/store/slice/listing.slice";
import { generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { ClipboardCopy } from "@/components/shared/clipboard-copy";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/store/slice/credential.slice";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { RiArrowUpDownLine } from "react-icons/ri";
import { ApproveModal } from "./approve-modal";

interface BiddingInfoProps {
  isLoadingRequests: boolean;
  purchaseRequests: Array<PurchaseRequest>;
  isOwner: boolean;
}

type GlobalFilterFn = (
  row: {
    original: {
      user?: {
        details?: {
          name?: string;
        };
      };
      initiator?: string;
      price?: number | string;
    };
  },
  columnId: string,
  filterValue: string,
) => boolean;

const globalFilterFn: GlobalFilterFn = (row, filterValue) => {
  const { user, initiator, price } = row.original;

  const name = user?.details?.name?.toLowerCase() ?? "";
  const address = initiator?.toLowerCase() ?? "";
  const amount = String(price);

  const val = filterValue.toLowerCase();

  return name.includes(val) || address.includes(val) || amount.includes(val);
};

const baseColumns: ColumnDef<PurchaseRequest>[] = [
  {
    accessorKey: "request_id",
    header: () => <div className="text-left">#ID</div>,
    cell: ({ row }) => (
      <div className="text-left">RQ-{row.getValue("request_id")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorFn: (row: PurchaseRequest) => row.user?.details.name,
    id: "user",
    header: "Initiator",
    filterFn: (row, columnId, filterValue) => {
      const name = row.getValue<string>(columnId);
      return name?.toLowerCase().includes(filterValue.toLowerCase());
    },
    cell: ({ row }) => {
      const user: User | undefined = row?.original.user;

      if (!user) return null;

      return (
        <Link
          to={`/profile?address=${user?.address}`}
          className="flex w-max items-center gap-2.5 md:gap-3"
        >
          <div className="size-12 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-0.5">
            <div className="size-full rounded-full bg-background p-0.5">
              <img
                src={generateAvatarFromAddress(user?.address)}
                alt={user?.details.name}
                width={64}
                height={64}
                className="size-full rounded-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="flex items-center gap-2">
              <p className="line-clamp-1 flex-1 text-base font-medium text-foreground transition-colors group-hover:text-primary">
                <span className="hidden sm:flex md:hidden xl:flex">
                  {user?.details.name}
                </span>
                <span className="sm:hidden md:flex xl:hidden">
                  {user?.details.name.split(" ")[0]}
                </span>
              </p>
              {user?.verified && (
                <MdVerified className="mt-px size-4 text-primary" />
              )}
            </div>
            <p className="hidden text-xs font-medium text-primary sm:flex">
              {user?.user_type}
            </p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "initiator",
    header: "Address",
    filterFn: (row, columnId, filterValue) => {
      const address: string = row.getValue(columnId) || "";
      return address.toLowerCase().includes(filterValue.toLowerCase());
    },
    cell: ({ row }) => {
      const address: string = row.getValue("initiator") || "";
      return (
        <ClipboardCopy
          value={address}
          message="Initiator's Address copied successfully"
        >
          {truncateAddr(address, 8)}
        </ClipboardCopy>
      );
    },
  },
  {
    accessorKey: "price",
    filterFn: (row, columnId, filterValue) => {
      const price = row.getValue(columnId)?.toString() ?? "";
      return price.includes(filterValue);
    },
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer select-none items-center justify-end gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Bid Amount</span>
        <RiArrowUpDownLine className="size-4" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      })
        .format(amount)
        .split(".")[0];

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

const actionColumn: ColumnDef<PurchaseRequest> = {
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const request: PurchaseRequest = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={buttonVariants({
              className: "ml-auto size-8",
              variant: "outline",
              size: "icon",
            })}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          <ApproveModal request={request}>
            <div className="relative flex h-11 cursor-pointer select-none items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 sm:rounded-lg [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
              Approve Bid
            </div>
          </ApproveModal>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const BiddingInfo: React.FC<BiddingInfoProps> = ({
  isLoadingRequests,
  purchaseRequests,
  isOwner,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = isOwner ? [...baseColumns, actionColumn] : baseColumns;

  const table = useReactTable({
    data: purchaseRequests.sort((a, b) => b.request_id - a.request_id),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
  });

  React.useEffect(() => {
    const updateColumnVisibility = () => {
      const width = window.innerWidth;
      const requestId = table?.getColumn("request_id");
      const initiator = table?.getColumn("initiator");

      if (width <= 1280 && requestId) requestId.toggleVisibility(false);
      else if (requestId) requestId.toggleVisibility(true);

      if (width <= 1024 && initiator) initiator.toggleVisibility(false);
      else if (initiator) initiator.toggleVisibility(true);
    };

    updateColumnVisibility();
    window.addEventListener("resize", updateColumnVisibility);
    return () => window.removeEventListener("resize", updateColumnVisibility);
  }, [table]);

  return (
    <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10">
      <div className="flex flex-col gap-4 sm:mb-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col">
          <p className="text-base font-semibold uppercase md:text-lg">
            Bidding Info
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Input
            placeholder="Search by name, address or amount..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-11 w-full sm:max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={buttonVariants({
                  variant: "outline",
                  className: "gap-2 rounded-xl",
                })}
              >
                <span>Columns</span>
                <ChevronDown className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "user" && "Initiator"}
                      {column.id === "initiator" && "Address"}
                      {column.id === "price" && "Bid Amount"}
                      {column.id === "request_id" && "Request ID"}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border dark:sm:bg-neutral-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-sm font-normal sm:font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingRequests ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-20">
                    <Skeleton className="size-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 text-sm font-normal sm:py-4 sm:font-medium"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-80 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Total requests ( <strong>{table.getRowModel().rows.length}</strong> )
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
