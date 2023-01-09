
var MAP_API = {

	AVIATION_API_URL: "http://localhost/API_full/api/airports.php",

	map : null,
	airports: null,
	icon: null,
	markers: [],

	initMap : function () {

		this.buildMap();
		this.fetchData();
		
	},

	buildMap : function () {

		this.icon = {
			url: "./img/plane.svg",
			anchor: new google.maps.Point(10,20),
			scaledSize: new google.maps.Size(20,20)
		};

		// initialiser la google map
		var paris = { 
			lat: 48.8534, 
			lng: 2.3488 
		};

		
		
		this.map = new google.maps.Map(document.getElementById("map"), {
			zoom: 5,
			center: paris
		});
		this.map.setOptions({disableDoubleClickZoom: true });
		
		
		this.map.addListener("dblclick", (mapsMouseEvent) => {
			// Create a new InfoWindow.
			var coord = (mapsMouseEvent.latLng.toJSON());
			
			infoWindow = new google.maps.InfoWindow({
			  position: mapsMouseEvent.latLng,
			});
			infoWindow.setContent(
					'<h1> Ajouter un Aéroport </h1> </br>'+
					'<div>'+
						'<label> Nom : </label>'+
						'<input type="text" id="nomAirport">' +
					'</div>'+
					'<div>'+
						'<label> Latitude : </label>'+
						'<input type="text" id="latitude" disable value="'+ coord['lat']+'"> '+
					'</div>'+
					'<div>'+
						'<label> Longitude : </label>'+
						'<input type="text" id="longitude" disable value="'+ coord['lng']+'"> '+
					'</div>'+
					'<button type="submit" onclick="MAP_API.addAirport();" id="confirm">Ajouter</button>'
			);
			infoWindow.open(this.map);
		  });
		},
	

	fetchData : function () {

		var self = this;

		var initObject = { 
			method: 'GET',
			mode: 'cors',
			headers: new Headers()
		};

		fetch( this.AVIATION_API_URL, initObject )
			.then( function( response ) { 
				console.log(response)
				return response.json() 
			})
			.then( function( list_airports ) {

				self.cleanList();
				self.cleanMap();

				self.airports = list_airports;

				self.airports.forEach( function ( airport, index ) {

					self.appendElementToList( airport );
					self.drawAirportOnMap( self.map, airport );
					console.log(airport)

				} );

			} );

	},

	appendElementToList : function ( airport ) {

		var li = document.createElement("LI");

		var a = document.createElement("A");
		a.setAttribute('data-id', airport.airport_id);
		a.setAttribute('data-lat', airport.latitude);
		a.setAttribute('data-lng', airport.longitude);

		var airport_name = document.createTextNode( airport.name );
		a.appendChild(airport_name);

		var btnDelete = document.createElement("A");
		btnDelete.setAttribute('data-id', airport.id);
		btnDelete.classList.add('btn-delete');

		var iconDelete = document.createTextNode( "x" );
		btnDelete.appendChild(iconDelete);
		
		li.appendChild(a);
		li.appendChild(btnDelete);

		var self = this;
		a.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			// TODO Afficher la modal 
		
			// mode = 'update'
			var id = event.target.dataset.id
			
			
			self.map.panTo( {
				lat: parseFloat(event.target.dataset.lat),
				lng: parseFloat(event.target.dataset.lng)
			} );

		});

		btnDelete.addEventListener('click', function(event) {
			event.preventDefault();
			

			// TODO faire la requete pour supprimer l'aeroport
			// mode = 'delete'
			 id = event.target.dataset.id
			 try {
				MAP_API.fetchRequest('DELETE', {id : id} )
				location.reload()
				
				
			 } catch (error) {
				console.log(error)
			 }
			
			

		});

		document.getElementById("airports-list").appendChild(li);

	},

	drawAirportOnMap : function( map, airport ) {

		var self = this;

		var marker = new google.maps.Marker({
			map: map,
			position: {
				lat: parseFloat(airport.latitude),
				lng: parseFloat(airport.longitude)
			},
			airport_id: airport.id,
			airport_name: airport.name,
			icon: self.icon,
			lat: parseFloat(airport.latitude),
			lng: parseFloat(airport.longitude)
		});

		// TODO au click sur un marker ouvrir la modal
		marker.addListener('click',()=> {
			console.log(marker)
			infoWindow = new google.maps.InfoWindow({
				position: {
					lat: marker.lat,
					lng: marker.lng
				},
			  });
			  infoWindow.setContent(
				'<h1>' + marker.airport_name  + '</h1>'
		);
		infoWindow.open(this.map);
			
		})
		// mode = 'update'
		// id = marker.get('id')
		self.markers.push(marker);

	},

	//showInfos : function (airport){

	//},

	addAirport : function (){
				
				nomAirP = document.getElementById('nomAirport').value;
				longitudeAirP = document.getElementById('longitude').value;
				latitudeAirP = document.getElementById('latitude').value;
				
				if(nomAirP.length <= 3){
					alert('Longueur min : 4 caractères')

				}
				else{
					this.fetchRequest('POST', {
						name : nomAirP,
						latitude: latitudeAirP,
						longitude: longitudeAirP
					} )
					location.reload()
				}
				//body = {"nom": nomAirP,"latitude":latitudeAirP, "longitude": longitudeAirP}
				
				
			
	},

	cleanList : function() {

		document.getElementById("airports-list").innerHTML = "";
	},

	cleanMap : function() {

		if ( this.markers.length == 0 ) return;

		this.markers.forEach( function ( marker ) {
			marker.setMap(null);
		} );

		this.markers = [];
	},

	fetchRequest : function( requestMethod, requestBody ) {

        var self = this;

        var initObject = {
            method: requestMethod,
            mode: 'cors',
            headers: new Headers(),
            body: JSON.stringify(requestBody)
        };

        fetch( self.AVIATION_API_URL, initObject )
		//console.log(initObject)
            .then( function( response ) {
                return response.json();
            })
            .then( function ( response ) {

                // TODO : utiliser response suivant nos besoins
                console.log( response );

            } );

    }
}
