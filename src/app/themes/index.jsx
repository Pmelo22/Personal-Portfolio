import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Form from './Form'
import { getList, showContent, update, init, create } from './duck'

class Theme extends Component {

    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    render() {
        return (
            <div>
                <ContentHeader title='Temas' small='Gerenciar'
                    createMethod={this.props.show == 'list' ? () => this.props.showContent('form') : null } />
                <Content>
                    <If test={this.props.show === 'list'}>
                        <List />
                    </If>
                    <If test={this.props.show === 'form'}>
                        <Form onSubmit={this.props.isEdit ? this.props.update : this.props.create}
                            submitLabel='Salvar' submitClass='primary' />
                    </If>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.theme.show,
    isEdit: state.form.themeForm && state.form.themeForm.initial && state.form.themeForm.initial.id > 0
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, showContent, update, init, create
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Theme)