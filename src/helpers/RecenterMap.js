import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const RecenterMap = ({ center, animate = true }) => {
    const map = useMap();

    useEffect(() => {
        if (center && map) {
            map.setView(center, map.getZoom(), { animate });
        }
    }, [center, map, animate]);

    return null;
};
