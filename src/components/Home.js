import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Edit } from 'react-feather';

export default function Home() {
  const token = uuidv4();

  return (
    <Wrap>
      <header className="App-header">
        <Title>Stamped</Title>
        <p>Easily create timestamped notes.</p>
      </header>
      <Link
        to={token}
        style={{
          textDecoration: 'none',
        }}
      >
        <NewButton>
          <>
            <Edit size={15} style={{ paddingRight: '5px' }} />
            New document
          </>
        </NewButton>
      </Link>
      <LeftAlignDiv>
        <h4>How it works</h4>
        <ol>
          <li>Create a new document.</li>
          <li>Hit the Start button to start the document timer.</li>
          <li>
            Every time you type a period (e.g. end of sentence), Stamped adds a
            timestamp.
          </li>
          <li>
            Download your timestamped document. If you don't, you lose it.
          </li>
        </ol>
      </LeftAlignDiv>
      <LeftAlignDiv>
        <h4 style={{ color: 'red' }}>WARNING!</h4>
        <p>
          Stamped doesn't save your document - anywhere - so if you reload the
          page, you lose your document. If you close the page, you lose your
          document. And for security, if you leave the page unedited for more
          than 2 hours, you lose your document.
        </p>
      </LeftAlignDiv>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 100px;
  text-align: center;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 0;
`;

const NewButton = styled.button`
  display: flex;
  align-items: center;
`;

const LeftAlignDiv = styled.div`
  min-width: 60vw;
  max-width: 60vw;
  text-align: left;
`;
