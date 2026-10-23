import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

// Lives inside a MapContainer (useMap needs that) and renders nothing.
// 1. Frames the map: an explicit center/zoom wins, otherwise it fits the bounds of the points.
// 2. Scroll-wheel zoom stays off so the page scrolls normally; a click on the map turns it on,
//    and moving the mouse out (or leaving with the keyboard) turns it off again.
export default function MapViewController({ center, zoom, points = [] }) {
  const map = useMap()
  const viewKey = center ? `${center.join(',')}@${zoom}` : points.map((point) => point.join(',')).join(';')

  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom())
    else if (points.length === 1) map.setView(points[0], 13)
    else if (points.length > 1) map.fitBounds(points, { padding: [28, 28], maxZoom: 13 })
    // viewKey sums up center, zoom and points, so the view only changes when they really change.
  }, [map, viewKey])

  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable()
    const disable = () => map.scrollWheelZoom.disable()
    map.on('click', enable)
    map.on('mouseout blur', disable)
    return () => {
      map.off('click', enable)
      map.off('mouseout blur', disable)
    }
  }, [map])

  return null
}
