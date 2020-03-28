import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Download, Play, Pause } from 'react-feather';
import { useTable } from 'react-table';
import Table from './Table';
import { useStopwatch } from '../customHooks';

export default function Document() {
  const { id } = useParams();
  const [notes, setNotes] = useState(() => localStorage.getItem(id) || '');
  const {
    elapsedTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  } = useStopwatch();

  // Format elapsed time in hr:min:sec
  const hours = Math.floor(elapsedTime / 3600).toString();
  const mins = Math.floor((elapsedTime % 3600) / 60).toString();
  const sec = ((elapsedTime % 3600) % 60).toString();
  const time = [
    hours.padStart(2, '0'),
    mins.padStart(2, '0'),
    sec.padStart(2, '0'),
  ].join(':');

  // Autosave 5sec after last edit
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(id, notes);
    }, 5000);
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [id, notes]);

  const handleStartStop = () => {
    isRunning ? stopTimer() : startTimer();
  };

  const handleKeyPress = e => {
    if (e.key === '.') {
      setNotes(`${notes} [${time}] `);
    }
  };

  const handleChange = e => {
    setNotes(e.target.value);
  };

  return (
    <Wrap>
      <Header>
        <FlexRow>
          <Timer onClick={handleStartStop}>
            {isRunning === false ? (
              <>
                <Play size={15} style={{ paddingRight: '5px' }} />
                {elapsedTime === 0 ? 'Start Timer' : 'Resume Timer'}
              </>
            ) : (
              <>
                <Pause size={15} style={{ paddingRight: '5px' }} />
                {time}
              </>
            )}
          </Timer>
          <Timer
            style={{ color: '#000', backgroundColor: 'transparent' }}
            onClick={() => resetTimer()}
          >
            Reset Timer
          </Timer>
        </FlexRow>
        <DownloadButton>
          <Download size={15} style={{ paddingRight: '5px' }} />
          Download
        </DownloadButton>
      </Header>
      <Content>
        {/* <Table /> */}
        <StyledInput
          rows={30}
          cols={100}
          placeholder="Write your notes"
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          value={notes}
        >
          {notes}
        </StyledInput>
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e5e5e5;
  min-height: 100vh;
`;

const Content = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 80vw;
  max-width: 80vw;
`;

const Header = styled.div`
  display: flex;
  margin: 20px 0 10px 0;
  min-width: 80vw;
  max-width: 80vw;
  justify-content: space-between;
`;

const FlexRow = styled.div`
  display: flex;
`;

const Timer = styled.button`
  display: flex;
  align-items: center;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.textarea`
  display: flex;
  flex-grow: 1;
  border: none;
  font-size: 1em;
  outline: none;
  padding: 50px;
  resize: none;
`;
