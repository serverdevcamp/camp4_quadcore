import React, { useState } from 'react';
import constants from '../config/constants';
import axios from 'axios'; // HTTP 클라이언트 라이브러리


// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from 'reactstrap';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

axios.defaults.baseURL = constants.apiUrl;

const validEmailRegex = RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
};

const ModalExample = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <span className="text-muted">You should check the information
        <a href="#pablo" onClick={toggle}> About Policy</a>
      </span>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalBody>
          Please check your email for verifying your account :)
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Check</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

class Register extends React.Component {
  constructor() {
    super();
    this.domain = constants.apiUrl;
    this.state = {
      name: '',
      email: '',
      password: '',
      clickSubmit: true,
      apiError: '',
      showApiError: false,
      emailDuplicated: false,
      emailClick: false,
      errors: {
        name: '',
        email: '',
        password: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let errors = this.state.errors;
    switch (name) {
      case 'name': 
        errors.name = 
          value.length < 5
            ? 'Name must be 5 characters long!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }
    this.setState({errors, [name]: value});
    console.log(this.state)
  }

  handleSubmit = (e) => {
    console.log(this.state.emailDuplicated)
    const { history } = this.props;
    this.setState({ clickSubmit: true, showApiError: false });
    e.preventDefault();
    if(validateForm(this.state.errors) && !this.state.emailDuplicated) {
      this.setState({ showLoading: true, showShortenUrl: false });
      let reqObj = {
        email: this.state.email,
        username: this.state.name,
        password: this.state.password
      };
      axios.post(`${this.domain}auth/register`, reqObj)
        .then(json => {
          console.log('응답 : \n', json);
          setTimeout(() => {
            console.log(json)
            if(json.data.success){
              console.log(json.data)
              console.log(json.data.success)
              if(history) history.push('/home');
            }
          }, 0);
        })
        .catch(error => {
          this.setState({
            showLoading: false,
            showApiError: true,
            showError: false,
            apiError: "Server Error"
          });
        });
    } else {
      this.setState({ showError: true });
    }
    alert('email 인증을 시도해주세요.')
    window.location.replace('/auth/login')
  }

  verifyEmail = (e) => {
    this.setState({ emailClick: true });
    let reqObj = {
      email: this.state.email,
    };
    axios.post("checkemail", reqObj)
        .then(json => {
          if(json.data.cnt == 1){
            this.setState({
              emailDuplicated: true,
            })
          } else {
            this.setState({
              emailDuplicated: false,
            })
          }
        })
        .catch(error => {
          //console.log(JSON.stringify(error))
          this.setState({
            showLoading: false,
            showApiError: true,
            showError: false,
            apiError: "Server Error"
          });
        });
  }

  render() {
    const {errors, emailDuplicated, emailClick, email} = this.state;
    return (
      <>
        <Col xs="7" md="7" lg="7">
          <Card className="bg-secondary shadow border-0">
            {/* <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-4">
                <small>Sign up with</small>
              </div>
              <div className="text-center">
                <Button
                  className="btn-neutral btn-icon mr-4"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader> */}
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign up with credentials</small>
              </div>
              <Form role="form">
                {errors.name.length > 0 && <div className="text-muted font-italic">
                  <small>
                    <span className="text-warning font-weight-700">{errors.name}</span>
                  </small>
                </div>}
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      type='text' 
                      name='name' 
                      placeholder="name" 
                      onChange={this.handleChange.bind(this)} 
                      noValidate 
                    />
                  </InputGroup>
                </FormGroup>
                {errors.email.length > 0 && <div className="text-muted font-italic">
                      <small>
                        <span className="text-warning font-weight-700">{errors.email}</span>
                      </small>
                    </div>}
                <Row>           
                  <Col> 
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email"
                          onChange={this.handleChange.bind(this)}
                          noValidate
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  
                  <Col xs="auto">
                      
                      <Button className="mr-1" color="light" type="button" onClick={this.verifyEmail}>
                            Duplicated
                      </Button>
                      {emailClick && email.length > 0 && errors.email.length == 0 && 
                      (emailDuplicated ? <div className="text-muted font-italic">
                          <small>
                            <span className="text-warning font-weight-700">It is Duplicated</span>
                          </small>
                      </div> 
                      : <div className="text-muted font-italic">
                          <small>
                            <span className="text-warning font-weight-700">It is Okay</span>
                          </small>
                      </div>)}
                  </Col>
                  
                </Row>
                
                {errors.password.length > 0 && <div className="text-muted font-italic">
                  <small>
                    <span className="text-warning font-weight-700">{errors.password}</span>
                  </small>
                </div>}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      onChange={this.handleChange.bind(this)}
                      noValidate
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-muted font-italic">
                  <small>
                  </small>
                </div>
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <ModalExample/>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button href='/auth/login' className="mt-4" color="primary" type="button" onClick={this.handleSubmit}>
                    Create account
                  </Button>
                  
                </div>
              </Form>
            </CardBody>
          </Card>
        
        </Col>
        
      </>
    );
  }
}

export default Register;
