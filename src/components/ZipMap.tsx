import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { Map as MLMap, MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import miamiZipsUrl from '@/data/miami_zips.geojson?url';

maplibregl.setWorkerUrl(workerUrl);

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';
const MIAMI_CENTER: [number, number] = [-80.205, 25.79];
const DEFAULT_ZOOM = 11.2;

const FILL_COLOR: maplibregl.ExpressionSpecification = [
  'case',
  ['boolean', ['feature-state', 'selected'], false],
  'rgba(247, 190, 83, 0.42)',
  ['boolean', ['feature-state', 'hover'], false],
  'rgba(247, 190, 83, 0.24)',
  'rgba(247, 190, 83, 0.10)',
];

const LINE_COLOR: maplibregl.ExpressionSpecification = [
  'case',
  ['boolean', ['feature-state', 'selected'], false],
  '#f7be53',
  ['boolean', ['feature-state', 'hover'], false],
  'rgba(247, 190, 83, 0.9)',
  'rgba(255,255,255,0.35)',
];

const LINE_WIDTH: maplibregl.ExpressionSpecification = [
  'case',
  ['boolean', ['feature-state', 'selected'], false],
  2.5,
  ['boolean', ['feature-state', 'hover'], false],
  1.8,
  1,
];

interface ZipMapProps {
  selectedZip: string;
  onHoverZip: (zip: string | null) => void;
  onSelectZip: (zip: string) => void;
}

export function ZipMap({ selectedZip, onHoverZip, onSelectZip }: ZipMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const hoveredIdRef = useRef<string | number | undefined>(undefined);
  const selectedIdRef = useRef<string | number | undefined>(undefined);
  const onHoverZipRef = useRef(onHoverZip);
  const onSelectZipRef = useRef(onSelectZip);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    onHoverZipRef.current = onHoverZip;
  }, [onHoverZip]);

  useEffect(() => {
    onSelectZipRef.current = onSelectZip;
  }, [onSelectZip]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: MIAMI_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: { compact: true },
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const clearHover = () => {
      if (hoveredIdRef.current !== undefined && map.getSource('zips')) {
        map.setFeatureState({ source: 'zips', id: hoveredIdRef.current }, { hover: false });
      }
      hoveredIdRef.current = undefined;
      map.getCanvas().style.cursor = '';
      onHoverZipRef.current(null);
    };

    map.on('error', (e) => {
      console.error('ZipMap error:', e.error);
      setStatus('error');
    });

    map.on('load', () => {
      map.addSource('zips', {
        type: 'geojson',
        data: miamiZipsUrl,
        promoteId: 'zip',
      });

      map.addLayer({
        id: 'zip-fill',
        type: 'fill',
        source: 'zips',
        paint: { 'fill-color': FILL_COLOR },
      });

      map.addLayer({
        id: 'zip-line',
        type: 'line',
        source: 'zips',
        paint: {
          'line-color': LINE_COLOR,
          'line-width': LINE_WIDTH,
        },
      });

      map.addLayer({
        id: 'zip-label',
        type: 'symbol',
        source: 'zips',
        layout: {
          'text-field': ['get', 'zip'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#f1e6cf',
          'text-halo-color': '#12110e',
          'text-halo-width': 1.2,
        },
      });

      map.on('mousemove', 'zip-fill', (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0] as MapGeoJSONFeature | undefined;
        const id = feature?.id;
        const zip = feature?.properties?.zip;

        if (id === undefined || !zip) return;

        if (hoveredIdRef.current !== undefined && hoveredIdRef.current !== id) {
          map.setFeatureState({ source: 'zips', id: hoveredIdRef.current }, { hover: false });
        }

        hoveredIdRef.current = id;
        map.setFeatureState({ source: 'zips', id }, { hover: true });
        map.getCanvas().style.cursor = 'pointer';
        onHoverZipRef.current(String(zip));
      });

      map.on('mouseleave', 'zip-fill', clearHover);

      map.on('click', 'zip-fill', (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0] as MapGeoJSONFeature | undefined;
        const zip = feature?.properties?.zip;
        if (zip) onSelectZipRef.current(String(zip));
      });

      setStatus('ready');
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready' || !map.getSource('zips')) return;

    if (selectedIdRef.current !== undefined) {
      map.setFeatureState({ source: 'zips', id: selectedIdRef.current }, { selected: false });
    }

    if (!selectedZip) {
      selectedIdRef.current = undefined;
      return;
    }

    selectedIdRef.current = selectedZip;
    map.setFeatureState({ source: 'zips', id: selectedZip }, { selected: true });
  }, [selectedZip, status]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#12110e] text-sm text-text-faint">
          Loading map…
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#12110e] px-6 text-center">
          <div className="text-sm font-medium text-text">Map failed to load</div>
          <div className="text-xs text-text-faint max-w-xs">
            The basemap tiles could not be reached. Check your connection and refresh.
          </div>
        </div>
      )}
    </div>
  );
}