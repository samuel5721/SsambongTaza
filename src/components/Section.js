import styled from 'styled-components';

const Section = styled.section`
  margin-top: 7rem;
  padding: 0 10rem;
  display: flex;
  flex-direction: column;
  align-items: left;
  min-height: ${props => props.scrollbar ? '100vh' : 'none'};
`;

export { Section };