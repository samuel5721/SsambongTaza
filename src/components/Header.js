import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../asset/image/logo.png';

function Header() {
  const navigate = useNavigate();

  return <HeaderBox>
      <LeftMenu>
        <Logo onClick={() => {navigate(`/`);}}>
          <img src={logo} alt='logo' width={125} />
        </Logo>
        <MenuOption onClick={() => { alert('참고 : 긴글타자 기능만 구현하였습니다. 긴글타자연습으로 이동합니다.'); navigate(`/storage`);}}>연습타자</MenuOption>
        <MenuOption onClick={() => {navigate(`/storage`);}}>긴글타자</MenuOption>
        <MenuOption onClick={() => { alert('참고 : 긴글타자 기능만 구현하였습니다. 긴글타자연습으로 이동합니다.'); navigate(`/storage`);}}>타임어택</MenuOption>
        <MenuOption onClick={() => { alert('글마당 기능은 아직 미구현입니다.'); }}>글마당</MenuOption>
      </LeftMenu>
      <RightMenu>
        <MenuSmallOption onClick={() => {navigate(`/login`);}}>로그인</MenuSmallOption>
        <MenuSmallOption onClick={() => {navigate(`/signUp`);}}>회원가입</MenuSmallOption>
      </RightMenu>
    </HeaderBox>
}

const HeaderBox = styled.header`
  width: 100%;
  height: 5rem;
  display: flex;
  padding : 1rem 3rem;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  background: linear-gradient(#F3F3F3EE, #F3F3F380);
  user-select: none;
`;

const LeftMenu = styled.div`
  display: flex;
  float: left;
`;

const RightMenu = styled.div`
  display: flex;
  float: right;
`;

const Logo = styled.div`
  width: auto;
  height: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MenuOption = styled.button`
  background: none;
  border: none;
  margin-left: 4rem;
  font-size: 17px;
`;

const MenuSmallOption = styled.button`
  background: none;
  border: none;
  margin-right: 1rem;
  font-size: 13px;
`;

export default Header;