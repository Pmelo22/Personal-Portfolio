import React, { Component } from 'react';
import Grid from '../layout/grid';
import InputMask from 'react-input-mask';
import { connect } from 'react-redux';
import _ from 'lodash';

class LabelAndInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                message: null,
                flag: false
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (!this.state.error.flag) {
            if (this.props.error && Object.keys(this.props.error).length > 0 && this.props.input && this.props.error[this.props.input.name]) {
                this.setState({
                    error: {
                        message: this.props.error[this.props.input.name][0],
                        flag: true
                    }
                });
            }
        } else {
            if (Object.keys(this.props.error).length === 0 || (this.props.input && this.props.error[this.props.input.name] === undefined)) {
                this.setState({
                    error: {
                        message: null,
                        flag: false
                    }
                });
            }
        }
    }

    hasPermission = (permission, method) => {
        const permissionToMethods = [
            {},                              // 0
            { read: true },                  // 1
            { insert: true },                // 2
            { read: true, insert: true },    // 3
            { update: true },                // 4
            { read: true, update: true },    // 5
            { insert: true, update: true },  // 6
            { read: true, insert: true, update: true }, // 7
            { delete: true },                // 8
            { read: true, delete: true },    // 9
            { insert: true, delete: true },  // 10
            { read: true, insert: true, delete: true }, // 11
            { update: true, delete: true },  // 12
            { read: true, update: true, delete: true }, // 13
            { insert: true, update: true, delete: true }, // 14
            { read: true, insert: true, update: true, delete: true } // 15
        ];
    
        if (permission < 0 || permission > 15) return false;
    
        if (Array.isArray(method)) {
            return method.some(val => permissionToMethods[permission][val]);
        } else {
            return permissionToMethods[permission][method] || false;
        }
    };    

    getValidation = (scope) => {
        let rules = [];
        if (this.props.scopes[scope]?.rules?.[this.props.input.name]) {
            const splitRules = this.props.scopes[scope].rules[this.props.input.name].split('|');
            splitRules.forEach(rule => {
                if (rule.includes(':')) {
                    const [key, value] = rule.split(':');
                    rules[key] = value;
                } else {
                    rules[rule] = true;
                }
            });
        }
        return rules;
    };

    render() {
        const formName = this.props.meta?.form || null;
        let scope = '';
        let permission = 0;
        let rules = [];
        let action = null;

        if (formName) {
            scope = _.findKey(this.props.scopes, ['entity', _.upperFirst(formName.split('Form')[0])]);
            permission = this.props.scopes[scope]?.actions?.[this.props.input.name] || 0;
            rules = this.getValidation(scope);
            action = this.props.forms[formName]?.values?.id ? 'update' : 'insert';
        }

        return (
            <>
                {(this.props.readOnly === false || this.hasPermission(permission, 'read') || this.props.forceToShow) && (
                    <Grid cols={this.props.cols} {...this.props.grid}>
                        <div className="form-group" style={this.props.style}>
                            {this.props.label && <label htmlFor={this.props.name}>{this.props.label}</label>}
                            {this.props.mask ? (
                                <InputMask
                                    mask={this.props.mask}
                                    name={this.props.name}
                                    {...this.props.input}
                                    value={this.props.val || this.props.input?.value || ''}
                                    className={`form-control ${this.state.error.flag ? 'is-invalid' : ''}`}
                                    placeholder={this.props.placeholder}
                                    disabled={this.props.readOnly !== false ? this.props.readOnly || !this.hasPermission(permission, action) : false}
                                    type={this.props.type}
                                    style={this.props.type === 'checkbox' ? { width: '40px' } : {}}
                                    maxLength={this.props.maxLength}
                                    min={this.props.type === 'number' ? this.props.min : undefined}
                                    max={this.props.type === 'number' ? this.props.max : undefined}
                                    onInput={this.props.onInput}
                                    required={rules['required'] || false}
                                    id={this.props.id}
                                />
                            ) : (
                                <input
                                    name={this.props.name}
                                    {...this.props.input}
                                    value={this.props.val || this.props.input?.value || ''}
                                    className={`form-control ${this.state.error.flag ? 'is-invalid' : ''}`}
                                    placeholder={this.props.placeholder}
                                    disabled={this.props.readOnly !== false ? this.props.readOnly || !this.hasPermission(permission, action) : false}
                                    type={this.props.type}
                                    style={this.props.type === 'checkbox' ? { width: '40px' } : {}}
                                    maxLength={this.props.maxLength}
                                    min={this.props.type === 'number' ? this.props.min : undefined}
                                    max={this.props.type === 'number' ? this.props.max : undefined}
                                    onInput={this.props.onInput}
                                    required={rules['required'] || false}
                                    id={this.props.id}
                                />
                            )}
                            <div className="invalid-feedback">
                                {this.state.error.flag && this.props.input?.name ? (
                                    this.props.input.name.includes('_') ?
                                    this.state.error.message.replace(new RegExp(this.props.input.name.replace(/_/g, ' '), 'i'), this.props.label) :
                                    this.state.error.message.replace(this.props.input.name, this.props.label)
                                ) : (
                                    "Valor inválido informado"
                                )}
                            </div>
                        </div>
                    </Grid>
                )}
            </>
        );
    }
}

const mapStateToProps = state => ({
    scopes: state.auth.profile.scopes,
    forms: state.form
});

export default connect(mapStateToProps, null)(LabelAndInput);
