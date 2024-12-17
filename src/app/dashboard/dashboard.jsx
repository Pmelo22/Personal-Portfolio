import React, { Component } from 'react'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import InfoBox from '../../common/layout/widget/InfoBox'
import Row from '../../common/layout/row'
import Grid from '../../common/layout/grid'

export default class Dashboard extends Component {

    render() {

        return (
            <div>
                <ContentHeader title='Dashboard' small='Estatísticas instantâneas' />
                <Content>
                    <Row>
                        <Grid cols='12 12 8' style={{ margin: 0 }} >
                            <Row>
                                <InfoBox grid={{ cols: '12 6' }}
                                    icon='fa fa-times'
                                    bg='orange'
                                    title='BOX 1 BOX 1 BOX 1 BOX 1 toma'
                                    text='Bla bla bla bla'
                                />
                                <InfoBox grid={{ cols: '12 6' }}
                                    icon='fa fa-times'
                                    bg='orange'
                                    title='BOX 2 BOX 2 BOX 2 BOX 2'
                                    text='Bla bla bla bla'
                                />
                            </Row>
                        </Grid>
                    </Row>
                </Content>
            </div>
        )
    }
}
