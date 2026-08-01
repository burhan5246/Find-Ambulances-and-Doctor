import { useState, useEffect, useCallback } from 'react';
import { servicesApi } from '../../../api/servicesApi';
import type { Service, ServiceType } from '../../../types/service';
import type { PaginationMeta, ServiceTotals } from '../../../types/api';
import { useDebounce } from '../../../hooks/useDebounce';

interface ServiceData {
  data: Service[];
  pagination: PaginationMeta | null;
  totals: ServiceTotals | null;
  isLoading: boolean;
  error: string | null;
}

interface UseServicesReturn extends ServiceData {
  limit: number;
  page: number;
  typeFilter: ServiceType | undefined;
  searchQuery: string;
  setPage: (page: number) => void;
  setTypeFilter: (type: ServiceType | undefined) => void;
  setSearchQuery: (query: string) => void;
  refetch: (pageNum?:number) => void;
}

/**
 * Custom hook encapsulating all service list data-fetching logic.
 * Manages pagination, filtering, search, and loading/error states.
 *
 * Uses separate useState calls for filter state vs data state to prevent
 * stale closure issues and unnecessary re-renders.
 */
export function useServices(): UseServicesReturn {
  // Filter/pagination state — separate atoms for stable dependencies
  const [page, setPageState] = useState(1);
  const limit = 10;
  const [typeFilter, setTypeFilterState] = useState<ServiceType | undefined>(undefined);
  const [searchQuery, setSearchQueryState] = useState('');

  // Data state — updated only when API responds
  const [serviceData, setServiceData] = useState<ServiceData>({
    data: [],
    pagination: null,
    totals: null,
    isLoading: true,
    error: null,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchServices = useCallback(async (pageNum?:number) => {
    setServiceData((prev) => ({ ...prev, isLoading: true, error: null }));
    //debugger;
    try {
      const response = await servicesApi.getServices({
        page: pageNum || page,
        limit,
        type: typeFilter,
        search: debouncedSearch || undefined,
      });

      setServiceData({
        data: response.data ?? [],
        pagination: response.pagination,
        totals: response.totals,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load services';
      setServiceData((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  }, [page, typeFilter, debouncedSearch]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setTypeFilter = useCallback((type: ServiceType | undefined) => {
    // Reset to page 1 when filter changes
    setTypeFilterState(type);
    setPageState(1);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    // Reset to page 1 when search changes
    setSearchQueryState(query);
    setPageState(1);
  }, []);

  return {
    ...serviceData,
    limit,
    page,
    typeFilter,
    searchQuery,
    setPage,
    setTypeFilter,
    setSearchQuery,
    refetch: fetchServices,
  };
}
