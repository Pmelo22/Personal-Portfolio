export default class StyleShape  {
    constructor(xml) {   
       
        this.styles = {
            arquivoXml: xml,            
            name: xml.getElementsByTagName('sld:Name')[0].value,
            read: false,
            tipoShape: '',
            tipoFilter: '',            
            styles: [],
            arryLegendas: [],
          };
        this.Rules = {
           Name: [],
           Title: [],
           Symbolizer: [],
           Filter: [],
        };
        //this.arryLegendas = []
    }
    
    // BuscaStyle(layer){

    //     console.log(layer)


    // }

    Buscasldfilter(){
       const sldFilter = this.styles.arquivoXml.getElementsByTagName(this.styles['tipoFilter'])
       return sldFilter 
    }

    CreateStyle() {
        console.log('Iniciando o tipo de shape')
        var rules  = this.styles.arquivoXml.getElementsByTagName('sld:Rule').map( style =>
            {
               return style.children.map( rules => {
                   return rules
               })
            }
            
        )
       
        rules.map(rulesArray =>{

            rulesArray.map(legenda=> {   
                
                if(legenda.name == 'sld:Name'){       
                    this.Rules.Title.push(legenda.value)              
                    this.Rules.Name.push(legenda.value)                  
                    return
                }         
              
                if(legenda.name == 'ogc:Filter'){
                   this.styles.tipoFilter = legenda.children[0].name 
                   this.Rules.Filter.push(legenda.children)
                   return
                }        
    
                if(legenda.name == 'sld:PolygonSymbolizer'){
                 this.Rules.Symbolizer.push(legenda.children) 
                 this.styles.tipoShape = 'PolygonSymbolizer'
                  // importante carregar o proximo childrem separado 1
                  return
                }        
    
                if(legenda.name == 'sld:PointSymbolizer'){
                 this.Rules.Symbolizer.push(legenda.children) 
                 this.styles.tipoShape = 'PointSymbolizer'
                  // importante carregar o proximo childrem separado 1
                  return
                }                   

               if(legenda.name == 'sld:LineSymbolizer'){
                this.Rules.Symbolizer.push(legenda.children)  
                this.styles.tipoShape = 'LineSymbolizer'
                // importante carregar o proximo childrem separado 2
                return
               }   
               
            })  

        })

        console.log('Finalizando a escolha do tipo de shape')

        return this.styles;      
    }

    GetLegendas() {
        
        console.log('Iniciando a coleta das legendas do SLD');

        if (!this.Rules.Title.length > 0){
            this.CreateStyle()           
        }

        for (let i = 0; i < this.Rules.Title.length; i++){

            let fillColor 
            let fillOpacity
            let sizePoint
            let StrokeWidth
            let StrokeColor
            let StrokeOpacity
            // let temFill            

            this.Rules.Symbolizer[i].map(symbolizer =>{    

                // console.log(symbolizer);
                // add legend do tipo Ponto
                if(symbolizer.name == 'sld:Graphic'){
                    symbolizer.children.map(fill => {
                        if (fill.name == 'sld:Mark'){
                            fill.children.map(str => {
                                if(str.name = 'sld:Stroke'){
                                    str.children.map(line => {
                                        if(line.attributes.name == 'fill'){
                                            fillColor = line.value  
                                            // temFill = true                
                                        }
                                    })
                                }
                            })
                        }else if(fill.name == "sld:Size"){
                            sizePoint = fill.value
                        }
                    })
                // add preenchimento dos shapes de poligono e linha
                }else if (symbolizer.name == 'sld:Fill'){
                    symbolizer.children.map(fill =>{
                        if (fill.attributes.name == 'fill') fillColor = fill.value 
                        if (fill.attributes.name == 'fill-opacity') fillOpacity = fill.value  
                    })
                // add bordas dos shapes de poligono e linha
                }else if (symbolizer.name == 'sld:Stroke'){  
                    symbolizer.children.map(fill =>{
                        if (fill.attributes.name == 'stroke') StrokeColor = fill.value  
                        if (fill.attributes.name == 'stroke-width') StrokeWidth = fill.value  
                        if (fill.attributes.name == 'stroke-opacity') StrokeOpacity = fill.value  
                    })
                }

            })

            const LegendasConfig = {
                LegendaArquivo: this.styles.name,
                Title: this.Rules.Title[i],
                FillColor: fillColor || StrokeColor,
                fillOpacity: fillOpacity ?? null,
                sizePoint: sizePoint ?? null,
                StrokeWidth: StrokeWidth ?? null,
                StrokeColor: StrokeColor ?? null,
                StrokeOpacity: StrokeOpacity ?? null
            }
            this.styles.arryLegendas.push(LegendasConfig)
    
        }
        
        console.log('Finalizando a coleta das legendas do SLD');
        return this.styles.arryLegendas;       
    }

    Getsld(){
        var rules = this.styles.arquivoXml.getElementsByTagName('sld:Rule')
        return rules
    }


}