import React, { Component } from 'react';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { withRouter } from "react-router-dom";
import ContentHeader from '../../common/template/ContentHeader';
import Content from '../../common/template/Content';
import './UserIndex.css';

class EditUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: { name: '', email: '', celphone: '', login: '', document: '' },
            passwordData: { password: '', new_password: '', confirm_password: '' },
            editableFields: { name: false, email: false, login: false },
            showPasswords: { password: false, new_password: false, confirm_password: false }
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_HOST}/auth/user`)
            .then(resp => {
                console.log('Dados do usuário:', resp.data);
                this.setState({ user: resp.data });
            })
            .catch(this.handleError);
    }

    toggleEditable = (field) => {
        this.setState((prevState) => ({
            editableFields: {
                ...prevState.editableFields,
                [field]: !prevState.editableFields[field]
            }
        }));
    };

    togglePasswordVisibility = (field) => {
        this.setState((prevState) => ({
            showPasswords: {
                ...prevState.showPasswords,
                [field]: !prevState.showPasswords[field]
            }
        }));
    };

    changeUserData = async () => {
        try {
            const { user } = this.state;
            const resp = await axios.post(
                `${process.env.REACT_APP_API_HOST}/auth/change-user-data`,
                { name: user.name, email: user.email, login: user.login }
            );
            toastr.success('Sucesso', resp.data.message);
            this.props.history.push("/dashboard");
        } catch (e) {
            this.handleError(e);
        }
    };

    changePassword = () => {
        const { password, new_password, confirm_password } = this.state.passwordData;

        if (new_password !== confirm_password) {
            toastr.error('Erro', 'A confirmação da nova senha não coincide.');
            return;
        }

        axios.post(`${process.env.REACT_APP_API_HOST}/auth/change-password`,
            { password, new_password })
            .then(resp => {
                toastr.success('Sucesso', resp.data.message);
                this.props.history.push("/dashboard");
            })
            .catch(this.handleError);
    };

    handleError = (e) => {
        if (!e.response) {
            toastr.error('Erro', 'Desconhecido :-/');
            console.log(e);
        } else if (!e.response.data) {
            toastr.error('Erro', e.response.message);
        } else if (e.response.data.errors) {
            Object.entries(e.response.data.errors).forEach(
                ([key, error]) => toastr.error(key, error[0])
            );
        } else if (e.response.data) {
            toastr.error('Erro', e.response.data.message);
        }
    };

    handleChange = (field, value) => {
        this.setState((prevState) => ({
            passwordData: {
                ...prevState.passwordData,
                [field]: value
            }
        }));
    };

    render() {
        const { user, passwordData, editableFields, showPasswords } = this.state;

        return (
            <div>
                <ContentHeader title="Meus dados" small="Mantenha-os atualizados" />
                <Content>
                    {/* Dados do Usuário */}
                    <form className="card-container">
                        <div className="box-body row">
                            {/* Nome */}
                            <div className="col-md-4 field-container">
                                <div className="label-container">
                                    <label htmlFor="name">Nome</label>
                                    <i
                                        className="fa fa-edit edit-icon"
                                        onClick={() => this.toggleEditable('name')}
                                        title={editableFields.name ? "Bloquear edição" : "Liberar edição"}
                                    ></i>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Informe seu nome"
                                    value={user.name}
                                    onChange={(e) => this.setState({ user: { ...user, name: e.target.value } })}
                                    readOnly={!editableFields.name}
                                    className="form-control"
                                />
                            </div>

                            {/* E-mail */}
                            <div className="col-md-4 field-container">
                                <div className="label-container">
                                    <label htmlFor="email">E-mail</label>
                                    <i
                                        className="fa fa-edit edit-icon"
                                        onClick={() => this.toggleEditable('email')}
                                        title={editableFields.email ? "Bloquear edição" : "Liberar edição"}
                                    ></i>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Informe seu e-mail"
                                    value={user.email}
                                    onChange={(e) => this.setState({ user: { ...user, email: e.target.value } })}
                                    readOnly={!editableFields.email}
                                    className="form-control"
                                />
                            </div>

                            {/* Login */}
                            <div className="col-md-4 field-container">
                                <div className="label-container">
                                    <label htmlFor="login">Login</label>
                                    <i
                                        className="fa fa-edit edit-icon"
                                        onClick={() => this.toggleEditable('login')}
                                        title={editableFields.login ? "Bloquear edição" : "Liberar edição"}
                                    ></i>
                                </div>
                                <input
                                    type="text"
                                    name="login"
                                    placeholder="Login necessário para conectar"
                                    value={user.login}
                                    onChange={(e) => this.setState({ user: { ...user, login: e.target.value } })}
                                    readOnly={!editableFields.login}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="box-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.changeUserData}
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                className="btn btn-default"
                                onClick={() => this.props.history.goBack()}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>

                    {/* Alterar Senha */}
                    <form className="card-container">
                        <h3>Alterar senha</h3>
                        <div className="box-body row">
                            {/* Senha Atual */}
                            <div className="col-md-6 password-container">
                                <label htmlFor="password">Senha Atual</label>
                                <input
                                    type={showPasswords.password ? "text" : "password"}
                                    name="password"
                                    placeholder="************"
                                    value={passwordData.password}
                                    onChange={(e) => this.handleChange("password", e.target.value)}
                                    className="form-control"
                                />
                                <i
                                    className={`fa ${showPasswords.password ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                    onClick={() => this.togglePasswordVisibility("password")}
                                ></i>
                            </div>

                            {/* Nova Senha */}
                            <div className="col-md-6 password-container">
                                <label htmlFor="new_password">Nova Senha</label>
                                <input
                                    type={showPasswords.new_password ? "text" : "password"}
                                    name="new_password"
                                    placeholder="************"
                                    value={passwordData.new_password}
                                    onChange={(e) => this.handleChange("new_password", e.target.value)}
                                    className="form-control"
                                />
                                <i
                                    className={`fa ${showPasswords.new_password ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                    onClick={() => this.togglePasswordVisibility("new_password")}
                                ></i>
                            </div>

                            {/* Confirmação da Nova Senha */}
                            <div className="col-md-6 password-container" style={{ marginTop: "20px" }}>
                                <label htmlFor="confirm_password">Confirmação da Nova Senha</label>
                                <input
                                    type={showPasswords.confirm_password ? "text" : "password"}
                                    name="confirm_password"
                                    placeholder="************"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => this.handleChange("confirm_password", e.target.value)}
                                    className="form-control"
                                />
                                <i
                                    className={`fa ${showPasswords.confirm_password ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                    onClick={() => this.togglePasswordVisibility("confirm_password")}
                                ></i>
                            </div>
                        </div>

                        <div className="box-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.changePassword}
                            >
                                Alterar Senha
                            </button>
                        </div>
                    </form>

                </Content>
            </div>
        );
    }
}

export default withRouter(EditUser);
