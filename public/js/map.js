maptilersdk.config.apiKey = mapKey;

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates,
    zoom: 12
});

new maptilersdk.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);
