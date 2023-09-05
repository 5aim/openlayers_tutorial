window.onload = init;

function init() {
  // Attribution Control
  const attributionControl = new ol.control.Attribution({
    collapsible: true
  });
  
  // 천안시 기준 coordinate
  const CHEONAN = [14152187.20776864, 4413944.543811761];

  // 맵 컨트롤
  const fullscreenControl = new ol.control.FullScreen();
  const mousePositionControl = new ol.control.MousePosition();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: false,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
  });
  
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();

  // Map Object
  const map = new ol.Map({
    // 뷰 지정
    view: new ol.View({
      center: CHEONAN,
      zoom: 13,
      maxZoom: 17,
      minZoom: 13,
      // cartesian coordinate system : 맵 범위 지정
      extent: [14136311.278827626, 4394656.463022412, 14174402.542814588, 4429267.881654042]
    }),
    // 컨트롤 지정
    target: "js-map",
    keyboardEventTarget: document,
    controls: ol.control
      .defaults()
      .extend([
        fullscreenControl,
        mousePositionControl,
        overViewMapControl,
        scaleLineControl,
        zoomSliderControl,
      ]),
  });
  
  // Base Layers
  // Openstreet Map Standard
  const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: "OSMStandard"
  });
  
  // Openstreet Map Humanitarian
  const openstreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    visible: false,
    title: "OSMHumanitarian"
  });

  // Bing Maps Basemap Layer
  const bingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "At4A89FmDbu18PRx__CW6sioCD6moSnOoLN80nRmVEWgnw4bQAZKGQY4W3CnTd-t",
      imagerySet: "CanvasGray" // Road, CanvasDark, CanvasGray
    }),
    visible: false,
    title: "BingMaps"
  });

  // CartoDB BaseMap Layer
  const cartoDBBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://{1-4}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{scale}.png",
      attributions: "© CARTO"
    }),
    visible: false,
    title: "CartoDarkAll"
  });
  
  // Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandard,
      openstreetMapHumanitarian,
      bingMaps,
      cartoDBBaseLayer
    ]
  });
  map.addLayer(baseLayerGroup);
  
  // Layer Switcher Logic for BaseLayers
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerName = element.get("title");
        element.setVisible(baseLayerName === baseLayerElementValue);
      });
    });
  }
  
  // TileDebug
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false
  });
}
