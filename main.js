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
      maxZoom: 19,
      minZoom: 2,
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
  // const bingMaps = new ol.layer.Tile({
  //   source: new ol.source.BingMaps({
  //     key: "At4A89FmDbu18PRx__CW6sioCD6moSnOoLN80nRmVEWgnw4bQAZKGQY4W3CnTd-t",
  //     imagerySet: "CanvasGray" // Road, CanvasDark, CanvasGray
  //   }),
  //   visible: false,
  //   title: "BingMaps"
  // });

  // CartoDB BaseMap Layer
  // const cartoDBBaseLayer = new ol.layer.Tile({
  //   source: new ol.source.XYZ({
  //     url: "https://{1-4}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{scale}.png",
  //     attributions: "© CARTO"
  //   }),
  //   visible: false,
  //   title: "CartoDarkAll"
  // });
  
  // Base Vector Layers
  // Vector Tile Layer OpenstreetMap
  const openstreetMapVectorTile = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      url:'https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=Pdeq7Zb4DwT20I3CUwy6',
      format: new ol.format.MVT(),
      attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }),
    visible: false,
    title: 'VectorTileLayerOpenstreetMap'
  })
  
  const openstreetMapVectorTileStyle = `https://api.maptiler.com/maps/ffe0b296-112d-4317-b0f5-0b55572d881e/style.json?key=Pdeq7Zb4DwT20I3CUwy6`;
  
  fetch(openstreetMapVectorTileStyle).then(function(response) {
    response.json().then(function(glStyle) {
      olms.applyStyle(openstreetMapVectorTile, glStyle, 'v3-openmaptiles');
    });
  });


  // Base Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandard,
      openstreetMapHumanitarian,
      // bingMaps,
      // cartoDBBaseLayer,
      openstreetMapVectorTile
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
    visible: false,
    title: 'TileDebugLayer'
  });

  // tile ArcGIS REST API Layer
  // const tileArcGISLayer = new ol.layer.Tile({
  //   source: new ol.source.TileArcGISRest({
  //     url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer",
  //     attributions: 'Copyright© 2008, MSD, PVA, Louisville Water Company, Louisville Metro Government'
  //   }),
  //   visible: true,
  //   title: 'TileArcGISLayer'
  // })
  

  // NOAA WMS Layer
  // const NOAAWMSLayer = new ol.layer.Tile({
  //   source: new ol.source.TileWMS({
  //     url:'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_dailymaxairtemp_offsets/MapServer/WMSServer?',
  //     params:{
  //       LAYERS: 5,
  //       FORMAT: 'image/png',
  //       TRANSPARENT: true
  //     },
  //     attributions: '<a href=https://nowcoast.noaa.gov/>© NOAA<a/>'
  //   }),
  //   visible: true,
  //   title: 'NOAAWMSLayer'
  // })

  // Vector Layers
  // Cheonan Link Line GeoJSON Vector Image Layer
  const CheonanLinkListVectorImage = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vector_data/link_list.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'CheonanLinkList'
  });

  // KML Line 그리기
  // const CheonanLineKML = new ol.layer.Vector({
  //   source: new ol.source.Vector({
  //     url: './data/vector_data/line.kml',
  //     format: new ol.format.KML()
  //   }),
  //   visible: false,
  //   title: 'CheonanLineKML'
  // });

  // Node List
  const nodeListPoint = new ol.layer.Heatmap({
    source: new ol.source.Vector({
      url: './data/vector_data/node_list.geojson',
      format: new ol.format.GeoJSON()
    }),
    radius: 12,
    blur: 0,
    // [1] : 블러색, [2],[3] : 바깥색 [4] : 안쪽색
    gradient: ['#00f', '#0ff', '#000000', '#000000', '#000000'],
    title: 'CheonanNodeListPoint',
    visible: false
  });
  
  // Layer Group
  const rasterTileLayerGroup = new ol.layer.Group({
    layers:[
      // tileArcGISLayer,
      // NOAAWMSLayer,
      tileDebugLayer,
      CheonanLinkListVectorImage,
      // CheonanLineKML,
      nodeListPoint
    ]
  })
  map.addLayer(rasterTileLayerGroup);

  // Static Image OpenstreetMap
  // const openstreetMapFragmentStatic = new ol.layer.Image({
  //   source: new ol.source.ImageStatic({
  //     url: './data/static_images/openlayers_static_humanitarian.PNG',
  //     imageExtent: [4991698.9328313675, 5050292.393744084, 10008191.828130603, 10013417.911357462],
  //     attributions: '<a href=https://www.openstreetmap.org/copyright/>© OpenStreetMap contributors<a/>',
  //   }),
  //   title: 'openstreetMapFragmentStatic'
  // })

  

    // Raster Tile Layer Group
    const rasterLayerGroup = new ol.layer.Group({
      layers:[
        // tileArcGISLayer,
        // NOAAWMSLayer, 
        tileDebugLayer, 
        // openstreetMapFragmentStatic
      ]
    })
    map.addLayer(rasterLayerGroup);

  // Layer Switcher Logic for Raster Tile Layers
  const tileRasterLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
  for(let tileRasterLayerElement of tileRasterLayerElements){
    tileRasterLayerElement.addEventListener('change', function(){
      let tileRasterLayerElementValue = this.value;
      let tileRasterLayer;

      rasterTileLayerGroup.getLayers().forEach(function(element, index, array){
        if(tileRasterLayerElementValue === element.get('title')){
          tileRasterLayer = element;
        }
      })
      this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false)
    })
  }
  
}

