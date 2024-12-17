import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove } from './duck'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    createFileLink = (file) => {
        return <a target='_blank' href={process.env.REACT_APP_API_HOST+'/../files/shapefiles/'+file}>{file}</a>
    }

    render() {
        return (
            <Table body={this.props.list} actions={{update: this.props.showUpdate, remove: this.props.remove}}
            attributes={{name: 'Nome', theme: 'Tema', file: {title:'Arquivo', callback: this.createFileLink}}} />
            
        )
    }
}

const mapStateToProps = state => ({ list: state.shape.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)