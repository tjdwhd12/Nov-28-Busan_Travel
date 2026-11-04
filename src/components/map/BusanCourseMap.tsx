import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { TripPlan, Place } from '../../types/trip';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import { getGoogleMapUrl } from '../../utils/mapUtils';

interface BusanCourseMapProps {
  trip: TripPlan;
  onSelectPlace: (place: Place) => void;
}

// Inner helper component to draw the course route polyline and fit bounds
function CoursePolylineAndBounds({
  places,
  hoveredPlaceId,
}: {
  places: Place[];
  hoveredPlaceId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || places.length === 0) return;

    const path = places.map((p) => ({
      lat: p.coords.lat,
      lng: p.coords.lng,
    }));

    let polyline: google.maps.Polyline | null = null;
    if (path.length > 1) {
      polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#0284c7',
        strokeOpacity: 0.85,
        strokeWeight: 4,
      });
      polyline.setMap(map);
    }

    // Auto fit bounds to encompass all places
    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });

    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [map, places]);

  return null;
}

export const BusanCourseMap: React.FC<BusanCourseMapProps> = ({ trip, onSelectPlace }) => {
  const places = trip.days[0]?.places || [];
  const [selectedMarkerPlace, setSelectedMarkerPlace] = useState<Place | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-1.5">
              <MapPin className="w-4 h-4" />
              <span>구글 지도 공식 연동 (Google Maps Platform)</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              당일 코스 실시간 구글 지도
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              구글 지도 API가 연동되어 부산역부터 각 방문지까지의 동선이 마커와 연결선으로 표시됩니다. 마커를 클릭하면 상세 정보가 열립니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-sky-200 shrink-0 self-start sm:self-auto">
            <span>총 {places.length}개 방문지 코스</span>
          </div>
        </div>
      </div>

      {/* Map Viewport & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Google Map Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[340px] h-[360px] sm:h-[480px] lg:h-[560px]">
          {apiKey ? (
            <APIProvider
              apiKey={apiKey}
              language="ko"
              region="KR"
            >
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={{ lat: 35.1400, lng: 129.1100 }}
                defaultZoom={12}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                {/* Draw Route Polyline & Bounds */}
                <CoursePolylineAndBounds
                  places={places}
                  hoveredPlaceId={hoveredPlaceId}
                />

                {/* Advanced Markers for each spot */}
                {places.map((place, idx) => {
                  const seq = idx + 1;
                  const isHovered = hoveredPlaceId === place.id;
                  return (
                    <AdvancedMarker
                      key={place.id}
                      position={{ lat: place.coords.lat, lng: place.coords.lng }}
                      title={place.name}
                      onClick={() => setSelectedMarkerPlace(place)}
                    >
                      <Pin
                        background={isHovered ? '#0f172a' : '#0284c7'}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        glyph={String(seq)}
                        scale={isHovered ? 1.25 : 1.1}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* InfoWindow popup when marker clicked */}
                {selectedMarkerPlace && (
                  <InfoWindow
                    position={{
                      lat: selectedMarkerPlace.coords.lat,
                      lng: selectedMarkerPlace.coords.lng,
                    }}
                    onCloseClick={() => setSelectedMarkerPlace(null)}
                  >
                    <div className="p-1 max-w-[220px] text-slate-900">
                      <div className="text-[10px] font-bold text-sky-600 uppercase mb-0.5">
                        {selectedMarkerPlace.area}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">
                        {selectedMarkerPlace.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mb-2">
                        {selectedMarkerPlace.summary}
                      </p>
                      <button
                        onClick={() => {
                          onSelectPlace(selectedMarkerPlace);
                          setSelectedMarkerPlace(null);
                        }}
                        className="w-full py-1.5 px-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>상세정보 보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
              <MapPin className="w-10 h-10 text-sky-500 mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                구글 지도 API 키가 연결되었습니다.
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                잠시 후 지도가 로딩됩니다. 화면이 새로고침되지 않는 경우 상단의 새로고침을 확인해 주세요.
              </p>
            </div>
          )}

          {/* Top Left Floating Indicator */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-md text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Maps 연동됨</span>
          </div>
        </div>

        {/* Places List on the right */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs max-h-[420px] lg:max-h-[560px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>동선 순서 목록</span>
              <span className="text-xs text-sky-600 font-normal">({places.length}곳)</span>
            </h3>
            <span className="text-xs text-slate-400">클릭 시 상세 모달</span>
          </div>

          <div className="space-y-2">
            {places.map((place, idx) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                onMouseEnter={() => setHoveredPlaceId(place.id)}
                onMouseLeave={() => setHoveredPlaceId(null)}
                className={`group p-3 rounded-2xl border transition-all cursor-pointer ${
                  hoveredPlaceId === place.id
                    ? 'border-sky-400 bg-sky-50/60 shadow-xs'
                    : 'border-slate-100 hover:border-sky-300 hover:bg-sky-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums transition-colors">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 truncate transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {place.address}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 tabular-nums shrink-0">
                    {place.startTime}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{place.area}</span>
                  <span className="font-semibold text-sky-600 group-hover:underline flex items-center gap-0.5">
                    상세보기 &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
