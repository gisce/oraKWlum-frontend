import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/password';

const revalidator = require('revalidator');

import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Divider from 'material-ui/Divider';

import Snackbar from 'material-ui/Snackbar';

import {FormattedHTMLMessage} from 'react-intl';

//import changePassword from '../../actions/profile';


const styles = {
  dialog: {
      width: '80%',
      maxWidth: 'none',
  },
  ok: {
      color: 'green',
  },
  ko: {
      color: 'red',
  },
  withoutBullet: {
      listStyleType: "none",
  },
};

const PASSWD_MIN = 6;
const PASSWD_MAX = 80;
const validations = {
    passwd: {
        description: 'New password',
        type: 'string',
        minLength: PASSWD_MIN,
        maxLength: PASSWD_MAX,
        allowEmpty: false,
        required: true,
    },
};

function mapStateToProps(state) {
    return {
        profile: state.profile,
        statusText: state.password.statusText,
        statusType: state.password.statusType,
        status: state.password.status,
        done: state.password.done,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class PasswordStepper extends Component {
  //main checks indicators
  okCheck = <span style={styles.ok}>&#10004;</span>;
  koCheck = <span style={styles.ko}>&#10008;</span>;

  //list checks indicators
  okSubCheck = <span>&#9745;</span>;
  koSubCheck = <span>&#9744;</span>;

  state = {
    loading: false,
    finished: false,
    stepIndex: 0,
    validSize: this.koCheck,
    validPasswdCombi: this.koCheck,
    validUpper: this.koSubCheck,
    validSymbol: this.koSubCheck,
    validNumber: this.koSubCheck,
    message_open: false,
    done: this.props.done,
  };

  passwd = {
      p1: null,
      p2: null,
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
        this.setState({
            message_open: false,
            loading: false,
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 1,
            readyToNext: false,
        });
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
        this.setState({
            message_open: false,
            loading: false,
            stepIndex: stepIndex - 1,
        });
    }
  };

  validateUpper = (passwd)  => {
      if (!passwd.match(/^.*[A-Z]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one number, UPPER or a symbol",
              validUpper: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validUpper: this.okSubCheck,
      })
      return true;
  }

  validateLower = (passwd)  => {
      if (!passwd.match(/^.*[a-z]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one lower character",
              validPasswdCombi: this.koCheck,
          });
          return false;
      }
      return true;
  }

  validateNumber = (passwd)  => {
      if (!passwd.match(/^.*[0-9]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least a lower",
              validNumber: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validNumber: this.okSubCheck,
      })
      return true;
  }

  validateSymbol = (passwd)  => {
      if (!passwd.match(/^.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one number, UPPER or a symbol",
              validSymbol: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validSymbol: this.okSubCheck,
      })
      return true;
  }

  validateSame = (passwd1, passwd2)  => {
      if (passwd1 != passwd2) {
          this.setState({
              new_passwd_error_text: "New passwords do not match",
          });
          return false;
      }
      return true;
  }


  validateNewPasswd = (passwd1, passwd2) => {
      const passwd_validation = revalidator.validate({ name: passwd1}, { properties: { name: validations.passwd} } );

      //dispatch tests to upgrade indicators
      const isLower = this.validateLower(passwd1);
      const areEqual = this.validateSame(passwd1, passwd2);
      const isSymbol = this.validateSymbol(passwd1);
      const isNumber = this.validateNumber(passwd1);
      const isUpper = this.validateUpper(passwd1);

      //(UPPER or numb3r or a symbol)
      const passwdCombi = (isUpper || isNumber || isSymbol) ? true : false;

      // Indicators of check Size and Policy Accomplishment
      this.setState({
        //validate size
        validSize: (passwd_validation.valid)?
            this.okCheck
            :
            this.koCheck,
        //validate policy
        validPasswdCombi: (passwdCombi)?
            this.okCheck
            :
            this.koCheck,
        });

        // check if password is correct //retriggering tests in order ((UPPER, n1mb3r, symbol) AND same)
        if (passwd_validation.valid) {
             if (
                 (this.validateUpper(passwd1) || this.validateNumber(passwd1) || this.validateSymbol(passwd1))
                  && this.validateSame(passwd1, passwd2)) {
                this.setState({
                    new_passwd_error_text: null,
                    new_passwd_validation: true,
                    readyToNext: true,
                });
                return true;
            }
            else {
                this.setState({
                    readyToNext: false,
                });
                return false;
            }
        }
        else {
            this.setState({
              new_passwd_error_text: <FormattedHTMLMessage id="ProfileView.newpassword" defaultMessage="New password "/> + passwd_validation.errors[0].message,
              new_passwd_validation: false,
              readyToNext: false,
            });
            return false;
        }

  }

  handleChangeNewPasswd = (passwd1, passwd2) => {
      this.validateNewPasswd(passwd1, passwd2);
  };

  handleChangeNewPasswd1 = (event, new_passwd) => {
      let passwd = this.passwd;
      passwd.p1 = new_passwd;
      this.handleChangeNewPasswd(passwd.p1, passwd.p2);
  };

  handleChangeNewPasswd2 = (event, new_passwd) => {
      let passwd = this.passwd;
      passwd.p2 = new_passwd;
      this.handleChangeNewPasswd(passwd.p1, passwd.p2);
  };

  handleChangeCurrentPasswd = (event, currentPasswd) => {
      const passwd_validation = revalidator.validate({ name: currentPasswd}, { properties: { name: validations.passwd} } );

      if (passwd_validation.valid) {
          this.setState({
              readyToNext: true,
          });
          this.passwd.current = currentPasswd;
      } else {
          this.setState({
              readyToNext: false,
          });
      }
  };

  applyPasswdChange = (event) => {
      event.preventDefault()

      this.setState({
          message_open: true,
      });

      const token = this.props.token;
      this.props.changePassword(token, this.passwd.current, this.passwd.p1);
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return (
                <div>
                  <p><FormattedHTMLMessage id="ProfileView.insertpassword" defaultMessage="<b>Insert twice</b> your desired <b>new password</b>:"/></p>
                  <TextField
                      style={{marginTop: 0}}
                      floatingLabelText={<FormattedHTMLMessage id="ProfileView.yournewpassword" defaultMessage="Your new password"/>}
                      type="password"
                      onChange={this.handleChangeNewPasswd1}
                      />
                  <br/>
                  <TextField
                      style={{marginTop: 0}}
                      floatingLabelText={<FormattedHTMLMessage id="ProfileView.yournewpasswordagain" defaultMessage="Your new password again..."/>}
                      type="password"
                      onChange={this.handleChangeNewPasswd2}
                      errorText={this.state.new_passwd_error_text}
                      />

                  <p><br/><FormattedHTMLMessage id="ProfileView.passwordrules1" defaultMessage="Your new password must accomplish:"/></p>
                  <ul style={styles.withoutBullet}>
                      <li>{this.state.validSize} {<FormattedHTMLMessage id="ProfileView.passwordrules2" defaultMessage='Larger than <strong>{PASSWD_MIN-1} chars</strong> <i>[{PASSWD_MIN + " <= len(password) <= " + PASSWD_MAX}]</i>'/>}</li>
                      <li>{this.state.validPasswdCombi} {<FormattedHTMLMessage id="ProfileView.passwordrules3" defaultMessage='Assert at least one of the following:'/>}</li>
                      <ul style={styles.withoutBullet}>
                          <li>{this.state.validUpper} {<FormattedHTMLMessage id="ProfileView.passwordrules4" defaultMessage='Include an <strong>UPPER</strong> case character <i>[A-Z]</i>'/>}</li>
                          <li>{this.state.validNumber} {<FormattedHTMLMessage id="ProfileView.passwordrules5" defaultMessage='Include a <strong>n1mb3r</strong> <i>[0-9]</i>'/>}</li>
                          <li>{this.state.validSymbol} {<FormattedHTMLMessage id="ProfileView.passwordrules6" defaultMessage="Include a <strong>symbol</strong> <i>[-!$%^&*()_+|~=`{}[]:'';'<>?,./)]</i>"/>}</li>
                      </ul>
                  </ul>
                </div>
            );

        case 1:
            return (
                <div>
                    <p><FormattedHTMLMessage id="ProfileView.passwordrules7" defaultMessage='<p>Great! Now <b>insert your password</b> in the following field:</p>'/></p>
                    <p><FormattedHTMLMessage id="ProfileView.passwordrules8" defaultMessage="Your current password is needed to ensure that you're authorized to change it."/></p>
                    <TextField
                        style={{marginTop: 0}}
                        floatingLabelText={<FormattedHTMLMessage id="ProfileView.yourcurrentpassword" defaultMessage='Your current password'/>}
                        type="password"
                        onChange={this.handleChangeCurrentPasswd}
                        />
                </div>
            );
        default:
            return 'Mmmm.... that\'s embracing...';
    }
  }

  renderContent() {
    const {finished, stepIndex, readyToNext} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Change again
            </a>.
          </p>
          <p>Password change status</p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label={<FormattedHTMLMessage id="ProfileView.back" defaultMessage="Back"/>}
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 1 ? <FormattedHTMLMessage id="ProfileView.finish" defaultMessage="Finish"/> : <FormattedHTMLMessage id="ProfileView.next" defaultMessage="Next"/>}
            primary={true}
            onTouchTap={stepIndex === 1 ? this.applyPasswdChange : this.handleNext}
            disabled={!readyToNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const {statusText, closeMe, done, startChangePasswordFlow} = this.props;
    const {loading, stepIndex, message_open} = this.state;

    //Close component PasswordStepper calling parent method
    if (done) {

        setTimeout(function() {
            startChangePasswordFlow();
            closeMe();
        }, 2500);

    }

    const Notifications =
            this.props.statusText?
                <Snackbar
                  open={this.state.message_open}
                  message={this.props.statusText}
                  autoHideDuration={4000}
                  onActionTouchTap={this.undoChanges}
                  onRequestClose={this.deactivateSnack}
                />
                :
                <div></div>;

    return (

      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        {Notifications}

        <Stepper activeStep={stepIndex}>
          <Step>
              <StepLabel><FormattedHTMLMessage id="ProfileView.passwordnew" defaultMessage="New password"/></StepLabel>
          </Step>
          <Step>
              <StepLabel><FormattedHTMLMessage id="ProfileView.currentpassword" defaultMessage="Current password"/></StepLabel>
          </Step>
        </Stepper>

        {this.renderContent()}
      </div>
    );
  }
}

PasswordStepper.propTypes = {
    closeMe: PropTypes.func,
};
