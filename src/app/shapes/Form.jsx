import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import {readString} from 'react-papaparse'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import {  update, init, create } from './duck'
import LabelAndSelect from '../../common/form/LabelAndSelect'
// import Appinit from '../../automapgeo/AppInit'
import MainApp from '../automapgeo/app/containers/app'
// ----------- importar dependencias --- arrochar 


class Form extends Component {
    constructor(props) {
        super(props)

        this.state = {file: null, files: null, generalStatuses: [], csv: ''}

        this.onSubmit = this.onSubmit.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.getBase64 = this.getBase64.bind(this)
    }

    componentWillMount() {
        this.getGeneralStatuses()
    }


    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/themes`)
        .then(resp => {
            this.setState({ generalStatuses: resp.data.data })
        })
        .catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }

    geoJSONN = null

    // teste de envio de informações entre componentes 
    SubmitValue = (e) => {
        this.props.handleData(this.state.TextBoxValue)
     }
       
    onChange=(e)=>{
        this.setState({TextBoxValue: e.target.value})
    }
      
    // teste de envio   

    onSubmit(shape) {

        shape.file = this.state.file
        shape.bbox = this.geoJSONN
        if(this.state.csv != '') shape.csv = JSON.stringify(this.state.csv)
        // console.log(this.geoJSONN)
        if (shape.id) {
            if(shape.file) toastr.warning('Atenção', 'Não é permitido atualizar o arquivo do shape')
            else this.props.update(shape)
        } else {
            this.props.create(shape)
        }
    }

    getBase64 = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        var self = this
        reader.onload = function () {
            self.setState({ file: file.name + 'extension' + reader.result})
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            self.setState({ file: null })
        };
    }

    onChangeHandler = event => {
        this.getBase64(event.target.files[0])
        this.setState({files: event.target.files })
        event.target.nextElementSibling.innerText = event.target.files[0].name
    }

    onChangeUploadFileZip = event => {
        //this.getBase64(event.target.files[0])
        event.target.nextElementSibling.innerText = event
    }

    createFileLink = (file) => {
        return <a target='_blank' href={process.env.REACT_APP_API_HOST+'/../files/'+file}>{file}</a>
    }

    onDropMap = (files, geoJSON) => {
        // guarda o arquivo binário em base64, deixando-o pronto para enviar à API
        this.getBase64(files[0])
        document.getElementById('customFile384563x').nextElementSibling.innerText = files[0].name

        // Processando o GeoJSON obtido
        this.setState(geoJSON)
        this.geoJSONN = geoJSON


       // console.log('estou aqui verficando o GeoJson do Form')
       // console.log('GEOJSON', geoJSON)
    }

    onChangeHandlerSheets = event => {
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);

        let self = this
        let extraData = []
        reader.onload = function () {

            let lines = readString(this.result)

            if(lines.errors.length > 0) {
                toastr.error('Erro', 'O arquivo selecionado não foi lido corretamente. Por favor, tente novamente!')
            } else {
                lines = lines.data
            }

            for(var line = 1; line < lines.length-1; line++) {
                let lineObj = {}

                for(var i = 0; i < lines[line].length; i++) {
                    lineObj[lines[0][i]] = lines[line][i]
                }

                extraData.push(lineObj)
            }

            self.setState({ csv: extraData})
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
            self.setState({ csv: '' })
        };
    }

    render() {

        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Adicionar Shape</h3>
                    </div>
                    <div className='card-body'>
                    <Row>
                            <Field name='theme_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Tema' cols='12 2' placeholder=' - Selecione - ' 
                                options={this.state.generalStatuses} error={this.props.errors} />
                            <Field name='name' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Indicador' cols='12 4' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='is_socioeconomics' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='É socioeconomia?' cols='12 2' placeholder=' - Selecione - ' 
                                options={[{id:1, name:'SIM'}, {id:2, name:'NÃO'}]} error={this.props.errors} />
                            <Field name='source' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Fonte' cols='12 4' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='scale' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='Escala' cols='12 3' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='projection' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='Projeção' cols='12 2' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='coor_system' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='Sistema de coordenadas' cols='12 3' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='datum_horizontal' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='datum_horizontal' cols='12 2' placeholder='Informe o título do shape' error={this.props.errors} />
                            <Field name='meridian_central' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='meridian_central' cols='12 2' placeholder='Informe o título do shape' error={this.props.errors} />
                            <div className="col-xs-12 col-sm-6">
                                <label>Selecione o arquivo do shape</label>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile384563x" onChange={this.onChangeHandler}/>                                   
                                    <label className="custom-file-label" htmlFor="customFile384563x">Procurar arquivo...</label>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <label>Selecione o arquivo de planilha</label>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile353930x" onChange={this.onChangeHandlerSheets}/>                                   
                                    <label className="custom-file-label" htmlFor="customFile384563x">Procurar arquivo...</label>
                                </div>
                            </div>
                            
                        </Row>
                        <Row>
                            <MainApp files={this.state.files} onDrop={this.onDropMap} exportGeoJSON={json => null}></MainApp>
                        </Row>
                    </div>
                    <div className='card-footer'>
                        <button type='submit' className={`btn btn-${this.props.submitClass}`}>{this.props.submitLabel}</button>
                        <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                    </div>
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'shapeForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('shapeForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    file: selector(state, 'file'),
    bbox: selector(state, 'bbox'),
    source: selector(state, 'source'),
    scale: selector(state, 'scale'),
    is_socioeconomics: selector(state, 'is_socioeconomics'),
    projection: selector(state, 'projection'),
    coor_system: selector(state, 'coor_system'),
    datum_horizontal: selector(state, 'datum_horizontal'),
    meridian_central: selector(state, 'meridian_central'),
    errors: state.shape.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({  update, init, create }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)