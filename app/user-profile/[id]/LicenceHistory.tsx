import React, { useState, useMemo, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { licenceList } from 'app/services/api';
import { useLanguage } from 'app/context/LanguageContext';

const LicenceHistory = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [licenceData, setLicenceData] = useState([]);
    const [pageData, setPageData] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const getLicenceList = async () => {
        setLoading(true);
        try {
            let response = await licenceList() as any;
            if (response?.status) {
                // Transform the API data to match the table structure
                const transformedData = response.data.map((item:any, index:any) => ({
                    id: item.id,
                    sNo: index + 1,
                    uploadedDate: new Date(item.created_at).toLocaleDateString(),
                    status: item.is_verified === true ? 'Approved' : item.is_verified === false ? 'Rejected' : t('user.profile.uploadHistory.pending'),
                    statusReason: item.admin_response,
                    actionDate: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-',
                    licenseView: {
                        frontImageUrl: item.front_image_url,
                        backImageUrl: item.back_image_url
                    },
                    uploadedData: {
                        licenceNumber: item.licence_number,
                        issueDate: item.issue_date ? new Date(item.issue_date).toLocaleDateString() : '-',
                        expiryDate: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-'
                    },
                    originalData: item // Keep original data for reference
                }));
                
                setLicenceData(transformedData);
                setPageData(response.page_data || {});
            }
        } catch (error) {
            console.error('Error fetching licence data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLicenceList()
    }, [])

    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
        columnHelper.accessor('sNo', {
            header: t('user.profile.uploadHistory.sNo'),
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('uploadedDate', {
            header: t('user.profile.uploadHistory.uploadedDate'),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('status', {
            header: t('user.profile.uploadHistory.status'),
            cell: info => {
                const status = info.getValue() as any;
                const row = info.row.original as any;

                return (
                    <div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${status}`}>
                            {status}
                        </span>
                        {row?.statusReason && (
                            <div className="text-xs text-gray-400 mt-1">{row?.statusReason}</div>
                        )}
                    </div>
                );
            },
        }),
        columnHelper.accessor('actionDate', {
            header: t('user.profile.uploadHistory.actionDate'),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('licenseView', {
            header: t('user.profile.uploadHistory.licenseView'),
            cell: info  => {
                const viewData = info.getValue() as any;
                
                const handleViewDocument = (docType:any, url:any) => {
                    if (url) {
                        window.open(url, '_blank');
                    } else {
                        console.log(`No ${docType} document available`);
                    }
                };

                return (
                    <div className="flex gap-2">
                        <iframe src={viewData?.frontImageUrl} width={100} height={100} />
                        <button
                            onClick={() => handleViewDocument('front', viewData?.frontImageUrl)}
                            disabled={!viewData.frontImageUrl}
                            className="flex items-center gap-1 px-3 py-1  disabled:bg-gray-500 cursor-pointer text-white text-xs rounded transition-colors"
                        >
                            {t('user.profile.uploadHistory.view')}
                        </button>
                        <br/>
                        <iframe src={viewData?.backImageUrl} width={100} height={100}/>
                        <button
                            onClick={() => handleViewDocument('back', viewData?.backImageUrl)}
                            disabled={!viewData?.backImageUrl}
                            className="flex items-center gap-1 px-3 py-1  disabled:bg-gray-500 cursor-pointer text-white text-xs rounded transition-colors"
                        >
                            {t('user.profile.uploadHistory.view')}
                        </button>
                    </div>
                );
            },
            enableSorting: false,
        }),
        columnHelper.accessor('uploadedData', {
            header: t('user.profile.uploadHistory.uploadedData'),
            cell: info => {
                const data = info.getValue() as any;
                return (
                    <div className="text-sm space-y-1">
                        <div><span className="text-gray-400">{t('user.profile.uploadHistory.licenseNo')}:</span> {data.licenceNumber || '-'}</div>
                        <div><span className="text-gray-400">{t('user.profile.uploadHistory.issueDate')}:</span> {data.issueDate}</div>
                        <div><span className="text-gray-400">{t('user.profile.uploadHistory.expiryDate')}:</span> {data.expiryDate}</div>
                    </div>
                );
            },
            enableSorting: false,
        }),
    ], [t]) as any; // Added t as dependency

    const table = useReactTable({
        data: licenceData, // Fixed: changed from licenceData to data
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: 'includesString',
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: pageData?.page_size || 10,
            },
        },
    });

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} className="mr-2" />
                        Back
                    </button>
                </div>
                <h1 className="text-white text-2xl font-semibold">{t('user.profile.uploadHistory.title')}</h1>
                {pageData?.count && (
                    <p className="text-gray-400 text-sm mt-2">
                        {t('user.profile.uploadHistory.totalRecords')}: {pageData?.count}
                    </p>
                )}
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('user.profile.uploadHistory.searchAllColumns')}
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#414141] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors bg-[#414141]">
                    <Filter size={20} />
                    {t('user.profile.uploadHistory.filters')}
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden" style={{
                boxShadow: "rgba(243, 184, 83, 0.25) 0px 0.4px 0.4px, rgba(243, 184, 83, 0.15) 0px 0px 1px 1px",
            }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#414141]">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="text-left text-gray-300 text-sm">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 font-medium cursor-pointer hover:text-white select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ChevronUp size={16} className="text-white" />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ChevronDown size={16} className="text-white" />
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <ChevronUp size={12} className="text-gray-400 -mb-1" />
                                                                <ChevronDown size={12} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="text-white">
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="border-t border-gray-700 hover:bg-gray-750">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {table.getRowModel().rows.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                            {t('user.profile.uploadHistory.showingResults', {
                                from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                                to: Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getPrePaginationRowModel().rows.length),
                                total: table.getPrePaginationRowModel().rows.length
                            })}
                            {globalFilter && ` (filtered from ${pageData?.count || licenceData.length} total entries)`}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                                {t('user.profile.uploadHistory.previous')}
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => table.setPageIndex(i)}
                                            className={`px-3 py-1 text-sm rounded transition-colors ${table.getState().pagination.pageIndex === i
                                                ? 'bg-yellow-400 text-black font-medium'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('user.profile.uploadHistory.next')}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Debug Info */}
            <div className="mt-4 text-xs text-gray-500">
                {t('user.profile.uploadHistory.page')} {table?.getState()?.pagination?.pageIndex + 1} of {table?.getPageCount()} |
                {t('user.profile.uploadHistory.totalRows')}: {table?.getPrePaginationRowModel()?.rows?.length}
                {pageData?.count && ` | ${t('user.profile.uploadHistory.apiTotal')}: ${pageData?.count}`}
            </div>
        </div>
    );
};

export default LicenceHistory;