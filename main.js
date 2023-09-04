window.onload = init;

function init() {
  const CHEONAN = [14152187.20776864, 4413944.543811761];

  // Controls
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

    // 레이어 지정
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        zIndex: 1,
        visible: true,
      })
    ],

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

  // Layer Group
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        }),
        zIndex: 0,
        visible: false,
      }),
    ],
  });

  map.addLayer(layerGroup);

  // 마우스 클릭시 위치의 coordinate를 console.log
  map.on("click", function (e) {
    console.log(e.coordinate);
  });

  // // 맵에서 마우스 위치에 따라 coordinate를 보여줌.
  // const popupContainerElement = document.getElementById("popup-coordinates");
  // const popup = new ol.Overlay({
  //     element : popupContainerElement,
  //     positioning: 'top-left'
  // })

  // map.addOverlay(popup);

  // map.on('click', function(e){
  //     // console.log(e);
  //     const clickedCoordinate = e.coordinate;
  //     popup.setPosition(undefined);
  //     popup.setPosition(clickedCoordinate);
  //     popupContainerElement.innerHTML = clickedCoordinate;
  // })

  // // DragRotate Interaction
  // const dragRotateInteraction = new ol.interaction.DragRotate({
  //     condition : ol.events.condition.altKeyOnly
  // })

  // map.addInteraction(dragRotateInteraction)

  // // Draw polygon
  // const drawInteraction = new ol.interaction.Draw({
  //     type: 'Polygon',
  //     freehand: true
  // })
  // map.addInteraction(drawInteraction);

  // // polygon의 coordinate를 추출하기
  // drawInteraction.on('drawend', function(e){
  //     let parser = new ol.format.GeoJSON();
  //     let drawnFeatures = parser.writeFeatures([e.feature]);
  //     console.log(drawnFeatures);
  // })
}
