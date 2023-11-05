window.onload = init;

function init() {
  // EPSG:5179 for Korea
  proj4.defs("EPSG:5179","+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
  ol.proj.proj4.register(proj4);

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
      // projection: 'EPSG:5179',
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
    })
    map.on('click', function(e){
      console.log(e.coordinate);
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

  // Vector Layers
  // Styling of vector features
  // Icon Marker Style
  const pointerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: './data/static_images/icons8-map-marker-800.png',
      size: [80, 140],
      offset: [4, 0],
      opacity: 0.8,
      scale: 0.5,
    })
  });

  // Link Line Style
  const linkLineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [80, 80, 80, 0.8],
      width: 3.0
    })
  });

  // Node Polygon Style
  // LOS 'A'
  const losAStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [0, 176, 80, 0.6]
    })
  });

  // LOS 'B'
  const losBStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [146, 208, 80, 0.6]
    })
  });
  
  // LOS 'C'
  const losCStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [255, 217, 102, 0.6]
    })
  });

  // LOS 'D'
  const losDStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [234, 178, 0, 0.6]
    })
  });

  // LOS 'E'
  const losEStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [255, 21, 21, 0.6]
    })
  });

  // LOS 'F'
  const losFStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [188, 0, 0, 0.6]
    })
  });
  
  const CheonanStyle = function(feature){
    let geometryType = feature.getGeometry().getType();
    let typeProperty = feature.get('los');

    // Link, Node Name Style
    let featureNameStyles = new ol.style.Style({
      text: new ol.style.Text({
        scale: 1,
        fill: new ol.style.Fill({
          color: [80, 80, 80, 1]
        })
      })
    })

    if(geometryType === 'Point'){
      feature.setStyle([
        pointerStyle,
      ]);
    }

    if(geometryType === 'LineString'){
      feature.setStyle([linkLineStyle]);
    }

    if(geometryType === 'Polygon'){
      feature.setStyle([
        featureNameStyles
      ]);
      if(typeProperty === 'A'){
        feature.setStyle([losAStyle]);
      };
      if(typeProperty === 'B'){
        feature.setStyle([losBStyle]);
      };
      if(typeProperty === 'C'){
        feature.setStyle([losCStyle]);
      };
      if(typeProperty === 'D'){
        feature.setStyle([losDStyle]);
      };
      if(typeProperty === 'E'){
        feature.setStyle([losEStyle]);
      };
      if(typeProperty === 'F'){
        feature.setStyle([losFStyle]);
      };
    }
  };
  
  // Node List Vector Icon Style
  const nodeListIconPoint = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vector_data/beonyeong_ro/polygon_beonyeong_buldang_node.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'CheonanNodeListPoint',
    style: CheonanStyle
  })
  
  // Layer Group
  const rasterTileLayerGroup = new ol.layer.Group({
    layers:[
      tileDebugLayer,
      nodeListIconPoint
    ]
  })
  map.addLayer(rasterTileLayerGroup);

  // Raster Tile Layer Group
  const rasterLayerGroup = new ol.layer.Group({
    layers:[
      tileDebugLayer,
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

  // Vector Feature Popup Node Information
  const overlayNodeContainerElement = document.querySelector('.node-overlay-container');
  const overlayNodeLayer = new ol.Overlay({
    element: overlayNodeContainerElement
  });
  map.addOverlay(overlayNodeLayer);
  
  const overlayNodeName = document.getElementById('node-name');
  const overlayNodeId = document.getElementById('node-id');

  // Vector Feature Popup Node Logic
  // map.on('click', function(e){
  map.on('pointermove', function(e){
    overlayNodeLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      let clickedNodeCoordinate = e.coordinate;
      let clickedNodeName = feature.get('node-name');
      let clickedNodeId = feature.get('node-id');
      // if(clickedNodeName && clickedNodeId != undefined){
        overlayNodeLayer.setPosition(clickedNodeCoordinate);
        overlayNodeName.innerHTML = clickedNodeName;
        overlayNodeId.innerHTML = clickedNodeId;
      // }
    },
    {
      layerFilter: function(layerCandidate){
        return layerCandidate.get('title') === 'CheonanNodeListPoint'
      }  
    })
  })

  // Select Interaction - For Sytling Selected Points
  const selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.singleClick,
    layers: function(layer){
      return layer.get('title') === 'CheonanNodeListPoint'
    },
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [50, 50, 50, 0.7]
        }),
        radius: 12,
        stroke: new ol.style.Stroke({
          color: [150, , 150, 150, 0.8],
          width: 3
        })
      })
    })
  })
  map.addInteraction(selectInteraction);
  
}

