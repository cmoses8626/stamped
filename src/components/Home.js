import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Edit } from 'react-feather';

export default function Home() {
  const token = uuidv4();
  const storedDocsSize = (
    new Blob(Object.values(localStorage)).size / 1024
  ).toFixed(0);

  return (
    <Wrap>
      <Title>STAMPED</Title>
      <Subtitle>Easily create timestamped notes.</Subtitle>
      <div>
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
      </div>
      <LeftAlignDiv>
        <h4>How it works</h4>
        <ol>
          <li>Create a new document.</li>
          <li>Hit Start to start the document timer.</li>
          <li>Stamped adds a timestamp inline each time you type a period.</li>
          <li>
            You save or download your document. Stamped only saves to your
            browser's local storage, so if you delete your browsing data, you
            lose your document.
          </li>
        </ol>
      </LeftAlignDiv>
      <LeftAlignDiv>
        <h4>
          Your saved docs ({(storedDocsSize / 1000).toFixed(0)} MB of 5 MB used)
        </h4>
        {Object.keys(localStorage).length === 0 ? (
          <p>None</p>
        ) : (
          <ol>
            {Object.keys(localStorage).map(doc => {
              const size =
                new Blob(Object.values(localStorage[doc])).size / 1024;
              return (
                <Link to={doc} key={doc} style={{ color: 'black' }}>
                  <li>
                    {doc}&nbsp;({size.toFixed(0)}kB)
                  </li>
                </Link>
              );
            })}
          </ol>
        )}
      </LeftAlignDiv>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin-top: 100px;
  padding: 10px 15px;
  border: 3px solid black;
`;

const Subtitle = styled.p`
  font-size: 1.1em;
  margin: 0;
`;

const NewButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 50px 0 70px 0;
`;

const LeftAlignDiv = styled.div`
  width: 50%;
  text-align: left;
  li {
    line-height: 1.5;
  }

  @media screen and (max-width: 400px) {
    .left,
    .main,
    .right {
      width: 100%; /* The width is 100%, when the viewport is 400px or smaller */
    }
  }
`;
