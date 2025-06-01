import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  useQueryClient,
  useQuery,
} from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,

} from '@tanstack/react-table'
function Characters() {

  const [pagination, setPagination] = useState(() => JSON.parse(sessionStorage.getItem('currentPage')) || {
    pageIndex: 0,
    pageSize: 20,
  });
  // useEffect(()=>{
  //   if (sessionStorage.currentPage)
  //    setPagination(JSON.parse(sessionStorage.getItem('currentPage')));
  // },[])
  const queryClient = useQueryClient()
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['characterList'],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const response = await fetch(
        'https://rickandmortyapi.com/api/character/?page=' + (Number(pagination.pageIndex) + 1),
      )
      return await response.json()
    },
  })
  useEffect(() => {

    queryClient.invalidateQueries({ queryKey: ['characterList'] })
    sessionStorage.setItem('currentPage', JSON.stringify(pagination))
  }, [pagination.pageIndex])
  const columnHelper = createColumnHelper();
  const columns = [columnHelper.accessor('id', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('name', {
    cell: (info) => <Link to="/details/$ID" className="[&.active]:font-bold" params={{ ID: info.row.original.id }}> {info.getValue()}</Link>,
    footer: info => info.column.name,
  })
  ]
  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: data?.info?.count,
    pageCount: data?.info?.pages,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  })
  const rerender = () => {
    queryClient.invalidateQueries({ queryKey: ['characterList'] })

  }
  return (
    isPending ? <div>Loading ...</div> :
      error ? <h3>An error has occurred. PLease try again later.</h3> :
        <div>
          {/* <ul> */}
          <table className='character-table'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (

                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
              />
            </span>

          </div>



          <button onClick={() => rerender()} className="border p-2">
            Refresh
          </button>


        </div>
  )
}

export default Characters
