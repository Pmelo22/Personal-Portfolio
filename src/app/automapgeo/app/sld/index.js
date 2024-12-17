import JSZip from 'jszip';
import  XMLParser  from 'react-xml-parser';


export function Unzip(buffer){

	console.log('entrei no unzip')
	// console.log(buffer)
	try{
		var zip = JSZip(buffer)	
	var files = zip.file(/.+/);
	var out = {};	
	var str = "";
	files.forEach(function(a) {
		
		if (a.name.slice(-3).toLowerCase() === 'sld') {
			out[a.name] = a.asNodeBuffer();			
			const sld = out[a.name]
			

			for (var i = 0; i < sld.length; i++) {				
				str += String.fromCharCode(parseInt(sld[i]));
			}	
		}
		

	});
  
    var xml = new XMLParser().parseFromString(str)   
	return xml.getElementsByTagName('sld:Rule');

	}catch(e){
       
		console.log(e)

	}
	



}
