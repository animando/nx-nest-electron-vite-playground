'use client';

import {
  notUndefined,
  useVirtualizer,
  VirtualItem,
} from '@tanstack/react-virtual';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  Header,
  Row,
  SortingState,
} from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import cx from 'clsx';
import { useInfiniteScroll } from '../../paging';

export type UITransaction = {
  trxId: string;
  transactionType: string;
  transactionDescription: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};
type TransactionsViewProps = {
  transactions: UITransaction[];
  hasMore: boolean;
  isLive: boolean;
  isLoading: boolean;
  loadMore: () => void;
};
const columnHelper = createColumnHelper<UITransaction>();

const HeaderCell = ({ header }: { header: Header<UITransaction, unknown> }) => (
  <th
    colSpan={header.colSpan}
    style={{
      width: header.getSize() + 2,
    }}
    className={cx(
      'px-4 py-2 border border-gray-500 sticky z-20 top-0 bg-gray-500 text-white',
    )}
  >
    {header.isPlaceholder ? null : (
      <div
        {...{
          className: header.column.getCanSort()
            ? 'cursor-pointer select-none'
            : '',
          onClick: header.column.getToggleSortingHandler(),
        }}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: ' 🔼',
          desc: ' 🔽',
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    )}
  </th>
);

const TableRow = ({
  row,
  virtualRow,
}: {
  row: Row<UITransaction>;
  virtualRow: VirtualItem;
  idx: number;
}) => (
  <tr
    key={row.id}
    style={{
      height: `${virtualRow.size}px`,
    }}
  >
    {row.getVisibleCells().map((cell) => {
      return (
        <td key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    })}
  </tr>
);

export const TransactionsView = ({
  transactions,
  hasMore,
  loadMore,
}: TransactionsViewProps) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const columns = useMemo<Array<ColumnDef<UITransaction, string>>>(
    () => [
      columnHelper.accessor('trxId', {
        cell: (info) => <span>{info.getValue()}</span>,
        header: 'Id',
      }),
      columnHelper.accessor('transactionType', {
        cell: (info) => info.getValue(),
        header: 'Type',
      }),
      columnHelper.accessor('transactionDescription', {
        cell: (info) => info.getValue(),
        header: 'Description',
        minSize: 600,
        enableSorting: false,
      }),
      columnHelper.accessor('transactionDate', {
        cell: (info) => formatDate(info.getValue(), 'dd-MM-yyyy HH:mm:ss'),
        header: 'Transaction Date',
      }),
      columnHelper.accessor('createdAt', {
        cell: (info) => info.getValue(),
        header: () => 'Ledger Date',
        enableSorting: true,
        sortingFn: 'datetime',
        sortDescFirst: true,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  useInfiniteScroll({
    virtualizer,
    data: transactions,
    loadMore,
    hasMore,
    threshold: 0.9,
  });
  const virtualItems = virtualizer.getVirtualItems();
  const [before, after] =
    virtualItems.length > 0
      ? [
          notUndefined(virtualItems[0]).start -
            virtualizer.options.scrollMargin,
          virtualizer.getTotalSize() -
            notUndefined(virtualItems[virtualItems.length - 1]).end,
        ]
      : [0, 0];
  const colSpan = 4;

  return (
    <>
      <div ref={parentRef} className="max-h-[600px] overflow-y-scroll">
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <HeaderCell key={header.id} header={header} />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {before > 0 && (
                <tr>
                  <td colSpan={colSpan} style={{ height: before }} />
                </tr>
              )}
              {virtualItems.map((virtualRow, index) => (
                <TableRow
                  key={rows[virtualRow.index].id}
                  row={rows[virtualRow.index]}
                  idx={index}
                  virtualRow={virtualRow}
                />
              ))}
              {after > 0 && (
                <tr>
                  <td colSpan={colSpan} style={{ height: after }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
