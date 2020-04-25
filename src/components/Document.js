import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { Download, Home, Play, Pause, Save } from 'react-feather';
import { useTable } from 'react-table';
import Table from './Table';
import { useStopwatch } from '../util/customHooks';

const { parse } = require('json2csv');

// function replaceCaret(el) {
//   // Place the caret at the end of the element
//   const target = document.createTextNode('');
//   el.appendChild(target);
//   // do not move caret if element was not focused
//   const isTargetFocused = document.activeElement === el;
//   if (target !== null && target.nodeValue !== null && isTargetFocused) {
//     const sel = window.getSelection();
//     if (sel !== null) {
//       const range = document.createRange();
//       range.setStart(target, target.nodeValue.length);
//       range.collapse(true);
//       sel.removeAllRanges();
//       sel.addRange(range);
//     }
//     if (el instanceof HTMLElement) el.focus();
//   }
// }

const EditableCell = ({
  rowIndex,
  columnIndex,
  updateData,
  onKeyUp,
  time,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue);
  const [pos, setPos] = useState(null);
  const [targetRange, setTargetRange] = useState();
  const cellRef = useRef(null);

  const onBlur = e => {
    const text = e.currentTarget.innerText;
    setValue(text);
    updateData(rowIndex, columnIndex, e.currentTarget.innerText);
  };

  const handleKeyPress = e => {
    if (e.key === '.') {
      const {
        currentTarget: { dataset },
      } = e;

      // Get caret position after period
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);

      // Insert "[time]" after period
      const newNode = document.createElement('span');
      newNode.appendChild(document.createTextNode(` [${time}] `));
      const timestamp = ` [${time}] `;
      const timestampNode = document.createTextNode(timestamp);
      range.insertNode(document.createTextNode(' '));
      range.insertNode(newNode);
      range.collapse(false);
    }
  };

  // Set dynamic styles
  let style = {};
  if (columnIndex === 0) {
    // Sticky first column & shaded bg
    style = {
      ...style,
      position: 'sticky',
      left: 0,
      backgroundColor: '#f2f2f2',
    }
  }
  else if (rowIndex === 0) {
    // Shaded bg for first row
    style = {
      ...style,
      backgroundColor: '#f2f2f2',
    }
  }
  else {
    style = {
      ...style,
      marginLeft: '350px',
      overflowX: 'scroll',
    }
  }

  return (
    <td
      contentEditable="true"
      value={value}
      onBlur={onBlur}
      onKeyUp={handleKeyPress}
      data-row={rowIndex}
      data-col={columnIndex}
      ref={cellRef}
      style={style}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default function Document() {
  // Default empty array
  const numRows = 100;
  const numColumns = 25;
  const emptyRow = new Array(numColumns).fill('', 0);
  const emptyArray = new Array(numRows).fill(emptyRow, 0);

  const { id } = useParams();
  const [data, setData] = useState(
    () => JSON.parse(localStorage.getItem(id)) || emptyArray
  );
  const [saveStatus, setSaveStatus] = useState('Save');
  const [notes, setNotes] = useState(''); // useState(() => localStorage.getItem(id) || '');
  const {
    elapsedTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  } = useStopwatch();

  // Ref
  const tableRef = useRef();

  // Extend table size if default array is larger than previously saved data
  const newArray = [...emptyArray];
  if (data.length < numRows || data[0].length < numColumns) {
    data.map((row, r) => {
      row.map((col, c) => {
        newArray[r,c] = data[r,c];
      });
    });
    setData(newArray);
  }

  // Wrapper around setData to deal with 2D data and pull state changes up
  const updateData = (rowIndex, columnIndex, value) => {
    setData(prevData =>
      prevData.map((row, i) => {
        const tempRow = [...row];
        if (i === rowIndex) tempRow[columnIndex] = value;
        return tempRow;
      })
    );
  };

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
      localStorage.setItem(id, JSON.stringify(data));
    }, 5000);
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [data, id]);

  const handleStartStop = () => {
    isRunning ? stopTimer() : startTimer();
  };

  const handleChange = e => {
    setNotes(e.target.value);
  };

  const saveAll = () => {
    // Change Save button text to Saved! for 3 sec
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus('Save'), 3000);

    // Get table data
    const arr = new Array(numRows).fill(emptyRow, 0);
    const updatedData = arr.map((row, rowIndex) =>
      row.map(
        (cell, columnIndex) =>
          tableRef.current.rows[rowIndex].childNodes[columnIndex].innerText
      )
    );

    // Set state and save to local storage
    localStorage.setItem(id, JSON.stringify(updatedData));
    setData(updatedData);
  };

  const download = () => {
    // Create csv from data
    const csv = parse(data, { header: false });

    // Create a hidden link (enables you to name the downloaded file)
    const link = document.createElement('a');
    const blob = new Blob([
      new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM to force Excel to UTF-8
      csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = 'stamped.csv';
    link.style = 'display: none';
    document.body.appendChild(link);
    link.click();

    // Clean up for memory management
    window.URL.revokeObjectURL(url);
  };

  return (
    <Wrap>
      <Header>
        <FlexRow>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
            }}
          >
            <HomeButton>
              <Home size={15} style={{ color: 'black' }} />
            </HomeButton>
          </Link>
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
        <FlexRow>
          <SaveButton onClick={saveAll}>
            <Save size={15} style={{ paddingRight: '5px' }} />
            {saveStatus}
          </SaveButton>
          <DownloadButton onClick={download}>
            <Download size={15} style={{ paddingRight: '5px' }} />
            Download
          </DownloadButton>
        </FlexRow>
      </Header>
      <Content>
        <Styles>
          <table ref={tableRef}>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <EditableCell
                      key={`${rowIndex}${columnIndex}`}
                      data-row={rowIndex}
                      data-col={columnIndex}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      updateData={updateData}
                      time={time}
                      initialValue={cell}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Styles>
      </Content>
    </Wrap>
  );
}

const Styles = styled.div`
  position: relative;
  overflow-x: auto;

  span {
    color: #b5b5b5;
  }

  table {
    border: thin solid #e2e3e3;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    td {
      padding: 5px;
      border: thin solid #e2e3e3;
      font-size: 10pt;
      outline: none;
      vertical-align: bottom;
      min-width: 350px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e5e5e5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 95vw;
  margin: 20px 0 10px 0;
`;

const FlexRow = styled.div`
  display: flex;
`;

const Content = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  /* flex-grow: 1; */
  /* min-width: 80vw; */
  max-width: 100vw;
`;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  margin-right: 5px;
  padding-left: 0;
`;

const Timer = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledInput = styled.textarea`
  /* display: flex; */
  /* flex-grow: 1; */
  /* border: none; */
  border-collapse: collapse;
  overflow: hidden;
  font-size: 1em;
  outline: none;
  /* padding: 50px; */
  resize: none;
`;
