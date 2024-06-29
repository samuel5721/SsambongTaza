import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PropTypes from 'prop-types'; 

import Header from '../components/Header';
import { Section } from "../components/Section";
import { SizedButton } from "../components/SizedButton";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, averageCPM, accuracy, duration } = location.state;

  return (
    <>
    <Header />
    <Section>
      <HeadText>당신의 점수는...</HeadText>
      <StatBox>
        <Stat>
          <StatTitle>평균 타수</StatTitle>
          <StatValue>{Math.floor(averageCPM)}</StatValue>
        </Stat>
        <Stat>
          <StatTitle>정확도</StatTitle>
          <StatValue>{Math.floor(accuracy)}%</StatValue>
        </Stat>
        <Stat>
          <StatTitle>타자 시간</StatTitle>
          <StatValue>{duration}</StatValue>
        </Stat>
      </StatBox>
      <OptionBox>
        <SizedButton onClick={() => { navigate('/') }}>홈으로</SizedButton>
        <SizedButton onClick={() => { navigate('/storage') }}>돌아가기</SizedButton>
        <SizedButton onClick={() => { navigate(`/typing/${id}`) }} isElevated={true}>다시하기</SizedButton>
      </OptionBox>
    </Section>
    </>
  );
};

Result.propTypes = {
  id: PropTypes.number.isRequired,
  averageCPM: PropTypes.number.isRequired,
  Accuracy: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired
};

const HeadText = styled.div`
  margin-bottom: 3rem;
  font-size: 32px;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const StatTitle = styled.div`
  width: 8rem;
  margin-bottom: 1.5rem;
  font-size: 22.5px;
  font-family: 'Nanum Gothic', sans-serif;
  letter-spacing: -2px;
`;

const StatValue = styled.div`
  font-size: 80px;
`;

const OptionBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

export default Result;