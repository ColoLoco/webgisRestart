////////////////////////////////////
// Variabili globali del progetto //
////////////////////////////////////

/* Variabili contenitore url */
// Url WFS aree di indagine
var urlAreeIndagine = 'http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AAreeIndagine____&outputFormat=application%2Fjson'
// Url WFS del progetto restart
var urlFoto = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFoto____________&outputFormat=application%2Fjson";
// Url WFS aree a rischio
var urlAreeRischio = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AAreeRischio_____&outputFormat=application%2Fjson";
// Url WFS delle frane RIL
var urlFraneRIL = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRIL________&outputFormat=application%2Fjson";
// Url WFS Frane RIL Acque Sup
var urlFraneRILAcqueSup = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILAcqueSup&outputFormat=application%2Fjson";
// Url WFS Frane RIL Geo
var urlFraneRILGeo = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILGeo_____&outputFormat=application%2Fjson";
// Url WFS Frane RIL Gen Morfo
var urlFraneRILGenMorfo = "http://localhost:8080/geoserver/restartGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=restartGIS%3AFraneRILGenMorfo&outputFormat=application%2Fjson";

/* Variabili contenitore per elementi HTML */
// Contenitore tabelle delle informazioni
const $infoContainerElement = $('#info-container');
// Contenitore elementi elementi HTML per aggiornamento informazioni
const $modifyContainerElement = $('#modify-container');
// Pulsante "Ottieni Informazioni"
const $getInfo = $('#get_info');
// Pulsante "Attiva/Disattiva Modifiche"
const $toggleEditing = $("#toggle_editing");
// Pulsante "Seleziona"
const $selectFeature = $("#select_feature");
// Pulsante "Login"
const $login = $("#login");
// Pulsante "Aggiorna Informazioni"
const $modifyFeature = $("#modify_feature");

// Array contenitore chiavi dell'elemento da modificare
var arrayChiaviModifica = [];
// Array contenitore valori dell'elemento da modificare
var arrayValoriModifica = [];
// Contatore per le funzioni di modifica
var countChangeModify = 0;
// Indice dell'attributo da modificare
var layerGroupLengthElementToModify = 0;

/* Variabili di controllo */
// Variabile di controllo funzione getInfo()
var infoAllowed = false;
// Variabile di controllo funzione selectFeature()
var selectAllowed = false;
// Variabile di controllo funzione modifyFeature()
var modifyAllowed = false;

/* Riferimenti alle funzioni */
// Riferimento alla funzione getInfo() utilizzato per aggiungere/rimuovere listener di eventi
var getInfoReference = function (e) {
    getInfoLayers(e);
};
// Riferimento alla funzione selectFeature() utilizzato per aggiungere/rimuovere listener di eventi
var functionSelectFeatureReference = selectFeature;

//////////////////////////////////////
// Elementi della mappa geografica //
/////////////////////////////////////

// Definiamo la proiezione relativa ai nostri dati geografici
proj4.defs("EPSG:6708", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);

// Oggetto Mappa
const map = new ol.Map({
    view: new ol.View({
        center: [1506417.15867854, 5316932.52882309],
        zoom: 8,
    }),
    target: 'js-map',
    controls: ol.control.defaults({ attribution: false }).extend([attributionControl])
});

// Attribution Control - pulsante
const attributionControl = new ol.control.Attribution({
    collapsible: true
});

// Interaction 'select' assegnata alla mappa
var select = new ol.interaction.Select({
    filter: function () {
        if (selectAllowed)
            return true;
        else
            return false;
    }
});

// Puntatore popup click utente
const $overlayContainerElement = $('#overlay-container');
const overlayLayer = new ol.Overlay({
    element: $overlayContainerElement[0],
    positioning: 'center-center'
});


///////////////////////////////////
// Stili utilizzati nel progetto //
///////////////////////////////////

// Stile dei layer
layerStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: [218, 112, 214]
    }),
    stroke: new ol.style.Stroke({
        color: [255, 0, 255]
    })
});

// Stile dell'elemento cerchio
var circleStyle = new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
        color: [218, 112, 214]
    }),
    stroke: new ol.style.Stroke({
        color: [0, 0, 0]
    })
});

// Stile del layer "Foto"
var photoStyle = new ol.style.Style({
    image: circleStyle
});



/////////////////////////////
// Layers Base della mappa //
/////////////////////////////


// Openstreet Map Standard layer
const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard'
});

// Openstreet Map Humanitarian layer
const openstreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHumanitarian'
});

// CartoDB BaseMap layer
const cartoDBBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        attributions: '© CARTO'
    }),
    visible: false,
    title: 'CartoDarkAll'
});

// Stamen Basemap layer
const StamenTerrainWithLabels = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'terrain-labels',
        attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrainWithLabels'
});

// Stamen Terrain layer
const StamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
        attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrain'
});

// Raccolta dei layer base della mappa
const mapLayerGroup = new ol.layer.Group({
    layers: [
        openstreetMapStandard, openstreetMapHumanitarian, cartoDBBaseLayer,
        StamenTerrainWithLabels, StamenTerrain,
    ]
});

// Aggiunta del gruppo di layer base alla mappa
map.addLayer(mapLayerGroup);


/* Selettore layer per mappe base */
// Memorizzazione elementi "figli" presenti in .sidebar corrispondenti ad "input[type=radio]"
const $baseMapElements = $('.sidebar > input[type=radio]');
// Per ogni elemento presente in baseMapElements
for (let baseMapElement of $baseMapElements) {
    // Aggiunta del listener per invocare la funzione ogni volta che cambia la mappa base selezionata
    baseMapElement.addEventListener('change', function () {
        // Ottenimento 'value' dell'elemento selezionato
        let baseMapElementValue = this.value;
        mapLayerGroup.getLayers().forEach(function (element, layerGroupLength, array) {
            let baseMapName = element.get('title');
            // Si rende visibile solo l'elemento il cui 'title' e 'value' sono uguali
            element.setVisible(baseMapName === baseMapElementValue);
        });
    });
};


///////////////////////
// Layers vettoriali //
///////////////////////

// Layer "Aree di indagine"
const AreeDiIndagineGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlAreeIndagine,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'AreeDiIndagine',
    style: layerStyle
})
AreeDiIndagineGeoJSON.setOpacity(0.5);

// Layer "Foto"
const FotoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlFoto,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'RestartFoto',
    style: photoStyle
});
FotoGeoJSON.setOpacity(0.5);

// Layer "Aree a rischio"
const AreeRischioGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlAreeRischio,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'AreeRischio',
    style: layerStyle
});
AreeRischioGeoJSON.setOpacity(0.5);

// Layer "Frane RIL"
const FraneRILGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlFraneRIL,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRIL',
    style: layerStyle
});
FraneRILGeoJSON.setOpacity(0.5);

// Layer "Frane RIL Geo" 
const FraneRILGeoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlFraneRILGeo,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILGeo',
    style: layerStyle
})
FraneRILGeoGeoJSON.setOpacity(0.5);

// Layer "Frane RIL Gen Morfo   ""
const FraneRILGenMorfoGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlFraneRILGenMorfo,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILGenMorfo',
    style: layerStyle
})
FraneRILGenMorfoGeoJSON.setOpacity(0.5);

// Layer "Frane RIL Acque Sup" 
const FraneRILAcqueSupGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: urlFraneRILAcqueSup,
        format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'FraneRILAcqueSup',
    style: layerStyle
})
FraneRILAcqueSupGeoJSON.setOpacity(0.5);

// Array contenitore layer WFS
var layersGroupArray = [
    FraneRILGeoJSON, FraneRILAcqueSupGeoJSON, FraneRILGeoGeoJSON, FraneRILGenMorfoGeoJSON,
    AreeDiIndagineGeoJSON, AreeRischioGeoJSON, FotoGeoJSON
];

// Raccolta dei layer vettoriali
var layerGroup = new ol.layer.Group({
    layers: layersGroupArray
})

// Aggiunta del gruppo di layer vettoriali alla mappa
map.addLayer(layerGroup);


// Selettore dei layer vettoriali visibili sulla mappa
const $vectorLayerElements = $('.sidebar > input[type=checkbox]');
// Per ogni elemento presente in baseMapElements
for (let vectorLayerElement of $vectorLayerElements) {
    // Aggiunta del listener per invocare la funzione ogni volta che cambia la mappa base selezionata
    vectorLayerElement.addEventListener('change', function () {
        // Ottenimento 'value' dell'elemento selezionato
        let vectorLayerElementValue = this.value;
        let vectorLayer;
        // Si rendono visibili solo gli elementi il cui 'title' e 'value' sono uguali
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

// Listener per visualizzare le info dei layer ad ogni click 
// PULSANTE OTTIENI INFORMAZIONI LAYER
$getInfo.on('click', function (e) {
    // Se il pulsante non è stato premuto
    if ($getInfo.hasClass('btn-primary')) {
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-danger border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
        $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $selectFeature.prop("disabled", true);
        $login.prop("disabled", true);
        $modifyFeature.prop("disabled", true);
        $toggleEditing.prop("disabled", false);

        // Abilitazione del controllo esecuzione di getInfoLAyers()
        infoAllowed = true;
        // Inserimento puntatore nella mappa
        map.addOverlay(overlayLayer);
        overlayLayer.setPosition(undefined);
        // Assegnamento listener click della mappa
        map.on('click', getInfoReference);
    } else {  
        // Se il pulsante è già stato premuto
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
        $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $selectFeature.prop("disabled", true);
        $login.prop("disabled", true);
        $modifyFeature.prop("disabled", true);
        $toggleEditing.prop("disabled", false);
        // Disabilitazione del controllo esecuzione di getInfoLAyers()
        infoAllowed = false;
        // Reset delle eventuali informazioni visualizzate
        resetInfoContainer();
        // Rimozione del puntatore dalla mappa
        overlayLayer.setPosition(undefined);
        map.removeOverlay(overlayLayer);
        // Rimozione listener click della mappa
        map.un('click', getInfoReference);
    }
});

// Listener per abilitare le interazioni coi layer 
// PULSANTE ATTIVA/DISATTIVA MODIFICHE
$toggleEditing.on("click", toggle_editing);

// Listener per aprire la pagina login di Geoserver
// PULSANTE LOGIN
$login.on("click", function (e) {
    window.open('http://localhost:8080/geoserver/web/')
});

// Listener per abilitare la selezione di un layer
// PULSANTE SELEZIONA
$selectFeature.on('click', function (e) {
    // Se il pulsante non è stato selezionato
    if ($selectFeature.hasClass('btn-primary')) {
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
        $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $selectFeature.prop("disabled", false);
        $login.prop("disabled", false);
        $modifyFeature.prop("disabled", false);
        $toggleEditing.prop("disabled", false);
        $getInfo.prop("disabled", true);
        // Abilitazione controllo esecuzione operazione di selezione
        selectAllowed = true;
        // Disabilitazione degli altri controlli
        infoAllowed = false;
        modifyAllowed = false;
        // Aggiunta interazione SELECT alla mappa    
        map.addInteraction(select);
        // Assegnamento listener click sulla mappa
        map.on('click', functionSelectFeatureReference);
    } else {
        // Se il pulsante non è stato selezionato
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
        $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $toggleEditing.prop("disabled", false);
        $login.prop("disabled", false);
        $selectFeature.prop("disabled", false);
        $modifyFeature.prop("disabled", true);
        $getInfo.prop("disabled", true);
        // Reset delle variabili di "selectFeature"
        resetSelectFeature();
    }
});

// Listener per abilitare la modifica di un layer 
// PULSANTE AGGIORNA INFORMAZIONI
$modifyFeature.on('click', function (e) {
    // Se il pulsante non è stato selezionato
    if ($modifyFeature.hasClass('btn-primary')) {
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
        $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-danger border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $toggleEditing.prop("disabled", false);
        $login.prop("disabled", false);
        $modifyFeature.prop("disabled", false);
        $selectFeature.prop("disabled", false);
        $getInfo.prop("disabled", true);
        // Abilitazione controllo esecuzione operazione di modifica
        modifyAllowed = true;
        // Disabilitazione controlli operazioni non richieste
        infoAllowed = false;
        selectAllowed = false;
        // Inizializzazione elementi per modifica delle feature
        resetModifyFeatureTotal();
        modifyFeature();
    } else {
        // Se il pulsante non è stato selezionato
        // Modifica stile degli altri pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
        $selectFeature.removeClass().addClass('btn-danger border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Disabilitazione dei pulsanti non necessari
        $toggleEditing.prop("disabled", false);
        $login.prop("disabled", false);
        $modifyFeature.prop("disabled", false);
        $selectFeature.prop("disabled", false);
        $getInfo.prop("disabled", true);
        // Reset delle variabili di "modifyFeature"
        resetModifyFeatureTotal();
        // Abilitazione controllo dell'operazione di "selezione" 
        selectAllowed = true;
    }
}); 


//////////////
// FUNZIONI //
//////////////

// Inizializzazione e popolamento delle informazioni modificabili
function modifyFeature() {
    if (arrayChiaviModifica.length == 0) {
        alert("Attenzione non è stato selezionato niente ++ " + arrayChiaviModifica.length);
    } else {
        // Creazione degli elementi HTML necessari per le operazioni di modifica
        createModifyElements();
        // Popolamento selettore delle varie feature modificabili
        populateFeature();
    }
}

// Creazione elementi HTML usati per le operazioni di modifica
function createModifyElements() {
    //creazione dell'elemento <label>
    let $labelModify = $('<label>');
    $labelModify.attr('for', 'features');
    $labelModify.text("Scegliere la feature da modificare:");

    // Creazione elemento <select> 
    let $selectModify = $('<select>');
    $selectModify.addClass("form-select");
    $selectModify.addClass("m-1");
    $selectModify.attr({
        id: "features-select-container",
        name: "features"
    });
    $selectModify.on('change', function (e) {   
        featuresToModify(this);
        countChangeModify++;
    });

    // Inserimento elementi nella pagina HTML
    $modifyContainerElement.append($labelModify);
    $modifyContainerElement.append($selectModify);
} 

// Popolamento <select> per la modifica
function populateFeature(e) {
    arrayChiaviModifica.forEach(function (e, layerGroupLength) {
        if (layerGroupLength != 0) {
            // Assegnamento elemento <option> al container delle feature
            $('#features-select-container')
                .append($('<option>').val(layerGroupLength).text(e));
        }
    });
}

// Memorizzazione delle informazioni
function featuresToModify(selectedElement) {
    // Rimozione eventuali elementi HTML presenti
    if (countChangeModify != 0) {
        $('#textAreaToModify-element').remove();
        $('#buttonSubmit').remove();
    }
    // Memorizzazione indice della feature da modificare
    layerGroupLengthElementToModify = selectedElement.value;
    // Crezione elemento <textarea> dove inserire  
    // informazioni elemento selezionato dall'utente
    let $textArea = $('<textarea>');
    $textArea.addClass("form-control");
    $textArea.addClass("m-1");
    // Assegnamento nome univoco alle proprietà 'value' ed 'id'
    $textArea.attr({
        value: "textAreaToModify-element",
        id: "textAreaToModify-element"
    });

    // Assegnamento testo memorizzato nella feature da modificare
    $textArea.text(arrayValoriModifica[layerGroupLengthElementToModify]);
    console.log($textArea);
    // Inserimento di <textarea> in <form> per visualizzazione su browser
    $modifyContainerElement.append($textArea);
    
    let $buttonSubmit = $('<button>');
    $buttonSubmit.addClass("btn-secondary");
    $buttonSubmit.addClass("m-1");
    $buttonSubmit.attr({
        value: 'buttonSubmit',
        id: 'buttonSubmit',
    });
    $buttonSubmit.text('Invia');

    // Inserimento nel body del pulsante per inviare le modifiche 
    $modifyContainerElement.append($buttonSubmit);

    // Listener pulsante per invio informazioni da modificare
    $buttonSubmit.on('click', function (e) {
        // L'argomento passato corrisponde al valore riportato nell'area testuale all'atto del click
        postModifiedValue($textArea.val());
    });
}


/// Invio sul server del nuovo valore della feature selezionata
function postModifiedValue(valueToPost) {
    // Memorizzazione dell'elemento che conterrà il nome 
    // del layer substring(0,16) usata perchè è conosciuta
    // la lunghezza prefissata dei nomi dei layer
    let nomeLayer = arrayValoriModifica[0].substring(0, 16);
    // Url a cui effettuare la richiesta di update
    let urlUpdate = 'http://localhost:8080/geoserver/wfs'
    let method = "POST";
    // XML della richiesta fatta al server
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

    // Esecuzione della richiesta
    $.ajax({
        type: method,
        url: urlUpdate,
        contentType: "application/xml",
        data: postXMLCode,
        complete: function (data) {
            // Stampa a schermo responso "richiesta eseguita correttamente"
            var includedString = (data.responseText).includes("ServiceException");
            if (includedString) {
                alert("Attenzione! La modifica non è stata effettuata perchè l'utente"
                + " non risulta abilitato oppure si è selezionato l'attributo di un layer non modificabile.")
            } else {
                alert("La modifica è stata eseguita correttamente.")
            }
        },
        success: function (data, statusText, xhr) { 
            var status = xhr.status;                
            console.log("success --> HTTP " + status);
            reload()
        },
        error: function (data, statusText, xhr) {
            console.log("error --> HTTP " + status)
        }
    });
}


// Ottenimento informazioni del layer selezionato
function getInfoLayers(e) {
    // Array contenitore feature 
    let featuresArray = [];    
    // Indice identificativo elementi nel contenitore
    let layerGroupLength = 0;           
    // Coordinate punto clickato
    let clickedCoordinate; 

    // Reset delle informazioni visualizzate nella mappa
    resetInfoContainer();
    if (infoAllowed) {
        // Analisi di ogni feature presente nel pixel selezionato sulla mappa
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {    //
            // Prelevamento coordinate del punto selezionato
            clickedCoordinate = e.coordinate;
            // Inserimento della feature nell'array contenitore
            featuresArray[layerGroupLength] = feature;
            layerGroupLength += 1;   
        });

        // Creazione variabili contenitore per le info dell'elemento cliccato
        tabellaCompletaInfo = "";
        overlayInfo = "";
        // Stampa informazioni delle feature prelevate
        featuresArray.forEach(function (e) {
            printInfoComplete(e);
        });
        overlayLayer.setPosition(clickedCoordinate);
        $infoContainerElement.append(tabellaCompletaInfo);
    };
}//end getInfoLayers()


// Reset informazioni mostrate a schermo
function resetInfoContainer() {
    $infoContainerElement.empty();
}

// Stampa informazioni nella tabella
function printInfoComplete(e) {
    // Creazione tabelle HTML
    let tabellaChiavi = '<table class="table table-bordered border border-3 border-dark"><thead class="table-primary"><th>fid</th>';
    let tabellaValori = "<tbody><tr><th>" + e.W;

    // GeoJSON contenente le informazioni del file vettoriale
    let objectFeature = e.A;    

    // Prelievo informazioni differenti dalla 'geometria' 
    for (const [key, value] of Object.entries(objectFeature)) {
        if (key != 'geometry') {
            // inserimento chiavi e valori all'interno dell'opportuna zona della tabella
            tabellaChiavi += ("<th>" + key + "</th>");
            tabellaValori += ("<td>" + value + "</td>");
        }//end if
    }//end for
    // Aggiunta tag di chiusura della tabella
    tabellaChiavi += "</tr></thead>";
    tabellaValori += "</tr></tbody></table>";
    // Concatenamento alla variabile contenente la tabella principale
    tabellaCompletaInfo += tabellaChiavi;
    tabellaCompletaInfo += tabellaValori;
}

// Abilitazione pulsanti per la modifica
function toggle_editing() {
    if ($toggleEditing.hasClass('btn-primary')) {    
        // Blocco della visualizzazione delle info
        infoAllowed = false;
        map.removeOverlay(overlayLayer);
        // Reset del layer precedentemente selezionato
        if (selectAllowed == true) {
            resetSelectFeature();
        }

        // Pulizia di eventuali informazioni rpecedenti
        $infoContainerElement.empty();
        $modifyContainerElement.empty();
        // Modifica colore pulsanti
        $getInfo.removeClass().addClass('btn-primary border-dark border-2');
        $toggleEditing.removeClass().addClass('btn-danger border-dark border-2');
        $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Modifica visibilità dei pulsanti
        $selectFeature.prop("disabled", false);
        $login.prop("disabled", false);
        $modifyFeature.prop("disabled", true);
        $getInfo.prop("disabled", true);
    } else {
        // Modifica colore pulsanti
        $toggleEditing.removeClass().addClass('btn-primary border-dark border-2');
        $selectFeature.removeClass().addClass('btn-primary border-dark border-2');
        $login.removeClass().addClass('btn-primary border-dark border-2');
        $modifyFeature.removeClass().addClass('btn-primary border-dark border-2');
        // Modifica visibilità dei pulsanti
        $selectFeature.prop("disabled", true);
        $login.prop("disabled", true);
        $modifyFeature.prop("disabled", true);
        $getInfo.prop("disabled", false);
        // Reset pulsanti premuti ad eccezione di "GetInfo"
        resetModifyFeatureTotal();
        resetSelectFeature();
    }
}


// Prelevamento informazioni dell'elemento selezionato
function selectFeature(e) {
    // Array contenitore feature 
    let featuresArray = [];    
     // Indice identificativo elementi nel contenitore
    let layerGroupLength = 0;          

    // Se la var di controllo è impostata a TRUE
    if (selectAllowed == true) {
        // Analisi di ogni feature presnete nel pixel selezionato
        // 'forEachFeatureAtPixel' si attiva solo se clickiamo sopra un layer vettoriale
        // quindi non necessita di eventuali verifiche e controlli 
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {    //
            // inserimento feature nell'array contenitore
            featuresArray[layerGroupLength] = feature;
            layerGroupLength += 1;   
        });

        // Riempito il 'featuresArray' si elaborano i valori al suo interno
        featuresArray.forEach(function (e, layerGroupLength) {
            if (layerGroupLength == 0) {
                // La "e" corrisponde all'elemento dell'array
                printAndSaveInfo(e);    
            }
        });
    };
}

// Salvataggio e stampa delle info del layer selezionato 
function printAndSaveInfo(e) {
    // Creazione array che conterranno gli identificativi ed i loro valori
    let contatoreIndice = 0;
    let arrayChiavi = ["fid"];
    let arrayValori = [e.W];
    // GeoJSON contenente le info di nostro interesse del file vettoriale
    let objectFeature = e.A;    
    for (const [key, value] of Object.entries(objectFeature)) {
        // elaboriamo i valori ad eccezione di 'geometry'
        if (key != 'geometry') {
            contatoreIndice++;
            // Inserimento chiavi e valori all'interno dell'opportuna zona della tabella
            arrayChiavi[contatoreIndice] = key;
            arrayValori[contatoreIndice] = value;
        }
    }

    // Inserimento informazioni negli array globali
    arrayChiaviModifica = arrayChiavi;
    arrayValoriModifica = arrayValori;
}

// Reset delle variabili di selectFeature 
function resetSelectFeature() {
    selectAllowed = false;
    // Eliminazione componenti html usati per la selezione della feature
    $modifyContainerElement.empty();
    // Rimozione interazione dalla mappa
    map.removeInteraction(select);
    // Sovrascrittura nuovo elemento Select
    var newSelect = new ol.interaction.Select({
        filter: function () {
            if (selectAllowed)
                return true;
            else
                return false;
        }
    });
    select = newSelect;
    // Eliminazione del listener
    map.un('click', functionSelectFeatureReference);   
}//end resetSelectFeature()

//Resettare variabili di 'modifyFeature'
function resetModifyFeatureTotal() {
    modifyAllowed = false;
    // Eliminazione elementi creati con la funzione modifyFeature()
    $modifyContainerElement.empty();
    countChangeModify = 0;
}

// Reload layer in seguito ad una modifica
function reload() {
    // array booleano contenente le visibilità attuali dei layer
    var arrayVisible = [];
    // variabile contenitore di tutti i layer
    var layerGroupElement = new ol.layer.Group();
    layerGroupElement = layerGroup.getLayers();

    // Crezione nuovi layer da assegnare
    // New Aree di indagine
    const newAreeDiIndagineGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlAreeIndagine,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'AreeDiIndagine',
        style: layerStyle
    })
    newAreeDiIndagineGeoJSON.setOpacity(0.5);

    // New Foto del progetto
    const newFotoGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlFoto,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'RestartFoto',
        style: photoStyle
    })
    newFotoGeoJSON.setOpacity(0.5);

    // New Aree a rischio
    const newAreeRischioGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlAreeRischio,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'AreeRischio',
        style: layerStyle
    })
    newAreeRischioGeoJSON.setOpacity(0.5);

    // New Frane RIL
    const newFraneRILGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlFraneRIL,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'FraneRIL',
        style: layerStyle
    })
    newFraneRILGeoJSON.setOpacity(0.5);

    // New Frane RIL Geo
    const newFraneRILGeoGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlFraneRILGeo,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'FraneRILGeo',
        style: layerStyle
    })
    newFraneRILGeoGeoJSON.setOpacity(0.5);

    // New Frane RIL Gen Morfo
    const newFraneRILGenMorfoGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlFraneRILGenMorfo,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'FraneRILGenMorfo',
        style: layerStyle
    })
    newFraneRILGenMorfoGeoJSON.setOpacity(0.5);

    // New Frane RIL Acque Sup Geo
    const newFraneRILAcqueSupGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: urlFraneRILAcqueSup,
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'FraneRILAcqueSup',
        style: layerStyle
    })
    newFraneRILAcqueSupGeoJSON.setOpacity(0.5);

    // Memorizzazione lunghezza dell'array contenenente i layer
    var layerGroupLength = layerGroupElement.R.length

    // Inserimento informazioni sulla visibilità di ogni layer
    for (var i = 0; i < layerGroupLength; i++) {
        // Memorizzazione quali layer sono attualmente visibili
        arrayVisible[i] = layerGroupElement.R[i].A.visible;
    }

    for (var i = 0; i < arrayVisible.length; i++) {
        console.log("arrayVisible[i]");
        console.log(arrayVisible[i]);
    }

    // Eliminazione layer precedenti
    map.removeLayer(layerGroup);
    // Crezione array contenitore per i nuovi layer
    var newLayersGroupArray = [
        // Layer inseriti rispettando un preciso ordine
        newFraneRILGeoJSON, newFraneRILAcqueSupGeoJSON, newFraneRILGeoGeoJSON, newFraneRILGenMorfoGeoJSON,
        newAreeDiIndagineGeoJSON, newAreeRischioGeoJSON, newFotoGeoJSON
    ];

    // Settaggio nuovi layer visibili 
    for (var i = 0; i < layerGroupLength; i++) {
        newLayersGroupArray[i].setVisible(arrayVisible[i]);
    }

    // Creazione nuovo gruppo di layer vettoriali
    const newLayerGroup = new ol.layer.Group({
        layers: newLayersGroupArray
    })

    // Aggiunta del nuovo gruppo di layer alla mappa
    map.addLayer(newLayerGroup);
    // Scambio riferimento tra nuovo gruppo di layer e quello vecchio
    layerGroup = newLayerGroup;
}