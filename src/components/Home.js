import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Edit } from 'react-feather';
import { amplitudeEvent, amplitudeIdentify } from '../util/tracking';

export default function Home() {
  const token = uuidv4();
  const [documentIds, setDocumentIds] = useState(() => {
    const ids = [];
    // only grab our documents from localStorage
    Object.keys(localStorage).forEach(id => {
      if (RegExp(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/).test(id)) ids.push(id);
    });
    return ids;
  });
  const storedDocsSize = (
    new Blob(Object.values(localStorage)).size / 1024
  ).toFixed(0);

  // Log amplitude events on page load
  useEffect(() => {
    amplitudeEvent('Home - Page Viewed');
    amplitudeIdentify({ documents: localStorage.length });
  }, []);

  // Log event on New button click
  const handleClick = eventName => {
    amplitudeEvent(eventName);
  };

  return (
    <Wrap>
      <Title>STAMPED</Title>
      <Subtitle>Easily create timestamped notes.</Subtitle>
      <div>
        <Link
          to={token}
          onClick={() => handleClick('Home - New Document')}
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
      <LeftAlignDiv style={{ marginBottom: '30px' }}>
        <h4>
          Your saved docs ({(storedDocsSize / 1000).toFixed(0)} MB of 5 MB used)
        </h4>
        {Object.keys(localStorage).length === 0 ? (
          <p>None</p>
        ) : (
          <ol>
            {documentIds.map(id => {
              const size =
                new Blob(Object.values(localStorage[id])).size / 1024;
              return (
                <Link
                  to={id}
                  key={id}
                  style={{ color: 'black' }}
                  onClick={() => handleClick('Home - Load Document')}
                >
                  <li>
                    {id}&nbsp;({size.toFixed(0)}kB)
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
