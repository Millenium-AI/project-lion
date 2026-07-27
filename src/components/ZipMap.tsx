import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MLMap, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import miamiZips from '@/data/miami_zips.geojson?url';

// Free, open-source, no API key required:
// - MapLibre GL JS renders the map (Mapbox GL fork, open source)
// - OpenFreeMap serves the vector basemap tiles for free with no key/usage limits
// - Zip boundaries are real US Census ZCTA polygons (src/data/miami_zips.geojson)

export function ZipMap({
  selectedZip,
  hoverZip,
  onHoverZip,
  onSelectZip,
  hasListings,
}: {
  selectedZip: string;
  hoverZip: string | null;
  onHoverZip: (zip: string | null) => void;
  onSelectZip: (zip: string) => void;
  hasListings: (zip: string) => boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const selectedZipRef = useRef(selectedZip);
  const hoverZipRef = useRef(hoverZip);
  const hasListingsRef = useRef(hasListings);
  selectedZipRef.current = selectedZip;
  hoverZipRef.current = hoverZip;
  hasListingsRef.current = hasListings;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: [-80.205, 25.79],
      zoom: 11.4,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addSource('zips', {
        type: 'geojson',
        data: miamiZips,
        promoteId: 'zip',
      });

      map.addLayer({
        id: 'zip-fill',
        type: 'fill',
        source: 'zips',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'zip'], selectedZipRef.current],
            'rgba(247, 190, 83, 0.38)',
            ['boolean', ['feature-state', 'hover'], false],
            'rgba(247, 190, 83, 0.24)',
            'rgba(247, 190, 83, 0.08)',
          ],
        },
      });

      map.addLayer({
        id: 'zip-line',
        type: 'line',
        source: 'zips',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'zip'], selectedZipRef.current],
            '#f7be53',
            'rgba(255,255,255,0.35)',
          ],
          'line-width': ['case', ['==', ['get', 'zip'], selectedZipRef.current], 2.5, 1],
        },
      });

      map.addLayer({
        id: 'zip-label',
        type: 'symbol',
        source: 'zips',
        layout: {
          'text-field': ['get', 'zip'],
          'text-size': 12,
          'text-font': ['Noto Sans Regular'],
        },
        paint: {
          'text-color': '#f1e6cf',
          'text-halo-color': '#12110e',
          'text-halo-width': 1.2,
        },
      });

      let hoveredFeatureId: string | number | undefined;

      map.on('mousemove', 'zip-fill', (e: MapMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const zip = feature.properties?.zip as string;

        if (hoveredFeatureId !== undefined) {
          map.setFeatureState({ source: 'zips', id: hoveredFeatureId }, { hover: false });
        }
        hoveredFeatureId = feature.id;
        if (hoveredFeatureId !== undefined) {
          map.setFeatureState({ source: 'zips', id: hoveredFeatureId }, { hover: true });
        }
        map.getCanvas().style.cursor = 'pointer';
        onHoverZip(zip);
      });

      map.on('mouseleave', 'zip-fill', () => {
        if (hoveredFeatureId !== undefined) {
          map.setFeatureState({ source: 'zips', id: hoveredFeatureId }, { hover: false });
        }
        hoveredFeatureId = undefined;
        map.getCanvas().style.cursor = '';
        onHoverZip(null);
      });

      map.on('click', 'zip-fill', (e: MapMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const zip = e.features[0].properties?.zip as string;
        onSelectZip(zip);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep selected/hover styling in sync with React state changes triggered outside the map
  // (e.g. clicking a result card in the list).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('zip-fill')) return;

    map.setPaintProperty('zip-fill', 'fill-color', [
      'case',
      ['==', ['get', 'zip'], selectedZip],
      'rgba(247, 190, 83, 0.38)',
      ['boolean', ['feature-state', 'hover'], false],
      'rgba(247, 190, 83, 0.24)',
      'rgba(247, 190, 83, 0.08)',
    ]);

    map.setPaintProperty('zip-line', 'line-color', [
      'case',
      ['==', ['get', 'zip'], selectedZip],
      '#f7be53',
      'rgba(255,255,255,0.35)',
    ]);

    map.setPaintProperty('zip-line', 'line-width', [
      'case',
      ['==', ['get', 'zip'], selectedZip],
      2.5,
      1,
    ]);
  }, [selectedZip]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
