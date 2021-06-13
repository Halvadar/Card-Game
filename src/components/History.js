import React from "react";
import styled from "styled-components";
import { timeDifference } from "../functions";
import { Score, TimeLeft, Tries } from "./GameInfo";
const HistoryContainer = styled.div`
  height: 50vh;
  display: flex;
  position: absolute;
  background: #a3ddff;
  z-index: 20;
  bottom: 0;
  left: 0;
  margin: 0 !important;
  padding: 2rem 10px 0 10px;
  overflow: auto;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background: #ffffff;
  }
  ::-webkit-scrollbar-thumb {
    background: gray;
  }

  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  transition: 1s transform ease;
  transform: ${(props) => {
    return props.showHistory ? "translateY(100%)" : "translateY(0%)";
  }};
`;
const HistoryItem = styled.div`
  width: 100%;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  > * {
    font-size: 0.8rem !important;
  }
`;

const DateDiv = styled.div`
  color: #ffffff;
`;
const NoGames = styled.div`
  font-size: 1.3rem;
  color: white;
  margin-top: 10px;
`;
const History = ({ history, showHistory, isMobile }) => {
  return (
    <HistoryContainer showHistory={showHistory}>
      {history.length > 0 ? (
        [...history].reverse().map((item, index) => {
          const { tries, score, timeNeeded, createdAt } = item;
          return (
            <HistoryItem key={index}>
              <Score>
                {!isMobile && "Score:"} {score}
              </Score>
              <Tries>
                {!isMobile && "Tries:"} {tries}
              </Tries>

              <TimeLeft>
                {!isMobile && "Time Needed:"} {timeNeeded}
              </TimeLeft>
              <DateDiv> {timeDifference(createdAt)} </DateDiv>
            </HistoryItem>
          );
        })
      ) : (
        <NoGames>No Games Yet</NoGames>
      )}
    </HistoryContainer>
  );
};

export default History;
