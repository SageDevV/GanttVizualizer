import React from 'react';

interface TaskListHeaderProps {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}

export const PortugueseTaskListHeader: React.FC<TaskListHeaderProps> = ({
  headerHeight,
  rowWidth,
  fontFamily,
  fontSize,
}) => {
  const columnStyle: React.CSSProperties = {
    width: rowWidth,
    paddingLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRight: '1px solid #ebebeb',
    fontWeight: 'bold',
    color: '#555',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: headerHeight,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderBottom: '1px solid #ebebeb',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={columnStyle}>Nome</div>
      <div style={columnStyle}>Início</div>
      <div style={{ ...columnStyle, borderRight: 'none' }}>Fim</div>
    </div>
  );
};
