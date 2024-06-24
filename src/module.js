import styled from 'styled-components';

const category = {
  PE: '시&수필',
  NO: '소설',
  NE: '뉴스',
  HO: '취미',
  LI: '인문',
  ES: '경제/사회',
  AN: '동물/자연',
  EL: '교육/학문',
  TS: '기술/과학',
  AR: '예술',
  HI: '역사',
  DO: '기록물'
};

const Section = styled.section`
  margin-top: 7rem;
  padding: 0 10rem;
  display: flex;
  flex-direction: column;
  align-items: left;
  min-height: ${props => props.scrollbar ? '100vh' : 'none'};
`;

export {category, Section};