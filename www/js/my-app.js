// Initialize your app
var myApp = new Framework7({
    swipePanel: 'left',
    material: true, //untuk mengaktifkan theme material
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
     dynamicNavbar: true
});


// fungsi untuk memanggil halaman
myApp.onPageInit('index', function (page) {

});

//jika halaman gps terbuka
myApp.onPageInit('gps', function(page){
	//mengaktifkan gps
	var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
	}
	
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);	

   //ambil posisi gps
   function onSuccess(position) {
   	   //munculkan di input text
	    var posisi_now=position.coords.latitude+','+position.coords.longitude;
	    myApp.alert(posisi_now);

	    //mengubah koordinat ke alamat
	    geocoder = new google.maps.Geocoder();  
		geocoder.geocode({'address':posisi_now}, 
			function(result, status){
		      if (status == google.maps.GeocoderStatus.OK) {
		      	console.log(result);
   	  		 	$$('#lokasi_anda').val(result[0].formatted_address);
		      }
			}
		);
		//memunculkan di peta
   	   var lokasigps=new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	   var mapOptions = {
	       center: lokasigps,
	       zoom: 16,
	       gestureHandling: 'cooperative', //untuk gesture mobile
	       disableDefaultUI: true, //disable control
	       mapTypeId: google.maps.MapTypeId.ROADMAP
	   };
	   var map = new google.maps.Map(document.getElementById("gpsMap"), mapOptions);

	   // var img="img/logo.png";
	   var marker = new google.maps.Marker ( { //menambahkan marker
	      position:lokasigps,
	      map:map,
	      animation: google.maps.Animation.BOUNCE, //animasi
	      // icon: img,
	      title:"posisi saya"
	   });

	   google.maps.event.addDomListener(marker, 'click', function() { //event
	      myApp.alert('Marker was clicked!');
	   });		
	}

	function onError(error) {
      myApp.alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
   } 
});


// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('map', function (page) {
//maps   
   var lokasi = new google.maps.LatLng(-7.8422462, 111.9461466);

   var mapOptions = {
       center: lokasi,
       zoom: 10,
       gestureHandling: 'cooperative', //untuk gesture mobile
       disableDefaultUI: true, //disable control
       mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   var map = new google.maps.Map(document.getElementById("staticMap"), mapOptions);

   // var img="img/logo.png";
   var marker = new google.maps.Marker ( { //menambahkan marker
      position:lokasi,
      map:map,
      animation: google.maps.Animation.BOUNCE, //animasi
      // icon: img,
      title:"Aku bocah Kediri"
   });

   google.maps.event.addDomListener(marker, 'click', function() { //event
      myApp.alert('Marker was clicked!');
   });
});



myApp.onPageInit('carlok', function(page){
	$$('#tujuan').on('keyup keydown change', function(){
		var posisi=$$(this).val();
		geocoder = new google.maps.Geocoder();  
		geocoder.geocode({'address':posisi},
		    function (result, status){
		      if (status == google.maps.GeocoderStatus.OK) {
		        var posisi_tujuan = result[0].geometry.location;
		         console.log(posisi_tujuan);
				   var mapOptions = {
				       center: posisi_tujuan,
				       zoom: 16,
				       gestureHandling: 'cooperative', //untuk gesture mobile
				       disableDefaultUI: true, //disable control
				       mapTypeId: google.maps.MapTypeId.ROADMAP
				   };
				   var map = new google.maps.Map(document.getElementById("cariMap"), mapOptions);

				   // var img="img/logo.png";
				   var marker = new google.maps.Marker ( { //menambahkan marker
				      position:posisi_tujuan,
				      map:map,
				      animation: google.maps.Animation.BOUNCE, //animasi
				      // icon: img,
				      title:"Tujuan saya"
				   });
		      }
		    }
		);
	});
});

myApp.onPageInit('jarak', function(page){
	$$('#cek').on('click', function() {
		//ambil varible tujuan dan asal dari form
		var asal=$$('#origins').val();
		var tujuan=$$('#destinations').val();
		var biaya=$$('#biaya').val();

		//aktifkan google maps distance service
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix(
	  {
	    origins: [asal],
	    destinations: [tujuan],
	    travelMode: 'DRIVING', //travel mode yang digunakan 
	    avoidHighways: false,
	    avoidTolls: false,
	  }, callback);

		function callback(response, status) {
			if (status == 'OK') { //jika fungsi berhasil dijalankan
	        	var origins = response.originAddresses;
			    var destinations = response.destinationAddresses;

			    for (var i = 0; i < origins.length; i++) {
			      var results = response.rows[i].elements;
			      
			      if(results[0].status=='OK') { //jika rute ditemukan
				      var jarak=results[0].distance.text; //cari jarak
				      var waktu=results[0].duration.text; //cari waktu
				      var km=jarak.replace(' km', '');
				      var km=km.replace(',','.');
				      var ongkos=biaya*km;
				      //tampilkan hasil di form
				      $$('#distance').val(jarak);
				      $$('#time').val(waktu);
				      $$('#ongkos').val(ongkos);
				      // console.log('rute ditemukan');
			  	  } else { //jika rute tidak ditemukan
			  	  	myApp.alert('Rute Tidak Ditemukan');
			  	  }			      
			    }
	      	} else {
	      		console.log('error');
	      	}
		}
	});
	//bersih
	$$('#bersih').on('click', function(){
		$$('#origins').val('');
		$$('#destinations').val('');
		$$('#biaya').val('');
		$$('#distance').val('');
		$$('#time').val('');
		$$('#ongkos').val('');
	});
});