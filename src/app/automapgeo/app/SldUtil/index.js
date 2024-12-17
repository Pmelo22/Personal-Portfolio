import JSZip from 'jszip';
import  XMLParser  from 'react-xml-parser';



export function Unzip(buffer){

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

	if(str.includes('se:Rule')){
		var find = 'se:'
		var re = new RegExp(find, 'g');
		str = str.replace(re, 'sld:'); 

	};

	
    var xml = new XMLParser().parseFromString(str)   
	
	return xml

	}catch(e){
       
		console.log(e)

	}
	



}
