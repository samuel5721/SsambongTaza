import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { db } from '../firebase'; // Ensure this path is correct

import Header from '../components/Header';
import category from "../module";

function StorageScreen() {
  const [documents, setDocuments] = useState([]);
  const [checkedIndex, setCheckedIndex] = useState(-1);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 'user_storage' 컬렉션의 'admin' 문서 참조
        const adminDocRef = doc(db, 'user_storage', 'admin');
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          const refPaths = adminData.ref.map(refItem => refItem.path);
          
          const documentPromises = refPaths.map(async (path) => {
            const refDocSnap = await getDoc(doc(db, path));
            if (refDocSnap.exists()) {
              const refData = refDocSnap.data();
              return {
                title: refData.title,
                topic: refData.topic,
                line: refData.line,
              };
            } else {
              return {
                title: 'No title found',
                topic: 'NE',
                line: 0,
              };
            }
          });

          const documentsArray = await Promise.all(documentPromises);
          console.log(documentsArray);
          setDocuments(documentsArray);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log('Error fetching admin data: ', error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    if (checkedIndex === -1) {
      return;
    }
  }, [checkedIndex]);

  return (
    <>
      <Header />
      <Section>
        <FrontText>긴글타자연습</FrontText>
        <StorageBox>
          <ArticleBox>
            <Article isChecked={checkedIndex === -1} onClick={() => { setCheckedIndex(-1); }}>
              <Title>무작위 긴 글</Title>
              <DetailBox>
                <Detail>300줄</Detail>
              </DetailBox>
            </Article>
            <br />
            {
              documents.map((doc, index) => (
                <Article key={index} isChecked={checkedIndex === index} onClick={() => { setCheckedIndex(index); }}>
                  <Title>{doc.title}</Title>
                  <DetailBox>
                    <Detail>{category[doc.topic]}</Detail>
                    <Detail>{doc.line}줄</Detail>
                  </DetailBox>
                </Article>
              ))
            }
          </ArticleBox>
          <ButtonBox>
            <SizeButton>내 작업실에서 불러오기</SizeButton>
            <SizeButton>글마당에서 불러오기</SizeButton>
            <SizeButton commit={true} onClick={() => { console.log(documents); }}>시작하기</SizeButton>
          </ButtonBox>
        {/* <ul>
          {documents.map((doc, index) => (
            <li key={index}>
              <h2>{doc.title}</h2>
              <p><strong>Topic:</strong> {doc.topic}</p>
              <p><strong>Lines:</strong> {doc.line}</p>
            </li>
          ))}
        </ul> */}
        </StorageBox>
      </Section>
    </>
  );
}

const Section = styled.section`
  margin-top: 9rem;
  padding: 0 10rem;
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 3rem;
  min-height: 100vh;
`;

const FrontText = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const StorageBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const ArticleBox = styled.div`
  flex-grow: 5;
  height: 25rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #8f8f8f;
  border-radius: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    margin-right: 7px;
    width: 7px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-button {
    display: block;
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    opacity: 1;
    border-radius: 10px;
  }
`;

const Article = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  background-color: ${props => props.isChecked ? '#E8EAFF' : 'white'};
  border: 1px solid ${props => props.isChecked ? '#3347F7' : '#272727'};
  border-radius: 10px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 400;
  font-family: 'NanumGothic', sans-serif;
`;

const DetailBox = styled.div`
  display: flex;
  gap: 1rem;
`;

const Detail = styled.div`
  font-size: 16px;
  font-family: 'NanumGothic', sans-serif;
`;

const ButtonBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 1rem;
`;

const SizeButton = styled.button` 
  height: 4.5rem;
  color: ${props => props.commit ? 'white' : '#272727'};
  background-color: ${props => props.commit ? '#3347F7' : 'white'};
  border: ${props => props.commit ? 'none' : '1px solid #8f8f8f'};
  border-radius: 20px;
  font-size: 24px;
  font-family: 'NanumGothic', sans-serif;
  font-weight: 400;
  font-family: 'NanumGothic', sans-serif;
`;

export default StorageScreen;
