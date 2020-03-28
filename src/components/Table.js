import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTable } from 'react-table';
import { useParams } from 'react-router-dom';

// Editable cell renderer for default column
const EditableCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  updateData, // passed to useTable so available here
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  return <div contentEditable="true" value={value} onChange={onChange} />;
};

function TableRenderer({ columns, data, updateData }) {
  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns,
    data,
    defaultColumn: { Cell: EditableCell },
    updateData,
  });

  return (
    <table {...getTableProps()}>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Table() {
  const { id } = useParams();
  const [data, setData] = useState(() => {
    const defaultData = [
      { col1: '', col2: '' },
      { col1: '', col2: '' },
    ];
    return localStorage.getItem(id) || defaultData;
  });

  // Wrapper around setData to deal with 2D data
  const updateData = (rowIndex, columnId, value) => {
    setData(prev =>
      prev.map((row, index) => {
        if (index === rowIndex)
          return {
            ...prev[rowIndex],
            [columnId]: value,
          };
        return row;
      })
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    []
  );

  return (
    <Styles>
      <TableRenderer columns={columns} data={data} updateData={updateData} />
    </Styles>
  );
}

const Styles = styled.div`
  table {
    border: thin solid #e2e3e3;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    width: 100%;
    td {
      padding: 5px;
      border: thin solid #e2e3e3;
      div {
        background-color: #f7f7f7;
        font-size: 1em;
        border: 0;
        outline: none;
        /* width: 100%; */
        /* resize: none; */
      }
    }
  }
  textarea {
    font-size: 1rem;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    resize: none;
  }
`;
