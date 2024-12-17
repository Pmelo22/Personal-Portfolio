import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openCloseSideBar, openCloseMiniSideBar, getNotifications } from './templateActions'

class Header extends Component {

  handleUserProfileClick = () => {
    this.props.history.push('User-Area')
  }

  render() 
  
  {
    return (
      <nav className={"main-header navbar navbar-expand navbar-" + (process.env.REACT_APP_THEME || 'green') + " navbar-dark"}>
        <ul className="navbar-nav" style={{ paddingLeft: '40px' }}>
          <li className="nav-item">
            <a href="#!" className="nav-link nav-link--bg" onClick={(e) => this.props.openCloseSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
            <a href="#!" className="nav-link nav-link--sm" onClick={(e) => this.props.openCloseMiniSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto" style={{ paddingRight: '40px' }}>
          <li className="nav-item">
            <Link to="/edit-user" className="nav-link">
              <i className="fas fa-user"></i> Área do Usuário
            </Link>
          </li>
          {(this.props.notifications && this.props.notifications.length > 0) && this.renderNotifications(this.props.notifications)}
        </ul>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  notifications: state.template.notifications || []
})
const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar, openCloseMiniSideBar, getNotifications }, dispatch)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))