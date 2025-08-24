"use client";

import { CollegesResponseDTO } from "@/api/@types/college-list";
import { getColleges } from "@/api/list/getColleges";
import { getStreams } from "@/api/list/getStreams";
import { getStates, StateDto } from "@/api/list/getStates";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getCities } from "@/api/list/getCities";
import { HomeCity, HomeStream } from "@/api/@types/header-footer";

const CollegeListCard = dynamic(
  () => import("@/components/cards/CollegeListCard"),
  {
    loading: () => (
      <div className="animate-pulse p-4 bg-gray-200 rounded-2xl h-32" />
    ),
    ssr: false,
  }
);

type CollegeListItemProps = {
  college: CollegesResponseDTO["colleges"][0];
  isLast: boolean;
  lastCollegeRef: (node: HTMLDivElement | null) => void;
};

const CollegeListItem = React.memo(
  ({ college, isLast, lastCollegeRef }: CollegeListItemProps) => (
    <div ref={isLast ? lastCollegeRef : null}>
      <CollegeListCard college={college} />
    </div>
  )
);
CollegeListItem.displayName = "CollegeListItem";

const DynamicCollegeList = () => {
  const params = useParams();

  // Check if this is an individual college URL (should be handled by [slug-id] route)
  const paramArray = params.params || [];
  const joinedParams = Array.isArray(paramArray)
    ? paramArray.join("-")
    : paramArray;

  // Only redirect if this is clearly an individual college URL (name-id pattern)
  // College listing URLs like "management-colleges-in-7624" should be handled here
  if (
    Array.isArray(paramArray) &&
    paramArray.length === 1 &&
    /\d+$/.test(joinedParams) &&
    !joinedParams.includes("colleges") &&
    !joinedParams.includes("college") &&
    !joinedParams.includes("-in-")
  ) {
    // This is an individual college URL, redirect to the proper route
    window.location.href = `/colleges/${joinedParams}`;
    return null;
  }

  const [streamMap, setStreamMap] = useState<Record<string, string>>({});
  const [cityMap, setCityMap] = useState<Record<string, string>>({});
  const [stateMap, setStateMap] = useState<Record<string, string>>({});
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [initialDataError, setInitialDataError] = useState<string | null>(null);

  const formatName = (name: string) => {
    if (!name || typeof name !== "string") return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const streamNameToId = useMemo(() => {
    if (Object.keys(streamMap).length === 0) return {};
    return Object.fromEntries(
      Object.entries(streamMap)
        .filter(([_, name]) => name && typeof name === "string")
        .map(([id, name]) => [formatName(name), id])
    );
  }, [streamMap]);
  const cityNameToId = useMemo(() => {
    if (Object.keys(cityMap).length === 0) return {};
    return Object.fromEntries(
      Object.entries(cityMap)
        .filter(([_, name]) => name && typeof name === "string")
        .map(([id, name]) => [formatName(name), id])
    );
  }, [cityMap]);
  const stateNameToId = useMemo(() => {
    if (Object.keys(stateMap).length === 0) return {};
    return Object.fromEntries(
      Object.entries(stateMap)
        .filter(([_, name]) => name && typeof name === "string")
        .map(([id, name]) => [formatName(name), id])
    );
  }, [stateMap]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      setInitialDataError(null);
      
      try {
        // Fetch data with individual error handling for better resilience
        const results = await Promise.allSettled([
          getStreams(),
          getCities(),
          getStates(),
        ]);

        const [streamsResult, citiesResult, statesResult] = results;
        
        // Handle streams data
        if (streamsResult.status === 'fulfilled') {
          setStreamMap(
            Object.fromEntries(
              streamsResult.value.map((item: HomeStream) => [
                String(item.stream_id),
                item.stream_name,
              ])
            )
          );
        } else {
          console.error("Failed to fetch streams:", streamsResult.reason);
        }
        
        // Handle cities data
        if (citiesResult.status === 'fulfilled') {
          setCityMap(
            Object.fromEntries(
              citiesResult.value.map((item: HomeCity) => [
                String(item.city_id),
                item.city_name,
              ])
            )
          );
        } else {
          console.error("Failed to fetch cities:", citiesResult.reason);
        }
        
        // Handle states data
        if (statesResult.status === 'fulfilled') {
          setStateMap(
            Object.fromEntries(
              statesResult.value.map((item: StateDto) => [
                String(item.state_id),
                item.state_name,
              ])
            )
          );
        } else {
          console.error("Failed to fetch states:", statesResult.reason);
        }

        // Check if we have at least some data to work with
        const hasAnyData = results.some(result => result.status === 'fulfilled');
        if (!hasAnyData) {
          throw new Error("All data sources failed to load");
        }

        // Parse params immediately after we have the data
        if (streamsResult.status === 'fulfilled' && citiesResult.status === 'fulfilled' && statesResult.status === 'fulfilled') {
          // Create temporary maps for parsing
          const tempStreamMap = Object.fromEntries(
            streamsResult.value.map((item: HomeStream) => [
              String(item.stream_id),
              item.stream_name,
            ])
          );
          
          const tempCityMap = Object.fromEntries(
            citiesResult.value.map((item: HomeCity) => [
              String(item.city_id),
              item.city_name,
            ])
          );
          
          const tempStateMap = Object.fromEntries(
            statesResult.value.map((item: StateDto) => [
              String(item.state_id),
              item.state_name,
            ])
          );

          // Create temporary name-to-id mappings
          const tempStreamNameToId = Object.fromEntries(
            Object.entries(tempStreamMap)
              .filter(([_, name]) => name && typeof name === "string")
              .map(([id, name]) => [formatName(name), id])
          );
          
          const tempCityNameToId = Object.fromEntries(
            Object.entries(tempCityMap)
              .filter(([_, name]) => name && typeof name === "string")
              .map(([id, name]) => [formatName(name), id])
          );
          
          const tempStateNameToId = Object.fromEntries(
            Object.entries(tempStateMap)
              .filter(([_, name]) => name && typeof name === "string")
              .map(([id, name]) => [formatName(name), id])
          );

          // Parse params with temporary mappings
          const { stream_id, city_id, state_id } = parseParamsWithMaps(params, tempStreamNameToId, tempCityNameToId, tempStateNameToId, tempStreamMap, tempCityMap, tempStateMap);
          
          console.log("Setting filters immediately:", { stream_id, city_id, state_id });
          setFilters({
            city_id,
            state_id,
            stream_id,
          });
        }
        
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setInitialDataError(
          err instanceof Error ? err.message : "Failed to load initial data"
        );
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, [params]);

  // Separate useEffect to parse params after maps are populated (fallback)
  useEffect(() => {
    if (Object.keys(streamMap).length > 0 && Object.keys(cityMap).length > 0 && Object.keys(stateMap).length > 0) {
      // Parse params after ALL maps are populated
      const { stream_id, city_id, state_id } = parseParams(params);
      
      console.log("Setting filters in fallback useEffect:", { stream_id, city_id, state_id });
      setFilters({
        city_id,
        state_id,
        stream_id,
      });
    }
  }, [params, streamMap, cityMap, stateMap]);

  const parseParamsWithMaps = (
    params: { params?: string[] },
    streamNameToId: Record<string, string>,
    cityNameToId: Record<string, string>,
    stateNameToId: Record<string, string>,
    streamMap: Record<string, string>,
    cityMap: Record<string, string>,
    stateMap: Record<string, string>
  ) => {
    const paramArray = params.params || [];
    let stream_id = "";
    let city_id = "";
    let state_id = "";

    const joinedParams = paramArray.join("-").toLowerCase();
    const parts = joinedParams.split("-");
    
    console.log("parseParamsWithMaps debug:", {
      paramArray,
      joinedParams,
      parts,
      streamNameToId,
      cityNameToId,
      stateNameToId
    });
    


    if (joinedParams.startsWith("college-")) {
      const cleanParts = joinedParams.replace("college-", "").split("-");

      if (cleanParts.includes("colleges")) {
        const collegesIndex = cleanParts.indexOf("colleges");
        if (collegesIndex > 0) {
          const stream = cleanParts.slice(0, collegesIndex).join("-");
          stream_id = streamNameToId[stream] || stream;
        }
        if (collegesIndex < cleanParts.length - 1) {
          const afterColleges = cleanParts.slice(collegesIndex + 1).join("-");

          if (afterColleges.startsWith("in-")) {
            const location = afterColleges.replace("in-", "");

            if (cityNameToId[location]) {
              city_id = cityNameToId[location];
            } else if (stateNameToId[location]) {
              state_id = stateNameToId[location];
            } else if (!isNaN(Number(location))) {
              if (location.length === 2) {
                state_id = location;
              } else if (location.length === 6) {
                city_id = location;
              } else if (cityMap[location]) city_id = location;
              else if (stateMap[location]) state_id = location;
              else if (streamMap[location]) stream_id = location;
            } else {
              if (stream_id && location !== stream_id) city_id = location;
              else state_id = location;
            }
          }
        }
      }
    } else if (parts.includes("colleges")) {
      const collegesIndex = parts.indexOf("colleges");

              if (collegesIndex > 0) {
          const stream = parts.slice(0, collegesIndex).join("-");
          stream_id = streamNameToId[stream] || stream;
        }
      if (collegesIndex < parts.length - 1) {
        const afterColleges = parts.slice(collegesIndex + 1).join("-");

        // Handle both "in-" prefix and direct location
        let location = afterColleges;
        if (afterColleges.startsWith("in-")) {
          location = afterColleges.replace("in-", "");
        }

        if (cityNameToId[location]) {
          city_id = cityNameToId[location];
        } else if (stateNameToId[location]) {
          state_id = stateNameToId[location];
        } else if (!isNaN(Number(location))) {
          if (location.length === 2) {
            state_id = location;
          } else if (location.length === 6) {
            city_id = location;
          } else if (cityMap[location]) {
            city_id = location;
          } else if (stateMap[location]) {
            state_id = location;
          } else if (streamMap[location] && !stream_id) {
            stream_id = location;
          }
        } else {
          if (stream_id && location !== stream_id) {
            city_id = location;
          } else {
            state_id = location;
          }
        }
      }
    }

    return { stream_id, city_id, state_id };
  };

  const parseParams = (params: { params?: string[] }) => {
    const paramArray = params.params || [];
    let stream_id = "";
    let city_id = "";
    let state_id = "";

    const joinedParams = paramArray.join("-").toLowerCase();
    const parts = joinedParams.split("-");

    if (joinedParams.startsWith("college-")) {
      const cleanParts = joinedParams.replace("college-", "").split("-");

      if (cleanParts.includes("colleges")) {
        const collegesIndex = cleanParts.indexOf("colleges");
        if (collegesIndex > 0) {
          const stream = cleanParts.slice(0, collegesIndex).join("-");
          stream_id = streamNameToId[stream] || stream;
        }
        if (collegesIndex < cleanParts.length - 1) {
          const afterColleges = cleanParts.slice(collegesIndex + 1).join("-");

          if (afterColleges.startsWith("in-")) {
            const location = afterColleges.replace("in-", "");

            if (cityNameToId[location]) {
              city_id = cityNameToId[location];
            } else if (stateNameToId[location]) {
              state_id = stateNameToId[location];
            } else if (!isNaN(Number(location))) {
              if (location.length === 2) {
                state_id = location;
              } else if (location.length === 6) {
                city_id = location;
              } else if (cityMap[location]) city_id = location;
              else if (stateMap[location]) state_id = location;
              else if (streamMap[location]) stream_id = location;
            } else {
              if (stream_id && location !== stream_id) city_id = location;
              else state_id = location;
            }
          }
        }
      }
    } else if (parts.includes("colleges")) {
      const collegesIndex = parts.indexOf("colleges");

      if (collegesIndex > 0) {
        const stream = parts.slice(0, collegesIndex).join("-");
        stream_id = streamNameToId[stream] || stream;
      }
      if (collegesIndex < parts.length - 1) {
        const afterColleges = parts.slice(collegesIndex + 1).join("-");

        // Handle both "in-" prefix and direct location
        let location = afterColleges;
        if (afterColleges.startsWith("in-")) {
          location = afterColleges.replace("in-", "");
        }

        if (cityNameToId[location]) {
          city_id = cityNameToId[location];
        } else if (stateNameToId[location]) {
          state_id = stateNameToId[location];
        } else if (!isNaN(Number(location))) {
          if (location.length === 2) {
            state_id = location;
          } else if (location.length === 6) {
            city_id = location;
          } else if (cityMap[location]) {
            city_id = location;
          } else if (stateMap[location]) {
            state_id = location;
          } else if (streamMap[location] && !stream_id) {
            stream_id = location;
          }
        } else {
          if (stream_id && location !== stream_id) {
            city_id = location;
          } else {
            state_id = location;
          }
        }
      }
    }

    return { stream_id, city_id, state_id };
  };

  const [collegesData, setCollegesData] = useState<
    CollegesResponseDTO["colleges"]
  >([]);
  const [totalCollegesCount, setTotalCollegesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({
    city_id: "",
    state_id: "",
    stream_id: "",
  });

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCollegeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchColleges = useCallback(async () => {
    if (!hasMore || loadingInitialData) return;



    console.log("fetchColleges called with filters:", filters);
    setLoading(true);
    try {
      const data = await getColleges({
        page,
        limit: 10,
        filters: {
          city_id: filters.city_id,
          state_id: filters.state_id,
          stream_id: filters.stream_id,
        },
      });

      setTotalCollegesCount(data.total_colleges_count);
      setCollegesData((prev) => [...prev, ...data.colleges]);
      setHasMore(data.colleges.length === 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  }, [page, filters, hasMore, loadingInitialData]);

  useEffect(() => {
    fetchColleges();
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchColleges]);

  const getTitle = () => {
    const streamName = streamMap[filters.stream_id] || filters.stream_id || "";
    const cityName = cityMap[filters.city_id] || filters.city_id || "";
    const stateName = stateMap[filters.state_id] || filters.state_id || "";

    const titleParts: string[] = [];
    if (streamName) titleParts.push(`${streamName} Colleges`);
    else titleParts.push("Colleges");
    if (cityName) titleParts.push(`in ${cityName}`);
    else if (stateName) titleParts.push(`in ${stateName}`);

    return titleParts.join(" ");
  };

  if (loadingInitialData) {
    return (
      <div className="md:py-14 container-body">
        <div className="text-center">Loading initial data...</div>
      </div>
    );
  }

  if (initialDataError) {
    return (
      <div className="md:py-14 container-body">
        <div className="text-center">
          <div className="text-red-500 mb-4">{initialDataError}</div>
          <button
            onClick={() => {
              setInitialDataError(null);
              // Trigger a re-fetch by updating a dependency
              const fetchInitialData = async () => {
                setLoadingInitialData(true);
                setInitialDataError(null);
                
                try {
                  // Fetch data with individual error handling for better resilience
                  const results = await Promise.allSettled([
                    getStreams(),
                    getCities(),
                    getStates(),
                  ]);

                  const [streamsResult, citiesResult, statesResult] = results;
                  
                  // Handle streams data
                  if (streamsResult.status === 'fulfilled') {
                    setStreamMap(
                      Object.fromEntries(
                        streamsResult.value.map((item: HomeStream) => [
                          String(item.stream_id),
                          item.stream_name,
                        ])
                      )
                    );
                  } else {
                    console.error("Failed to fetch streams:", streamsResult.reason);
                  }
                  
                  // Handle cities data
                  if (citiesResult.status === 'fulfilled') {
                    setCityMap(
                      Object.fromEntries(
                        citiesResult.value.map((item: HomeCity) => [
                          String(item.city_id),
                          item.city_name,
                        ])
                      )
                    );
                  } else {
                    console.error("Failed to fetch cities:", citiesResult.reason);
                  }
                  
                  // Handle states data
                  if (statesResult.status === 'fulfilled') {
                    setStateMap(
                      Object.fromEntries(
                        statesResult.value.map((item: StateDto) => [
                          String(item.state_id),
                          item.state_name,
                        ])
                      )
                    );
                  } else {
                    console.error("Failed to fetch states:", statesResult.reason);
                  }

                  // Check if we have at least some data to work with
                  const hasAnyData = results.some(result => result.status === 'fulfilled');
                  if (!hasAnyData) {
                    throw new Error("All data sources failed to load");
                  }

                  // Parse params after maps are populated
                  const { stream_id, city_id, state_id } = parseParams(params);
                  setFilters({
                    city_id,
                    state_id,
                    stream_id,
                  });
                  
                } catch (err) {
                  console.error("Failed to fetch initial data:", err);
                  setInitialDataError(
                    err instanceof Error ? err.message : "Failed to load initial data"
                  );
                } finally {
                  setLoadingInitialData(false);
                }
              };
              fetchInitialData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:py-14 container-body">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 md:mb-2 capitalize">
            {getTitle()} ({collegesData.length}/{totalCollegesCount})
          </h1>
          {error && (
            <div className="mb-4">
              <div className="text-red-500 mb-2">{error}</div>
              <button
                onClick={() => {
                  setError(null);
                  fetchColleges();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Loading Colleges
              </button>
            </div>
          )}
          <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
            {collegesData.map((college, index) => (
              <CollegeListItem
                key={`${college.college_id}-${index}`}
                college={college}
                isLast={index === collegesData.length - 1}
                lastCollegeRef={lastCollegeRef}
              />
            ))}
            {loading &&
              Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`loading-${i}`}
                  className="animate-pulse p-4 bg-gray-200 rounded-2xl h-32"
                />
              ))}
            {!loading && collegesData.length === 0 && (
              <div className="text-center text-gray-500 col-span-2">
                No colleges found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <DynamicCollegeList />;
}
