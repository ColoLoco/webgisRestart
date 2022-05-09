///////////////////////////////////
//variabili globali del progetto //
///////////////////////////////////

/*
$(document).ready(function () {
  var className = $('#test').css('background-color');

  $('#get_info').removeClass('shitty').addClass('merda');
  alert(className);
});
//posso cancellare prima di consegnare

/*variabili contenitore url */
//url dati aree di indagine
var urlAreeIndagine = 'http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AAreeIndagine____&outputFormat=application%2Fjson'
//url foto del progetto restart
var urlFoto = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFoto____________&outputFormat=application%2Fjson";
//url dati aree a rischio
var urlAreeRischio = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AAreeRischio_____&outputFormat=application%2Fjson";
//url dati delle frane RIL 
var urlFraneRIL = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRIL________&outputFormat=application%2Fjson";
//url "VIEW" Frane RIL Acque Sup
var urlFraneRILAcqueSup = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILAcqueSup&outputFormat=application%2Fjson";
//url "VIEW" Frane RIL Geo
var urlFraneRILGeo = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILGeo_____&outputFormat=application%2Fjson";
//url "VIEW" Frane RIL Gen Morfo
var urlFraneRILGenMorfo = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILGenMorfo&outputFormat=application%2Fjson";


/* variabili usate per le informazioni dei layer */
//contenitore della tabella completa nella quale andremo ad inserire i nostri elementi formattati
//var tabellaCompletaInfo;
//contenitore informazioni per overlay
//var overlayInfo;

/* variabili contenitore per elementi HTML */
// div contenitore delle info
const $infoContainerElement = $('#info-container');
// div contenitore elementi per "modifica delle features"
const $modifyContainerElement = $('#modify-container');
//pulsante "get info"
const $getInfo = $('#get_info');
//pulsante "toggle editing"
const $toggleEditing = $("#toggle_editing");
//pulsante "select feature"
const $selectFeature = $("#select_feature");
//pulsante "login"
const $login = $("#login");
//pulsante "modify feature"
const $modifyFeature = $("#modify_feature");


//stili grafici dei layer
layerStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: [218, 112, 214]
        //color: [255, 255, 255]
    }),
    stroke: new ol.style.Stroke({
        //color: [0, 0, 0]
        color: [255, 0, 255]
    })
})

layerStylerNotFill = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: [0, 255, 255]
    })
})

//stile del dell'elemento cerchio
var cerchioStyle = new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
        color: [218, 112, 214]
    }),
    stroke: new ol.style.Stroke({
        color: [0, 0, 0]
        //color: [255, 0, 255]
    })
});

//stile dell'elemento cerchio selezionato
var cerchioSelezStyle = new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
        color: [157, 0, 255]
    }),
    stroke: new ol.style.Stroke({
        color: [0, 0, 0]
    })
});

//stile del layer "Foto"
var photoStyle = new ol.style.Style({
    image: cerchioStyle
});

//stile dell'interazione Select, che non uso più e posso eliminare tranquillamente a fine progetto
var selectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        //color: 'rgb(127,0,255)'
        //color: 'rgb(153,51,255)'
        color: 'rgb(255,0,0)'
    }),
    stroke: new ol.style.Stroke({
        //color: 'rgb(153,51,255)'
        color: 'rgb(127,0,255)'

    })
})

//variabile identificativa della interaction 'select' assegnata alla mappa
var select = new ol.interaction.Select({
  filter: function () {
    if (selectAllowed)
      return true;
    else
      return false;
    }
}); //è necessario implementare un'opzione di filtering, ma sto avendo UN MACELLO DI PROBLEMI
//oppure nelle specifiche bisogna dire che "per la corretta selezione è necessario che solo un layer vettoriale sia selezionato)"
//Eliminare i commenti QUI SOPRA AL COMMENTO al termine della scrittura della tesi


//variabile globale array contenitore chiavi dell'elemento da modificare
var arrayChiaviModifica = [];
//variabile globale array contenitore valori dell'elemento da modificare
var arrayValoriModifica;

/* variabili di controllo */
//variabile di controllo per esecuzione getInfo()
var infoAllowed = false;
//variabile di controllo per funzione selectFeature()
var selectAllowed = false;
//variabile di controllo per funzione modifyFeature()
var modifyAllowed = false;

//riferimento alla funzione getInfo() utilizzato per aggiungere/rimuovere listener di eventi
var getInfoReference = function (e) {
  getInfoLayers(e);
};

//riferimento alla funzione selectFeature() utilizzato per aggiungere/rimuovere listener di eventi
var functionSelectFeatureReference = selectFeature;   //FORSE NON è PIù NECESSARIO DATO CHE HO CAMBIATO METOLOGIA DI LAVORO

/////////////////////////////////////////////
// elementi relativi alla mappa geografica //
/////////////////////////////////////////////

//definiamo la proiezione relativa ai nostri dati geografici
proj4.defs("EPSG:6708", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);  //tramite questo comando memorizziamo la proiezione appena definita
/* le mappe caricate da geoserver vengono automaticamente elaborate modificando opportunamente la proiezione */

// Attribution Control - pulsante
const attributionControl = new ol.control.Attribution({
  collapsible: true
});

/* oggetto Map */
const map = new ol.Map({
  view: new ol.View({
    center: [1506417.15867854, 5316932.52882309],
    zoom: 8,
  }),
  target: 'js-map',
  //projection: default = EPSG:3857 
  controls: ol.control.defaults({ attribution: false }).extend([attributionControl])
})

/* Puntatore popup click utente */
const $overlayContainerElement = $('#overlay-container'); //restituisce un array di elementi aventi tale id
/*console.log($overlayContainerElement);
var overlayContainerElement = document.querySelector('.overlay-container'); //restituisce un elemento unico
console.log(overlayContainerElement);*/
const overlayLayer = new ol.Overlay({
  element: $overlayContainerElement[0],  //assegnamo solo il 1° elemento dell'array
  positioning: 'center-center'
})






///////////////////////////////////
// stili utilizzati nel progetto //
///////////////////////////////////

//stile per evidenziare la feature selezionata
var highlightStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255,255,255,0.7)',
  }),
  stroke: new ol.style.Stroke({
    color: '#3399CC',
    width: 3,
  }),
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: '#3399CC'
    })
  })
});

//stili utilizzati per Limiti Province
const fillStyle = new ol.style.Fill({
  color: [0, 102, 204, 1]
})

const strokeStyle = new ol.style.Stroke({
  color: [46, 45, 45, 1],
  width: 1.2
})

const circleStyle = new ol.style.Circle({
  fill: new ol.style.Fill({
    color: [255, 0, 0, 1]
  }),
  radius: 7,
  stroke: strokeStyle
})



//////////////////////////////
// Layers Base  della mappa //
//////////////////////////////



//layer WMS capabilities PAI
//usando jquery effettuiamo la richiesta al server

// Openstreet Map Standard
const openstreetMapStandard = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  title: 'OSMStandard'
})

// Openstreet Map Humanitarian
const openstreetMapHumanitarian = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  }),
  visible: false,
  title: 'OSMHumanitarian'
})

// CartoDB BaseMap Layer
const cartoDBBaseLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    attributions: '© CARTO'
  }),
  visible: false,
  title: 'CartoDarkAll'
})

// Stamen Basemap layers
const StamenTerrainWithLabels = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'terrain-labels',
    attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: 'StamenTerrainWithLabels'
})

const StamenTerrain = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
    attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: 'StamenTerrain'
})


//Gruppo layer base della mappa
const mapLayerGroup = new ol.layer.Group({
  layers: [
    openstreetMapStandard, openstreetMapHumanitarian, cartoDBBaseLayer,
    StamenTerrainWithLabels, StamenTerrain,
  ]
})

//aggiungiamo tutti i layer raggruppati, direttamente alla mappa
map.addLayer(mapLayerGroup);


/* selettore layer per mappe base */
/* utilizzare il codice commentato 'console' x visionare i valori degli elementi
  durante le varie operazioni eseguite all'interno delle funzioni sottostanti */

// memorizziamo tutti gli elementi "figli" presenti in .sidebar corrispondenti ad "input[type=radio]"
const $baseMapElements = $('.sidebar > input[type=radio]');
console.log($baseMapElements)
//per ogni elemento presente in baseMapElements
for (let baseMapElement of $baseMapElements) {
  //aggiungiamo un listener che sveglia una funzione ogni volta che cambia un elemento selezionato
  baseMapElement.addEventListener('change', function () {
    //preleviamo il 'value dell'elemento selezionato
    let baseMapElementValue = this.value;
    //per ogni layer presente nel gruppo eseguiamo una funzione
    mapLayerGroup.getLayers().forEach(function (element, layerGroupLength, array) {
      //assegnamo 'title' ad una variabile
      let baseMapName = element.get('title');
      //impostiamo come visibile solo l'elemento il cui 'title' e 'value' corrispondono
      element.setVisible(baseMapName === baseMapElementValue);
      //console.log('baseMapName: ' + baseMapName, 'baseMapElementValue: '+ baseMapElementValue);
      //console.log(baseMapName === baseMapElementValue);
      //console.log(element.get('title'), element.get('visible'))
    });
  });
};



///////////////////////
// Layers vettoriali //
//////////////////////

/* layer costruiti da un file vettoriale di tipo geojson */
//VectorImage o Vector danno lo stesso risultato a livello visivo nel browser --- cercare classe che permetta di visualizzare valori cliccando sopra ai punti del file vettoriale




//layer Aree di indagine
const AreeDiIndagineGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlAreeIndagine,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'AreeDiIndagine',
  style: layerStyle
})
AreeDiIndagineGeoJSON.setOpacity(0.5);


//layer foto del progetto
const FotoGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file prelevati tramite http)
    url: urlFoto,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
    title: 'RestartFoto',
    style: photoStyle
});
FotoGeoJSON.setOpacity(0.5);


//layer Aree a rischio
const AreeRischioGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlAreeRischio,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'AreeRischio',
  style: layerStyle
});
AreeRischioGeoJSON.setOpacity(0.5);


//layer Frane RIL
const FraneRILGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlFraneRIL,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'FraneRIL',
  style: layerStyle
});
FraneRILGeoJSON.setOpacity(0.5);

//Frane RIL Geo   //successivamente useremo anche qua underscore x differenziare i layer classici da quelli che usano tabelle
const FraneRILGeoGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlFraneRILGeo,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'FraneRILGeo',
  style: layerStyle
})
FraneRILGeoGeoJSON.setOpacity(0.5);

//Frane RIL Gen Morfo   //successivamente useremo anche qua underscore x differenziare i layer classici da quelli che usano tabelle
const FraneRILGenMorfoGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlFraneRILGenMorfo,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'FraneRILGenMorfo',
  style: layerStyle
})
FraneRILGenMorfoGeoJSON.setOpacity(0.5);

//Frane RIL Acque Sup 
const FraneRILAcqueSupGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
    url: urlFraneRILAcqueSup,
    format: new ol.format.GeoJSON()
  }),
  visible: false,
  title: 'FraneRILAcqueSup',
  style: layerStyle
})
FraneRILAcqueSupGeoJSON.setOpacity(0.5);

var layersGroupArray = [
  //i layers inseriti in questo ordine permettono di essere visti dalle funzioni [1° = QUCTR, 2°= LimCom, 3° = LimProv]
  FraneRILGeoJSON, FraneRILAcqueSupGeoJSON, FraneRILGeoGeoJSON, FraneRILGenMorfoGeoJSON,
  AreeDiIndagineGeoJSON, AreeRischioGeoJSON, FotoGeoJSON
];

//Gruppo layer vettoriali
var layerGroup = new ol.layer.Group({
  layers: layersGroupArray
})

// aggiungiamo gruppo di layer vettoriali alla mappa
map.addLayer(layerGroup);


/* Selettore dei layer vettoriali visibili sulla mappa */
const $vectorLayerElements = $('.sidebar > input[type=checkbox]');
for (let vectorLayerElement of $vectorLayerElements) {
  vectorLayerElement.addEventListener('change', function () {
    let vectorLayerElementValue = this.value;
    let vectorLayer;

    layerGroup.getLayers().forEach(function (element, layerGroupLength, array) {
      if (vectorLayerElementValue === element.get('title')) {
        vectorLayer = element;

      }
    })
    this.checked ? vectorLayer.setVisible(true) : vectorLayer.setVisible(false)
  })
}


////////////////////////////////////////
// EVENTI AZIONATI TRAMITE I PULSANTI //
////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
//evento per visualizzare le info dei layer ad ogni click - PULSANTE GET INFO
$getInfo.on('click', function (e) {
  //se il colore del nostro pulsante è bianco/grigio
  if ($getInfo.hasClass('btn-primary')) {
    $getInfo.removeClass().addClass('btn-danger border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
    $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');

    $selectFeature.prop("disabled", true);
    $login.prop("disabled", true);
    $modifyFeature.prop("disabled", true);

    $toggleEditing.prop("disabled", false);

    //settiamo a "true" la var di controllo dell'esecuzione di getInfoLAyers()
    infoAllowed = true;
    //aggiungiamo il puntatore alla mappa
    map.addOverlay(overlayLayer);
    overlayLayer.setPosition(undefined);
    //settiamo il listener che ad ogni click sulla mappa preleva le informazioni dei layer
    map.on('click', getInfoReference);
    //console.log("get_info not getInfo");
  } else {  //se il colore del pulsante è simile al rosso/corallo
    //impostiamo i colori dei pulsanti
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
    $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
    //impostiamo la visibilità dei pulsanti
    $selectFeature.prop("disabled", true);
    $login.prop("disabled", true);
    $modifyFeature.prop("disabled", true);
    $toggleEditing.prop("disabled", false);

    //settiamo a "false" la var di controllo dell'esecuzione di getInfoLAyers()
    infoAllowed = false;

    //reset delle eventuali informazioni visualizzate
    resetInfoContainer();
    //rimuoviamo il puntatore dalla mappa
    overlayLayer.setPosition(undefined);
    map.removeOverlay(overlayLayer);
    //eliminiamo il listener di eventi relativo ai click della mappa
    map.un('click', getInfoReference);
  }
});//end onclick(#get_info)

/////////////////////////////////////////////////////////////////////////
//evento per abilitare le interazioni coi layer - PULSANTE TOGGLE EDITING
$toggleEditing.on("click", toggle_editing);

///////////////////////////////////////////////////
//evento per aprire la pagina login di Geoserver
$login.on("click", function (e) {
  window.open('http://localhost:8080/geoserver/web/')
});

////////////////////////////////////////////////////////////////////
//evento per abilitare la selezione di un layer - PULSANTE SELEZIONA
$selectFeature.on('click', function (e) {
  //selezioniamo il colore del nostro pulsante
  var color = $selectFeature.css("background-color");

  //se il colore del nostro pulsante è bianco/grigio
  if ($selectFeature.hasClass('btn-primary')) {
    //impostiamo i colori dei pulsanti
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
    $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');

    //impostiamo la visibilità dei pulsanti
    $selectFeature.prop("disabled", false);
    $login.prop("disabled", false);
    $modifyFeature.prop("disabled", false);
    $toggleEditing.prop("disabled", false);
    $getInfo.prop("disabled", true);

    //impostiamo la variabile di controllo esecuzione select a true
    selectAllowed = true;
    //settiamo a false tutte le altre variabili di controllo
    infoAllowed = false;
    modifyAllowed = false;

    //aggiungiamo l'interazione SELECT alla mappa    
    map.addInteraction(select);
    //settiamo il listener che ad ogni click preleva le informazioni dei layer
    map.on('click', functionSelectFeatureReference);
    //NOTA:  trucchetto per eseguire funzione passando argomento dell'evento

  } else {
    //se il colore del pulsante "select_feature" è 'corallo'
    //cambiamo colore e disabilitiamo i pulsanti giusti
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
    $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');

    $toggleEditing.prop("disabled", false);
    $login.prop("disabled", false);
    $selectFeature.prop("disabled", false);

    $('#modify_feature').prop("disabled", true);
    $getInfo.prop("disabled", true);

    //resettiamo le variabili di "selectFeature"
    resetSelectFeature();

  }
});// end onclick(selectFeature)

/////////////////////////////////////////////////////////////////
//evento per abilitare la modifica di un layer - PULSANTE AGGIORNAMENTO INFORMAZIONI
$modifyFeature.on('click', function (e) {
  //se il colore del nostro pulsante è bianco/grigio
  if ($modifyFeature.hasClass('btn-primary')) {
    //modifichiamo opportunamente la visualizzazione degli elementi HTML della pagina
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
    $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-danger border-dark border-2');

    $toggleEditing.prop("disabled", false);
    $login.prop("disabled", false);
    $modifyFeature.prop("disabled", false);
    $selectFeature.prop("disabled", false);

    $getInfo.prop("disabled", true);

    //impostiamo la variabile di controllo esecuzione [MODIFY] a true
    modifyAllowed = true;
    //settiamo a false tutte le altre variabili di controllo
    infoAllowed = false;
    selectAllowed = false;    //lo mettiamo false così che non si può selezionare un altro elemento durante l'atto di modifica


    //invochiamo la funzione che permette l'inizializzazione degli 
    //elementi necessari alla modifica delle feature
    resetModifyFeatureTotal();
    modifyFeature();


    //eliminiamo elemnto Select per prevenire la selezione accidentale dell'utente
    //resetSelectFeature    --> NON SI PUò altrimenti perdiamo anchee il eprmesso attivato col select

  } else {
    //se il colore del pulsante "select_feature" è 'corallo'
    //cambiamo colore e disabilitiamo i pulsanti giusti
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
    $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');

    $toggleEditing.prop("disabled", false);
    $login.prop("disabled", false);
    $modifyFeature.prop("disabled", false);
    $selectFeature.prop("disabled", false);

    $getInfo.prop("disabled", true);

    //resettiamo le variabili di "modifyFeature"
    resetModifyFeatureTotal();
    //resettiamo la feature di selezione
    //resetSelectFeature    --> NON SI PUò altrimenti perdiamo anchee il eprmesso attivato col
    //impostiamo variabile di controllo del [SELECT] a true
    selectAllowed = true;   //così possiamo selezionare un altro elemento nella mappa

    //resettiamo le variabili di "selectFeature"  --> non ce n'è bisogno perchè vengono resettate una volta premuto il relativo pulsante
    //resetSelectFeature();
  }//end if-else
});// end listener pulsante [MODIFY]




//////////////
// FUNZIONI //
//////////////

//////////////////////////////////////////////////
//funzione invocata al click sul pulsante [Aggiorna Informazioni]
function modifyFeature() {
  if (arrayChiaviModifica.length == 0) {
    alert("Attenzione non è stato selezionato niente ++ " + arrayChiaviModifica.length);
  } else {
    //vengono creati gli elementi HTML necessari per le operazioni di modifica
    createModifyElements();
    //viene popolato il selettore delle varie feature modificabili
    populateFeature();
  }
}//end modifyFeature()

//variabile locale (o globale) da spostare in cima una volta finita la funzione
var countChangeModify = 0;

//////////////////////////////////////////////////////////////////////////////////////
//funzione per creare elementi HTML base necessari per la modifica di info di un layer
function createModifyElements() {
  //eliminiamo eventuali elementi precedenti
  //$modifyContainerElement.empty();   //dovrebbe essere inutile perche faccio questo passaggio in altre featuresToModify

  //creiamo l'elemento 'label' ed aggiungiamo i vari attributi
  let $labelModify = $('<label>');
  $labelModify.attr('for', 'features');
  $labelModify.text("Scegliere la feature da modificare:");

  //creiamo elemento <select> ed aggiungiamo i vari attributi
  let $selectModify = $('<select>');
  $selectModify.addClass("form-select");
  $selectModify.addClass("m-1");
  $selectModify.attr({
    id: "features-select-container",
    name: "features"
  });
  $selectModify.on('change', function (e) {   //invocando featuresToModify all'interno della funzione anonima possiamo utilizzare correttamente la funzione
    featuresToModify(this);
    console.log("e");
    console.log(e);
    countChangeModify++;
  });
  console.log("$selectModify");
  console.log($selectModify);

  //aggiungiamo gli elementi alla pagina HTML
  $modifyContainerElement.append($labelModify);
  $modifyContainerElement.append($selectModify);
} //end createModifyElements()

////////////////////////////////////////////////////////////////////////
// funzione per popolare elemento <select> relativo al pulsante "modify"
function populateFeature(e) {
  //se ci sono elementi nell'array allroa eseguiamo altrimenti no
  //20/04/2022  --> forse potrei eleiminarlo
  /*  if (arrayChiaviModifica.length == 0) {
      alert("Attenzione non è stato selezionato niente ++ " + arrayChiaviModifica.length);
    } else {*/
  //andiamo a lavorare per ogni chiave all'interno dell'array, prelevando le informazioni
  //e mostrandole nel menù relativo
  arrayChiaviModifica.forEach(function (e, layerGroupLength) {
    if (layerGroupLength != 0) {
      //aggiungiamo un elemento <option> al container delle feature, option avrà 'value' = all'indice dell'array che lo contiene
      $('#features-select-container')
        .append($('<option>').val(layerGroupLength).text(e));  //non assegnamo 'id' agli oggetti perchè non è necessario 
      console.log(layerGroupLength);
    }
  });
  //}
}//end populateFeature()


//variabile globale da spostare in cima al codice una volta terminata la funzione
var layerGroupLengthElementToModify = 0;

///////////////////////////////////////////
//funzione per la memorizzazione delle info
function featuresToModify(selectedElement) {
  //console.log(selectedElement.value);    --> selectedElement.value corrisponde al value dell'oggetto selezionato

  //RICORDA -- aggiungere un RESET INFO MESSE PRECEDENTEMENTE
  //reset di eventuali elementi HTML precedenti
  if (countChangeModify != 0) {
    $('#textAreaToModify-element').remove();
    $('#buttonSubmit').remove();
  }

  console.log("countChangeModify")
  console.log(countChangeModify);
  //salviamo l'indice relativo alla feature da modificare nella variabile globale relativa
  layerGroupLengthElementToModify = selectedElement.value;
  //console.log("layerGroupLengthElementToModify");
  //console.log(layerGroupLengthElementToModify);

  //creiamo variabile contenente <textarea> HTML in cui inserire le info dell'elemento selezionato dall'utente
  let $textArea = $('<textarea>');
  $textArea.addClass("form-control");
  $textArea.addClass("m-1");
  //aggiungiamo un nome univoco alla proprietà 'value' ed 'id'
  $textArea.attr({
    value: "textAreaToModify-element",
    id: "textAreaToModify-element"
  });

  //aggiungiamo il testo già presente nella feature che vogliamo modificare
  $textArea.text(arrayValoriModifica[layerGroupLengthElementToModify]);
  console.log($textArea);

  //rimuoviamo eventuali elementi precedenti
  //$modifyContainerElement = $('#modify-container');

  //aggiungiamo l'oggetto <textarea> all'oggetto <form> così da visualizzarlo sul browser
  $modifyContainerElement.append($textArea);



  let $buttonSubmit = $('<button>');
  $buttonSubmit.addClass("btn-secondary");
  $buttonSubmit.addClass("m-1");
  $buttonSubmit.attr({
    value: 'buttonSubmit',
    id: 'buttonSubmit',
  });
  $buttonSubmit.text('Invia');

  //aggiungiamo pulsante [SUBMIT] per invio definitivo info da modificare al server
  $modifyContainerElement.append($buttonSubmit);

  //aggiungiamo listener di eventi al pulsante button che risvegli la funzione per azionare update delle info
  $buttonSubmit.on('click', function (e) {
    //qui facciamo avviare la funzione vera e propria che andrà a inviare le nuove info al server
    postModifiedValue($textArea.val());   //l'argomento passato corrisponde al valore riportato nell'area testuale al momento del click
    // ATTENZIONE - ciò che è scritto non è nell'area non si visualizza tramite comando '.text()' ma con '.val()'
    //ATTENZIONE -  probabilmente dovremo impostare il trucco del "riferimento alla funzione" per far funzionare anche il metodo '.un' oppure jquery '.remove'
  });
}//end featuresToModify()


/////////////////////////////////////////////////////////////////////
/// funzione che va a caricare sul serve il nuovo valore della feature selezionata
function postModifiedValue(valueToPost) {    // NOTA:  valueToPost è esattamente la parola che dobbiamo caricare sul server
  //console.log("valueToPost");
  //console.log(valueToPost);

  //memorizziamo l'elemento che conterrà il nome del layer
  //usiamo la funzione substring(0,16) perchè è una caratteristica peculiare del progetto che i nomi dei vari layer
  //utilizzati abbiano una lunghezza pari a 16 lettere
  let nomeLayer = arrayValoriModifica[0].substring(0, 16);
  console.log(nomeLayer);
  //memorizziamo l'url a cui effettuare la richiesta di update
  let urlUpdate = 'http://localhost:8080/geoserver/wfs'
  //memorizziamo il tipo di metodo che vogliamo eeffettuare nella richiesta HTTP
  let method = "POST";
  //memorizzo in una variabile il contenuto XML della richiesta che verrà fatta al server
  let postXMLCode = '<wfs:Transaction service="WFS" version="1.0.0"' +
    ' xmlns:restartGIS="restartGIS"' +
    ' xmlns:ogc="http://www.opengis.net/ogc"' +
    ' xmlns:wfs="http://www.opengis.net/wfs">' +
    ' <wfs:Update typeName="restartGIS:' + nomeLayer + '">' +
    ' <wfs:Property>' +
    ' <wfs:Name>' + arrayChiaviModifica[layerGroupLengthElementToModify] + '</wfs:Name>' +
    ' <wfs:Value>' + valueToPost + '</wfs:Value>' +
    ' </wfs:Property>' +
    ' <ogc:Filter>' +
    ' <ogc:FeatureId fid="' + arrayValoriModifica[0] + '"/>' +
    ' </ogc:Filter>' +
    ' </wfs:Update>' +
    ' </wfs:Transaction>';
  //creiamo l'elemento che effettuerà la richiesta
  console.log(postXMLCode);

  /*username e password che successivamente si troveranno in un altra posizione*/
  //let username = "";
  //let password = "";

  //usando jquery effettuiamo la richiesta al server
  $.ajax({
    type: method,
    url: urlUpdate,
    contentType: "application/xml",
    data: postXMLCode,
    beforeSend: function (xhr) {
      //console.log(username + " - - " + password);
      //xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
      //alert("beforeSend..." + typeof (xhr));
      //console.log(postXMLCode)
    },                                              //devo aggiungere messaggio di alert in caso di errori e console.log del response ottenuto(valutare quando è opportuno mostrare info nel log)
    complete: function (data) {
      //alert("complete..." + data.responseText)
      console.log(data.responseText)

      var includedString = (data.responseText).includes("ServiceException");
      if (includedString) {
        alert("Attenzione! La modifica non è stata effettuata perchè l'utente non risulta abilitato oppure si è selezionato l'attributo di un layer non modificabile.")
      } else {
        alert("La modifica è stata eseguita correttamente.")
      }
    },
    success: function (data, statusText, xhr) { //mantengo questi parametri perchè funziona bene l'esecuzione
      var status = xhr.status;                //200
      //var head = xhr.getAllResponseHeaders(); //Detail header info
      console.log("success --> HTTP " + status);
      reload()
    },
    error: function (data, statusText, xhr) {
      console.log("error --> HTTP " + status)
    }
  }); //end ajax 

}//end postModifiedValue()


//////////////////////////////////////////////////////////////////////////
// funzione per ottenere le info del layer selezionato sia nel popup che nella tabella
function getInfoLayers(e) {
  //funzione per ottenere info su un layer cliccato

  let featuresArray = [];    //array contenitore feature 
  let layerGroupLength = 0;           //indice identificativo elenti contenitore
  let clickedCoordinate; //var coordinate punto clickato

  //resettiamo le informazioni visualizzate nella mappa
  resetInfoContainer();

  if (infoAllowed) {
    //in ogni pixel dell'oggetto 'map' analizziamo ogni feature presente
    /// 'forEachFeatureAtPixel' si attiva solo se clickiamo sopra un layer vettoriale e non sopra una mappa base
    /// quindi non necessita di eventuali verifiche e controlli riguardanti eventuali elementi non definiti
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {    //
      //preleviamo coordinate del punto clickato
      clickedCoordinate = e.coordinate;

      //inseriamo la feature nell'array contenitore
      featuresArray[layerGroupLength] = feature;
      layerGroupLength += 1;   //aumentiamo l'indice per non sovrascrivere le feature

      console.log(feature)
      //console.log(featuresArray);
    });

    //creiamo due variabili contenitore per le info dell'elemento cliccato
    //non dichiarandole preventivamente, apparterranno all'oggetto "window" ed avranno "scope" globale
    tabellaCompletaInfo = "";
    overlayInfo = "";

    //una volta riempito il 'featuresArray' andiamo ad elaborare i valori al suo interno
    featuresArray.forEach(function (e) {
      printInfoComplete(e);
    });//end forEach
    overlayLayer.setPosition(clickedCoordinate);
    //$overlayContainerElement.append(overlayInfo);
    $infoContainerElement.append(tabellaCompletaInfo);
  };//end if
}//end getInfoLayers()


//reset delle info mostrate a schermo tramite la funzione getInfoFeature()
function resetInfoContainer() {
  //svuotiamo la tabella
  $infoContainerElement.empty();
  //svuotiamo l'elemento overlay
  //$overlayContainerElement.empty(); //forse devo commentarlo 6/4/22
}//end reseresetInfoContainer()

//////////////////////////////////////////////////////////////////////////
// funzione per stampare le info del layer sia nel popup che nella tabella - invocata da getInfoLayers()
function printInfoComplete(e) {
  ////creiamo due elementi vuoti di tipo stringa che conterranno gli identificativi ed i loro valori
  ////all'interno delle due tabelle dovremmo scrivere il codice HTML contenuto nella nostra feature, sommando il cod HTML di volta in volta
  let tabellaChiavi = '<table class="table table-bordered border border-3 border-dark"><thead class="table-primary"><th>fid</th>';
  let tabellaValori = "<tbody><tr><th>" + e.W;
  //let overlayChiavi = "<span class='overlay-text'>fid</span><br>";
  //let overlayValori = "<span class='overlay-text'>" + e.W + "</span><br>";

  //GeoJSON contenente le info di nostro interesse del file vettoriale
  let objectFeature = e.A;    //objectFeature è in formato JSON, non è un array 

  //la funzione sotto l ho "presa spunto" e devo comprendere bene come funziona... guarda il link x avere + info
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  //
  //la funzione prende objectFeature e va ad assegnare ad ogni elemento al suo interno una coppia "chiave:valore" univoca e costante 
  for (const [key, value] of Object.entries(objectFeature)) {
    //sapendo che solo 'geometry' risulta essere la proprietà che non ci interessa, elaboriamo i dati solo quando incontriamo gli altri valori
    if (key != 'geometry') {
      //inseriamo le chiavi ed i valori all'interno dell'opportuna zona della tabella
      tabellaChiavi += ("<th>" + key + "</th>");
      tabellaValori += ("<td>" + value + "</td>");
    }//end if
    //console.log(`${key}: ${value}`) //   `  <-- attento che questo simbolo ha un significato particolare: https://qastack.it/programming/27678052/usage-of-the-backtick-character-in-javascript 
  }//end for
  //aggiungiamo tag di chiusura della tabella
  tabellaChiavi += "</tr></thead>";
  tabellaValori += "</tr></tbody></table>";
  //concateniamo alla variabile conentente la tabella principale
  tabellaCompletaInfo += tabellaChiavi;
  tabellaCompletaInfo += tabellaValori;
  //overlayInfo += overlayChiavi;
  //overlayInfo += overlayValori;
  /*console.log(tabellaChiavi);
  console.log(tabellaValori);
  console.log(tabellaCompletaInfo);
  console.log(overlayChiavi);
  console.log(overlayValori);
  console.log(overlayInfo);*/
}//end printInfoComplete()

///////////////////////////////////////
// funzione per ottenere e stampare info dei layer di un punto clicckato
////////////////////////////////////////////////
//funzione per abilitare i pulsanti di EDITING
function toggle_editing() {
  if ($toggleEditing.hasClass('btn-primary')) {    //se il colore è bianco/grigio [NON SELEZIONATO]
    //settiamo a FALSE la var di controllo per osservare le info dei layer - blocchiamo la visualizzazione delle info
    infoAllowed = false;
    map.removeOverlay(overlayLayer);

    //se la var di controllo del [SELECT] è settata a TRUE allora eseguiamo un reset di tale pulsante
    if (selectAllowed == true) {
      resetSelectFeature();
    }

    //eliminiamo eventuali informazioni riportate precedentemente negli appositi spazi
    $infoContainerElement.empty();
    //$overlayContainerElement.empty();
    $modifyContainerElement.empty();
    //modifchiamo colore dei pulsanti
    $getInfo.removeClass().addClass('btn-primary border-dark border-2');
    $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
    $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
    //modifichiamo visibilità dei pulsanti
    $selectFeature.prop("disabled", false);
    $login.prop("disabled", false);
    $modifyFeature.prop("disabled", true);
    $getInfo.prop("disabled", true);
  } else {
    //resettiamo eventuali elementi del "select"
    //resetSelectFeature();
    //modifchiamo colore dei pulsanti
    $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
    $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
    $login.removeClass().addClass('btn-primary border-dark border-2');
    $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
    //modifichiamo visibilità dei pulsanti
    $selectFeature.prop("disabled", true);
    $login.prop("disabled", true);
    $modifyFeature.prop("disabled", true);
    $getInfo.prop("disabled", false);

    //effettuiamo il reset dei vari pulsanti premuti ad eccezione di "GetInfo"
    resetModifyFeatureTotal();
    resetSelectFeature();
  }
}//end toggle_editing()


////////////////////////////////////////////////////////////////
/* funzione invocata ad ogni click sul pulsante selectFeature */     // NOTA: IMPLEMENTO il rpelievo delle informazioni come in getInfo,  troppi strippi negli ultimi giorni con ol.select
function selectFeature(e) {
  let featuresArray = [];    //array contenitore feature 
  let layerGroupLength = 0;           //indice identificativo elenti contenitore
  //let clickedCoordinate; //var coordinate punto clickato

  //se la var di controllo è impostata a TRUE
  if (selectAllowed == true) {
    //in ogni pixel dell'oggetto 'map' analizziamo ogni feature presente
    /// 'forEachFeatureAtPixel' si attiva solo se clickiamo sopra un layer vettoriale e non sopra una mappa base
    /// quindi non necessita di eventuali verifiche e controlli riguardanti eventuali elementi non definiti
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {    //


      //preleviamo coordinate del punto clickato
      //clickedCoordinate = e.coordinate;

      //inseriamo la feature nell'array contenitore
      featuresArray[layerGroupLength] = feature;
      layerGroupLength += 1;   //aumentiamo l'indice per non sovrascrivere le feature

      //console.log(feature)
      //console.log(featuresArray);
    });

    //creiamo elemento contenitore informazioni per overlay
    //overlayInfo = "";
    //eliminiamo eventuali info presenti su schermo
    //resetOverlay();
    //una volta riempito il 'featuresArray' andiamo ad elaborare i valori al suo interno
    featuresArray.forEach(function (e, layerGroupLength) {
      if (layerGroupLength == 0) {
        printAndSaveInfo(e);    //la "e" corrisponde all'elemento dell'array
      }/*else{  
        console.log("selectFeature: non faccio niente, layerGroupLength = "+ layerGroupLength)
      }*/
    });//end forEach

    //overlayLayer.setPosition(clickedCoordinate);
    //$overlayContainerElement.append(overlayInfo);

    //// info salvate correttamente nelle variabili globali
    /*console.log("arrayValoriModifica");
    console.log(arrayValoriModifica);
    console.log("arrayChiaviModifica");
    console.log(arrayChiaviModifica);*/
  };//end if
} //end selectFeature()

//funzione per salvare e stampare le info del layer selezionato tramite pulsante [SELECT]
function printAndSaveInfo(e) {
  ////creiamo due array che conterranno gli identificativi ed i loro valori
  let contatoreIndice = 0;
  let arrayChiavi = ["fid"];
  let arrayValori = [e.W];
  //let overlayChiavi = "<span class='overlay-text'>" + arrayChiavi[0] + "</span><br>";
  //let overlayValori = "<span class='overlay-text'>" + arrayValori[0] + "</span><br>";

  //GeoJSON contenente le info di nostro interesse del file vettoriale
  let objectFeature = e.A;    //objectFeature è in formato JSON, non è un array 

  //la funzione sotto l ho "presa spunto" e devo comprendere bene come funziona... guarda il link x avere + info
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  //
  //la funzione prende objectFeature e va ad assegnare ad ogni elemento al suo interno una coppia "chiave:valore" univoca e costante 
  for (const [key, value] of Object.entries(objectFeature)) {
    //sapendo che solo 'geometry' risulta essere la proprietà che non ci interessa, elaboriamo i dati solo quando incontriamo gli altri valori
    if (key != 'geometry') {
      contatoreIndice++;
      //inseriamo le chiavi ed i valori all'interno dell'opportuna zona della tabella
      arrayChiavi[contatoreIndice] = key;
      arrayValori[contatoreIndice] = value;
    }//end if
    //console.log(`${key}: ${value}`) //   `  <-- attento che questo simbolo ha un significato particolare: https://qastack.it/programming/27678052/usage-of-the-backtick-character-in-javascript 
  }//end for

  //console.log(contatoreIndice);

  //aggiungiamo le info del layer clickato al popup
  //overlayInfo += overlayChiavi;
  //overlayInfo += overlayValori;

  //salviamo le info appena prelevate nei rispettivi array globali
  arrayChiaviModifica = arrayChiavi;
  arrayValoriModifica = arrayValori;
}//end printInfoComplete()

////////////////////////////////////////////////////////////
/* funzione per resettare le variabili di selectFeature */        //FUNZIONA BENE
////////////////////////////////////////////////////////////
function resetSelectFeature() {
  //console.log("resetSelectFeature activated");

  //settiamo a false tutte le altre variabili di controllo
  selectAllowed = false;

  //19-4-2022  --> forse lo devo eliminare
  //eliminiamo i componenti html usati per la selezione della feature
  $modifyContainerElement.empty();
  //resetOverlay();
  //rimuoviamo l'interazione dalla mappa
  map.removeInteraction(select);
  //sovrascriviamo un nuovo elemento select per cancellare ogni dato rimasto in memoria
  var newSelect = new ol.interaction.Select({
    filter: function () {
      if (selectAllowed)
        return true;
      else
        return false;
      }
  });
  select = newSelect;
  //eliminiamo il listener 'selectFeature' da ogni click nella mappa
  map.un('click', functionSelectFeatureReference);    ///NOTA: '.un' funziona, bisogna passargli semplicemente la funzione a cui si riferisce senza alcun parametro
  ///per questo motivo si usa come argomento una variabile che funge da riferimento alla funzione  --> https://medium.com/@DavideRama/removeeventlistener-and-anonymous-functions-ab9dbabd3e7b
}//end resetSelectFeature()


//////////////////////////////////////////////////////////
/* funzione per resettare le variabili di modifyFeature */
//////////////////////////////////////////////////////////
function resetModifyFeatureTotal() {
  //settiamo a false la variabile di controllo del modify
  modifyAllowed = false;

  //eliminiamo tutti gli elementi creati con la funzione modifyFeature()
  //in questo modo si eliminano anche i listener di eventi precedentemente creati
  $modifyContainerElement.empty();

  //eliminiamo i valori memorizzati nelle variabili globali --> questivanno bene, sono da resettare
  countChangeModify = 0;
  //eliminiamo i valori memorizzati nelle variabili globali --->> NON LO FARE PERCHè SE RIPREMI MODIFY DEVONO ESSERE MEMORIZZATI DEI VALORI
  //arrayChiaviModifica = null;
  //arrayValoriModifica = null;
}//end resetModifyFeatureTotal


/* funzione per resettare le info presenti nel popup overlay */
//function resetOverlay() {
//eliminiamo tutti gli elementi interni all'elemento contenitore dell'overlay popup
//$overlayContainerElement.empty();
//}

////////////////////////////////////////////////////////////////////////////
/* Funzione per effettuare il reload dei layer in seguito ad una modifica */
////////////////////////////////////////////////////////////////////////////
function reload() {
  // array booleano contenente le visibilità attuali dei layer
  var arrayVisible = [];
  // variabile contenitore di tutti i layer
  var layerGroupElement = new ol.layer.Group();
  layerGroupElement = layerGroup.getLayers();

  /*
  //molto utili tutti questi console.log di prove - tienili tutti buoni
  
  console.log("layerGroupElement");
  console.log(layerGroupElement);
  arrayGroup = layerGroupElement.R;
  console.log("layerGroupElement.R");
  console.log(layerGroupElement.R);
  console.log("layerGroupElement.R[1]");
  console.log(layerGroupElement.R[1]);
  console.log("layerGroupElement.R[1].A.visible");
  console.log(layerGroupElement.R[1].A.visible);
  console.log(layerGroupElement.R.length)
  */

  /***** Andiamo a creare i nuovi layer che caricheremo col reload */



  //new Aree di indagine
  const newAreeDiIndagineGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlAreeIndagine,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'AreeDiIndagine',
    style: layerStyle
  })
  newAreeDiIndagineGeoJSON.setOpacity(0.5);

  // new Foto del progetto
  const newFotoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlFoto,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'RestartFoto',
    style: photoStyle
  })
  newFotoGeoJSON.setOpacity(0.5);


  // new Aree a rischio
  const newAreeRischioGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlAreeRischio,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'AreeRischio',
    style: layerStyle
  })

  newAreeRischioGeoJSON.setOpacity(0.5);

  // new Frane RIL
  const newFraneRILGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlFraneRIL,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRIL',
    style: layerStyle
  })
  newFraneRILGeoJSON.setOpacity(0.5);

  //Frane RIL View Giulio   //successivamente useremo anche qua underscore x differenziare i layer classici da quelli che usano tabelle
  const newFraneRILGeoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlFraneRILGeo,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILGeo',
    style: layerStyle
  })
  newFraneRILGeoGeoJSON.setOpacity(0.5);

  //Frane RIL View Giacomo   //successivamente useremo anche qua underscore x differenziare i layer classici da quelli che usano tabelle
  const newFraneRILGenMorfoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlFraneRILGenMorfo,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILGenMorfo',
    style: layerStyle
  })
  newFraneRILGenMorfoGeoJSON.setOpacity(0.5);

  // new "VIEW" Frane_Morfo
  const newFraneRILAcqueSupGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      //l'url sottostante accetta anche il percorso localhost ( e di conseguenza anche file rpelevati tramite http)
      url: urlFraneRILAcqueSup,
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILAcqueSup',
    style: layerStyle
  })
  newFraneRILAcqueSupGeoJSON.setOpacity(0.5);
  //ultimo layer del reload

  //memorizziamo in una variabile la lunghezza dell'array contenenente i layer
  var layerGroupLength = layerGroupElement.R.length

  //inseriamo nell'array le informazioni sulla visibilità di ogni layer
  for (var i = 0; i < layerGroupLength; i++) {
    //memorizziamo quali layer sono attualmente visibili oppure no
    arrayVisible[i] = layerGroupElement.R[i].A.visible;
  }

  for (var i = 0; i < arrayVisible.length; i++) {
    console.log("arrayVisible[i]");
    console.log(arrayVisible[i]);
  }


  //eliminiamo i layer precedenti
  map.removeLayer(layerGroup);

  //creiamo un array contenitore per i nuovi layer
  var newLayersGroupArray = [
    //i layers inseriti in questo ordine permettono di essere visti dalle funzioni [1° = QUCTR, 2°= LimCom, 3° = LimProv]
    newFraneRILGeoJSON, newFraneRILAcqueSupGeoJSON, newFraneRILGeoGeoJSON, newFraneRILGenMorfoGeoJSON,
    newAreeDiIndagineGeoJSON, newAreeRischioGeoJSON, newFotoGeoJSON
  ];

  //impostiamo a visibili i nuovi layer che erano stati attivati precedentemente
  for (var i = 0; i < layerGroupLength; i++) {
    newLayersGroupArray[i].setVisible(arrayVisible[i]);
  }

  // creiamo il nuovo gruppo di layer vettoriali
  const newLayerGroup = new ol.layer.Group({
    layers: newLayersGroupArray
  })

  //aggiungiamo il nuovo gruppo di layer alla mappa
  map.addLayer(newLayerGroup);

  //scambiamo il riferimento al nuovo gruppo di layer con quello vecchio
  layerGroup = newLayerGroup;
}//end reload()
