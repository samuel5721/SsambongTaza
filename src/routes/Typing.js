import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";

import Header from '../components/Header';
import { Section } from "../components/Section";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function TypingScreen() {
  const inputRefs = useRef([]);
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();

  const [article, setArticle] = useState({});
  const [passages, setPassages] = useState([]);
  const [currentLineGroup, setCurrentLineGroup] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [line, setLine] = useState(0);

  const [preChars, setPreChars] = useState(0);
  const [preCorrectChars, setPreCorrectChars] = useState(0);
  const [currentChars, setCurrentChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [time, setTime] = useState({startTime: Date.now(), endTime: 0});
  const [backTime, setBackTime] = useState(Date.now());
  const [averageCPM, setAverageCPM] = useState(0);
  const currentCPMs = [];
  const [currentCPM, setCurrentCPM] = useState(0);

  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  

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

      setArticle(docSnap.data());

      const font = '21px D2Coding, monospace';
      setPassages(splitString(docSnap.data().body, labelWidth, font));

    } catch (error) {
      console.error("Error getting article: ", error);
    }
  };

  const handleNext = () => {
    setCurrentLineGroup(prevLine => prevLine + 4);
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
  
    const spanElements = document.querySelectorAll(`#char-${currentLineGroup + index} span`);
    spanElements.forEach((span, spanIndex) => {
      if (spanIndex < value.length) {
        span.style.color = value[spanIndex] === span.textContent ? 'blue' : 'red';
      } else {
        span.style.color = 'black';
      }
    });

    // 정확도 계산
    const newCurrentChars = preChars + value.length;
    const newCorrectChars = preCorrectChars + Array.from(value).filter((char, charIndex) => char === passages[currentLineGroup + index][charIndex]).length;
    
    setCurrentChars(newCurrentChars);
    setCorrectChars(newCorrectChars);
  
    const accuracy = (newCorrectChars / newCurrentChars) * 100;
    setAccuracy(accuracy);

    // 현재 타자수 계산
    getCurrentCPM();

    // 다음 줄로 넘어가기
    if (value.length >= passages[currentLineGroup + index].length) {
      if (e.key === ' ' || e.key === 'Enter' || value.length > passages[currentLineGroup + index].length) {
        const newPreChars = preChars + value.length;
        const newPreCorrectChars = preCorrectChars + Array.from(value).filter((char, charIndex) => char === passages[currentLineGroup + index][charIndex]).length;
  
        setPreChars(newPreChars);
        setPreCorrectChars(newPreCorrectChars);
  
        const nextInput = inputRefs.current[index + 1];
        setCurrentLine(prevLine => prevLine + 1);
        
        // 마지막 줄일 경우 결과 페이지로 넘어가기
        if (currentLine + 1 >= line) {
          const duration = getTimeClock();
          navigate('/result', {
            state: { id, averageCPM, accuracy, duration }
          });
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

  const getTimeDuration = () => {
    if (time.endTime && time.startTime) {
        const duration = Math.floor((time.endTime - time.startTime) / 1000);
        return duration > 0 ? duration : 0;
    }
    return 0;
};
  
  const formatTwoDigitNumber = (number) => number < 10 ? '0' + number : number.toString();
  
  const getTimeClock = () => `${formatTwoDigitNumber(Math.floor(getTimeDuration() / 60))}:${formatTwoDigitNumber(getTimeDuration() % 60)}`;
  
  const getAverageCPM = () => {
    const duration = getTimeDuration() / 60;
    if (duration > 0) {
      setAverageCPM(currentChars*2.5 / duration);
    } else {
      setAverageCPM(0);
    }
    return;
  };
  
  const getCurrentCPM = () => {
    const littleDuration = (Date.now() - backTime) / 1000;
    const littleCpm = (60 / littleDuration) * 2;

    if(littleCpm > 10000) return;

    currentCPMs.push(littleCpm);
    if(currentCPMs.length > 20) {
      currentCPMs.shift();
    }

    setCurrentCPM(currentCPMs.reduce((acc, cur) => acc + cur, 0) / currentCPMs.length);
    setBackTime(Date.now());
    return;
  };
  
  useEffect(() => {
    canvasRef.current = document.createElement('canvas');
    document.body.addEventListener('click', handleBodyClick);
    setTime({ startTime: Date.now(), endTime: 0 });

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  useEffect(() => {
    if (labelWidth > 0) {
      findArticle();
    }
  }, [labelWidth]);

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [labelRef.current]);

  useInterval(() => {
    setTime(prevTime => ({ startTime: prevTime.startTime, endTime: Date.now() }));
  }, 100);

  useInterval(() => {
    getAverageCPM();
  }, 500);
  
  
  return (
    <>
      <Header />
      <Section scrollbar={false}>
        <HeadBar>
          <ProgressBox>
            <ProgressText>{currentLine+1}/{line}</ProgressText>
            <ProgressBar><ProgressBarFill widthProportion={(currentLine / line) * 100} /></ProgressBar>
          </ProgressBox>
          <hr />
          <ValuesBox>
            <StatBox>
              <Stat>
                <StatText>현재타자</StatText>
                <StatValue>{Math.floor(currentCPM)}</StatValue>
              </Stat>
              <Stat>
                <StatText>평균타자</StatText>
                <StatValue>{Math.floor(averageCPM)}</StatValue>
              </Stat>
              <Stat>
                <StatText>정확도</StatText>
                <StatValue>{Math.round(accuracy)}%</StatValue>
              </Stat>
            </StatBox>
            <TimeBox>
              <TimeText>{getTimeClock()}</TimeText>
            </TimeBox>
          </ValuesBox>
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
                autoFocus={passageIndex === 0}
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

const ValuesBox = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatBox = styled.div`
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

const TimeBox = styled.div`
  width: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  border-radius: 1rem;
`;

const TimeText = styled.div`
  color: white;
  font-size: 40px;
  font-weight: 300;
  font-family: 'Namun Gothic Coding', monospace;
  letter-spacing: 0.1rem;
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
