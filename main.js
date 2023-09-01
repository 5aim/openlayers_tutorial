window.onload = init

function init() {
    const CHEONAN = [14152187.20776864, 4413944.543811761];

    // Controls
    const fullscreenControl = new ol.control.FullScreen();
    const mousePositionControl = new ol.control.MousePosition();
    const overViewMapControl = new ol.control.OverviewMap({
        collapsed: false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ]
    })

    const scaleLineControl = new ol.control.ScaleLine();
    const zoomSliderControl = new ol.control.ZoomSlider();

    const map = new ol.Map({
        view: new ol.View({
            center: CHEONAN,
            zoom: 13,
            maxZoom: 17,
            minZoom: 13,
            rotation: 0
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map',
        keyboardEventTarget: document,
        controls: ol.control.defaults().extend([
            fullscreenControl,
            mousePositionControl,
            overViewMapControl,
            scaleLineControl,
            zoomSliderControl,
        ])
    })

    // 맵 클릭시 coordinate를 보여줌.
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

    //// Draw polygon
    // const drawInteraction = new ol.interaction.Draw({
    //     type: 'Polygon',
    //     freehand: true
    // })
    // map.addInteraction(drawInteraction);
    
    //// polygon의 coordinate를 추출하기
    // drawInteraction.on('drawend', function(e){
    //     let parser = new ol.format.GeoJSON();
    //     let drawnFeatures = parser.writeFeatures([e.feature]);
    //     console.log(drawnFeatures);
    // })
}