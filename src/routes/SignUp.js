import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Header from '../components/Header';

function SignUp() {
  const navigate = useNavigate();
  const [isEmailOverlap, setIsEmailOverlap] = useState(false);
  const [isIdOverlap, setIsIdOverlap] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const confirmEmailOverlap = (email) => {
    setIsEmailOverlap((isEmailOverlap) => true);
    return;
  }

  const confirmIdOverlap = (id) => {
    setIsIdOverlap((isIdOverlap) => true);
    return;
  }

  const confirmPasswordMatch = (password, passwordConfirm) => {
    if(password !== passwordConfirm) {
      setIsPasswordMatch((isPasswordMatch) => false);
      return;
    }
    setIsPasswordMatch((isPasswordMatch) => true);
    return;
  }

  const signUpConfirm = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const id = e.target.id.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    confirmEmailOverlap(email);
    confirmIdOverlap(id);
    confirmPasswordMatch(password, passwordConfirm);

    if(isEmailOverlap || isIdOverlap || !isPasswordMatch) {
      return;
    }

    navigate(`/`);
    return;
  }

  return<>
    <Header />
    <Section>
      <h1>Sign up</h1>
      <LoginForm onSubmit={signUpConfirm}>
        <InputBox>
          <label htmlFor="email">이메일</label>
          <LoginInput name='email' type='text' onBlur={(e) => confirmEmailOverlap(e.target.value)}/>
          {isEmailOverlap ? <Alert color='red'>이미 사용중인 이메일입니다!</Alert> : null}
        </InputBox>
        <InputBox>
          <label htmlFor="id">아이디</label>
          <LoginInput name='id' type='text' onBlur={(e) => confirmIdOverlap(e.target.value)}/>
          {isIdOverlap ? <Alert color='red'>이미 사용중인 아이디입니다!</Alert> : null}
        </InputBox>
        <InputBox>
          <label htmlFor="password">비밀번호</label>
          <LoginInput name='password' type='password'/>
        </InputBox>
        <InputBox>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <LoginInput name='passwordConfirm' type='password' onBlur={(e) => confirmPasswordMatch(e.target.form.password.value, e.target.value)}/>
          {isPasswordMatch ? null : <Alert color='red'>비밀번호가 다릅니다!</Alert>}
        </InputBox>
        <SubmitButton type="submit">회원가입</SubmitButton>
        <SignUpSpan onClick={() => {navigate('/login');}}>로그인</SignUpSpan>
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
  min-height: 100vh;
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
  align-items: flex-start;
`;

const LoginInput = styled.input`
  width: 100%;
  height: 3rem;
  border: 1px solid #888888;
  border-radius: 0.25rem;
  font-size: 16px;
`;

const Alert = styled.span`
  color: ${props => props.color};
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

export default SignUp;
