import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";

import Header from '../components/Header';
import { Section } from "../module";

function TypingScreen() {
  const inputRefs = useRef([]);
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();

  const [article, setArticle] = useState({});
  const [passages, setPassages] = useState([]);
  const [currentLineGroup, setcurrentLineGroup] = useState(0);
  const [currentLine, setcurrentLine] = useState(0);
  const [line, setLine] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    canvasRef.current = document.createElement('canvas');
  }, []);

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [labelRef.current]);

  const getTextWidth = (text, font) => {
    const context = canvasRef.current.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const splitString = (input, labelWidth, font) => {
    let result = [];
    let currentString = '';
    
    // Split the input by newline characters first
    const lines = input.split('ⓝ');
  
    lines.forEach(line => {
      const words = line.split(' ');
  
      words.forEach(word => {
        const testString = currentString + (currentString ? ' ' : '') + word;
        const width = getTextWidth(testString, font);
  
        if (width > labelWidth) {
          if (currentString) {
            result.push(currentString);
          }
          currentString = word;
        } else {
          currentString = testString;
        }
      });
  
      if (currentString) {
        result.push(currentString);
        currentString = '';
      }
  
      // Add an empty string to denote the newline
      result.push('');
    });
  
    if (currentString) {
      result.push(currentString);
    }

    result = result.filter(item => item !== "");
  
    setLine(result.length);
  
    while(result.length % 4 !== 0) {
      result.push('\0');
    }
  
    return result;
  };
  

  const findArticle = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log('No such article!');
        return;
      }

      console.log('Article data:', docSnap.data());
      setArticle(docSnap.data());

      const font = '21px D2Coding, monospace';
      setPassages(splitString(docSnap.data().body, labelWidth, font));

    } catch (error) {
      console.error("Error getting article: ", error);
    }
  };

  useEffect(() => {
    if (labelWidth > 0) {
      findArticle();
    }
  }, [labelWidth]);

  const handleNext = () => {
    setcurrentLineGroup(prevLine => prevLine + 4);
    setTimeout(() => {
      inputRefs.current.forEach(input => {
        if (input) {
          input.value = '';
        }
      });
      document.querySelectorAll('span').forEach(span => {
        span.style.color = 'black';
      });
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 0);
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const passage = passages[currentLineGroup + index];
  
    const spanElements = document.querySelectorAll(`#char-${currentLineGroup + index} span`);
    spanElements.forEach((span, spanIndex) => {
      if (spanIndex < value.length) {
        span.style.color = value[spanIndex] === span.textContent ? 'blue' : 'red';
      } else {
        span.style.color = 'black';
      }
    });
  
    if (value.length >= passages[currentLineGroup + index].length) {
      if (e.key === ' ' || e.key === 'Enter' || value.length > passages[currentLineGroup + index].length) {
        const nextInput = inputRefs.current[index + 1];
        setcurrentLine(prevLine => prevLine + 1);
        if (currentLine + 1 >= line) {
          navigate('/');
          return;
        }
        if (nextInput) {
          nextInput.focus();
        } else {
          handleNext();
        }
      }
    }
  };

  const handleBodyClick = () => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const preventDefault = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);
  
  return (
    <>
      <Header />
      <Section scrollbar={false}>
        <HeadBar>
          <ProgressBox>
            <ProgressText>{currentLine}/{line}</ProgressText>
            <ProgressBar><ProgressBarFill widthProportion={(currentLine / line) * 100} /></ProgressBar>
          </ProgressBox>
          <hr />
          <StatBox>
            <Stat>
              <StatText>현재타자</StatText>
              <StatValue>{100}</StatValue>
            </Stat>
            <Stat>
              <StatText>평균타자</StatText>
              <StatValue>{100}</StatValue>
            </Stat>
            <Stat>
              <StatText>정확도</StatText>
              <StatValue>{Math.round(accuracy)}%</StatValue>
            </Stat>
          </StatBox>
        </HeadBar>
        <TypingBox>
          {labelWidth === 0 && (
            <TypingContainer>
              <TypingLabel ref={labelRef}>Calculating width...</TypingLabel>
            </TypingContainer>
          )}
          {labelWidth > 0 && passages.slice(currentLineGroup, currentLineGroup + 4).map((passage, passageIndex) => (
            <TypingContainer key={passageIndex}>
              <TypingLabel id={`char-${currentLineGroup + passageIndex}`}>
                {passage.split('').map((char, charIndex) => (
                  <CharacterSpan key={charIndex} isMatch={null}>
                    {char}
                  </CharacterSpan>
                ))}
              </TypingLabel>
              <TypingInput
                ref={el => inputRefs.current[passageIndex] = el}
                onChange={(e) => handleInputChange(e, passageIndex)} // onKeyUp을 onChange로 변경
                onMouseDown={preventDefault} // 클릭을 통한 포커싱 해제 방지
                onSelect={preventDefault} // 글자 선택 방지
                onCopy={preventDefault} // 복사 방지
                onPaste={preventDefault} // 붙여넣기 방지
              />
            </TypingContainer>
          ))}
          <NextPassage>&gt;&gt; {passages[currentLineGroup + 4]}</NextPassage>
        </TypingBox>
      </Section>
    </>
  );
}  

const HeadBar = styled.div`
  width: 100%;
  height: 9rem;
  // border: 1px solid black;
  margin-bottom: 2rem;
`;

const TypingBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProgressBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.div`
  width: 10rem;
  text-align: center;
  margin-bottom: 0.5rem;

  font-size: 40px;
  font-family: 'Namum Gothic', sans-serif;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 1rem;
  background-color: #d9d9d9;
  border-radius: 10px;
`;

const ProgressBarFill = styled.div`
  width: ${props => props.widthProportion}%;
  height: 1rem;
  background-color: #3347f7;
  border-radius: 10px;
`;

const StatBox = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const StatText = styled.div`
  padding-bottom: 0.5rem;
  font-size: 20px;
`;

const StatValue = styled.div`
  width: 6rem;
  font-size: 50px;
`;

const TypingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TypingLabel = styled.div`
  width: auto; /* 라벨의 실제 너비로 설정되지 않도록 auto로 설정 */
  margin-left: 0.2rem;
`;

const CharacterSpan = styled.span`
  font-size: 20px;
  font-family: 'D2Coding', monospace;
  display: inline-block;
  white-space: pre;
  color: ${props => props.isMatch === null ? 'black' : props.isMatch ? 'blue' : 'red'};
`;

const TypingInput = styled.input`
  width: 100%;
  height: 3rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  font-size: 20px;
  font-family: 'D2Coding', monospace;
  caret-color: transparent; /* 커서를 투명하게 만들어 글자 선택이 안 보이게 설정 */
`;

const NextPassage = styled.div`
  width: 100%;
  text-align: right;
  margin-top: -1rem;
  color: #8f8f8f;
  font-size: 16px;
`;

export default TypingScreen;
