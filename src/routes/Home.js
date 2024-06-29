import React from 'react';
import styled from 'styled-components';
import mainImage from '../asset/image/mainImage.jpg';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();

  return<>
    <Header />
    <section>
      <MainImage>
        <img src={mainImage} alt='mainImage' width='100%' />
      </MainImage>
      <MainArticle>
        <TopTitle>오늘의 타자연습</TopTitle>
        <Title>가장 귀여운 동물, 북극여우</Title>
        <Contents>북극여우는 매력적인 북극 지역의 아이코닉한 동물 중 하나입니다. 과학적으로는 "북극여우" 또는 "폴라여우"로 알려져 있으며, 라틴어 명칭은 Vulpes lagopus입니다. 이들은 주로 북극 지방에 서식하며, 극지방의 극한 환경에서 살아남기 위해 특별히 적응되어 있습니...</Contents>
        <MainButtonForm>
          <MainButton onClick={() => { navigate('typing/0005') }}>시작하기</MainButton>
          <MainButton onClick={() => { alert('미완성 기능입니다.') }}>상세보기</MainButton>
        </MainButtonForm>
      </MainArticle>
      
      <Box></Box>
    </section>
  </>;
}

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
  background: linear-gradient(#F3F3F300, #F3F3F3AA);
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
  gap: 2rem;
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

export default Home;