import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';

import './auth.css';
import { login, selectProfile } from './authActions';
import Messages from '../../common/msg/Message';
import Input from '../../common/form/InputAuth';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginMode: true,
            resetHidenButton: false,
            showPassword: false,
        };
    }

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
    };
    changeLoginMode = () => {
        this.setState({ loginMode: true, resetMode: false });
    }

    changeResetMode = () => {
        this.setState({ loginMode: false, resetMode: true });
    }

    onSubmit = (values) => {
        const { login } = this.props;

        if (this.state.resetMode) {
            if (!values.login) {
                toastr.warning('Atenção', 'Necessário preencher o campo de login.');
                return;
            }

            this.setState({ resetHidenButton: true });
            login(values, 'reset');
        } else if (this.state.loginMode) {
            login(values, 'login');
        }
    }

    render() {
        const { resetMode, showPassword } = this.state;
        const { handleSubmit } = this.props;

        const loginForm = (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <Field
                    component={Input}
                    type="input"
                    name="login"
                    placeholder="Nome de Usuário"
                    icon="user"
                />
                <div>
                    <Field
                        component={Input}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Senha"
                        icon="lock"
                    />
                    <div className="show-password">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={this.togglePasswordVisibility}
                        />
                        <label htmlFor="showPassword">Show Password</label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                    {'Entrar'}
                </button>
            </form>
        );

        const selectProfile = (
            <ul className="list-group custom-list-group">
                {this.props.profiles.map((profile) => (
                    <a
                        key={profile.id}
                        href="#!"
                        className="text-center col-xs-12"
                        onClick={() => this.props.selectProfile(profile, this.props.token)}
                    >
                        <li className="list-group-item col-xs-12">
                            <b>{profile.noun}</b>
                        </li>
                    </a>
                ))}
            </ul>
        );

        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <b>Área do usuário</b>
                    </div>
                    <div className="card">
                        <div className="card-body login-card-body col-xs-12">
                            <p className="login-box-msg">
                                {this.props.profiles.length > 1
                                    ? 'Selecione um perfil'
                                    : resetMode
                                    ? 'Redefinir Senha'
                                    : 'Bem vindo!'}
                            </p>
                            {resetMode
                                ? loginForm
                                : this.props.profiles.length > 1
                                ? selectProfile
                                : loginForm}
                        </div>
                        <Messages />
                    </div>
                </div>
            </div>
        );
    }
}

Auth = reduxForm({ form: 'authForm' })(Auth);
const mapStateToProps = state => ({
    profiles: state.auth.profiles,
    profile: state.auth.profile,
    token: state.auth.token,
});
const mapDispatchToProps = dispatch => bindActionCreators({ login, selectProfile }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
