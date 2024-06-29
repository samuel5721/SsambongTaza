import styled from 'styled-components';

const SizedButton = styled.button` 
  width: 17rem;
  height: 4.5rem;
  color: ${props => props.isElevated ? 'white' : '#272727'};
  background-color: ${props => props.isElevated ? '#3347F7' : 'white'};
  border: ${props => props.isElevated ? 'none' : '1px solid #8f8f8f'};
  border-radius: 20px;
  font-size: 24px;
  font-family: 'NanumGothic', sans-serif;
  font-weight: 400;
  font-family: 'NanumGothic', sans-serif;
`;

export { SizedButton };