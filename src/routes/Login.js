import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Header from '../components/Header';

function Login() {
  const navigate = useNavigate();

  function loginConfirm() {
    navigate(`/`);
    return;
  }

  return<>
    <Header />
    <Section>
      <h1>Login</h1>
      <LoginForm>
        <InputBox>
          <label htmlFor="id">아이디</label>
          <LoginInput name='id' type='text' />
        </InputBox>
        <InputBox>
          <label htmlFor="password">비밀번호</label>
          <LoginInput name='password' type='password' />
        </InputBox>
        <SubmitButton type="submit" onClick={loginConfirm} >로그인</SubmitButton>
        <SignUpSpan onClick={() => {navigate('/signUp');}}>회원가입</SignUpSpan>
      </LoginForm>
    </Section>
  </>;  
}

const Section = styled.section`
  margin-top: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
`;

const LoginForm = styled.form`
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  font-size: 13px;
`;

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: left;
`;

const LoginInput = styled.input`
  type: ${props => props.type};
  name: ${props => props.name};
  id: ${props => props.name};
  required: true;

  width: 100%;
  height: 3rem;
  border: 1px solid #888888;
  border-radius: 0.25rem;

  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 3rem;
  background-color: #4D74D9;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 16px;
`;

const SignUpSpan = styled.button`
  border: none;
  background-color: transparent;
`;

export default Login;