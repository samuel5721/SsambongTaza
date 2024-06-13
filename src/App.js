import React from 'react';
import styled from 'styled-components';
import logo from './asset/image/logo.png';
import mainImage from './asset/image/mainImage.jpg';

function App() {
  return<>
    <Header>
      <LeftMenu>
        <Logo>
          <img src={logo} alt='logo' width={125} />
        </Logo>
        <MenuOption>연습타자</MenuOption>
        <MenuOption>긴글타자</MenuOption>
        <MenuOption>타임어택</MenuOption>
        <MenuOption>글마당</MenuOption>
      </LeftMenu>
      <RightMenu>
        <MenuSmallOption>로그인</MenuSmallOption>
        <MenuSmallOption>회원가입</MenuSmallOption>
      </RightMenu>
    </Header>
    <section>
      <MainImage>
        <img src={mainImage} alt='mainImage' width='100%' />
      </MainImage>
      <MainArticle>
        <TopTitle>오늘의 타자연습</TopTitle>
        <Title>가장 귀여운 동물, 북극여우</Title>
        <Contents>북극여우는 매력적인 북극 지역의 아이코닉한 동물 중 하나입니다. 과학적으로는 "북극여우" 또는 "폴라여우"로 알려져 있으며, 라틴어 명칭은 Vulpes lagopus입니다. 이들은 주로 북극 지방에 서식하며, 극지방의 극한 환경에서 살아남기 위해 특별히 적응되어 있습니...</Contents>
        <MainButtonForm>
          <MainButton>시작하기</MainButton>
          <MainButton>상세보기</MainButton>
        </MainButtonForm>
      </MainArticle>
      
      <Box></Box>
    </section>
  </>;
}

const Header = styled.header`
  width: 100%;
  height: 5rem;
  display: flex;
  padding : 1rem 3rem;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  background: linear-gradient(#F3F3F3EE, #F3F3F380);
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
`;

const MenuOption = styled.div`
  margin-left: 4rem;
  font-size: 17px;
`;

const MenuSmallOption = styled.div`
  margin-right: 1rem;
  font-size: 13px;
`;

const MainImage = styled.div`
  width: 100%;
  display: flex;
  position: fixed;
  top: 0;
  z-index: -1;
`;

const MainArticle = styled.div`
  width: 100%;
  margin-top: 25rem;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: linear-gradient(#F3F3F3EE, #F3F3F380);
`;

const TopTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 35px;
  font-weight: 800;
`;

const Contents = styled.p`
  width: 70%;
  font-size: 20px;
  font-weight: 500;
`;

const MainButtonForm = styled.div` 
  width: 100%;
  padding: 0 5rem;
  display: flex;
  justify-content: right;
  gap: 1.5rem;
`;

const MainButton = styled.button`
  width: 10rem;
  height: 2.5rem;
  margin-top: 1rem;
  background: #4D74D9;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;

const Box = styled.div`
  width: 100%;
  height: 50rem;
  background: white;
`;

export default App;