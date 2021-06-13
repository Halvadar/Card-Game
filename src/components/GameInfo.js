import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { format } from "../functions";
import Arrow from "../public/Arrow.svg";
import History from "./History";
import Loading from "../public/Loading.svg";
const GameInfoContainer = styled.div`
  position: fixed;
  border: 0 !important;

  top: 0;
  @media (max-width: 768px) {
    right: 0;
    left: initial;
    transform: initial;
  }
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
`;
const InfoHistoryCont = styled.div`
  position: relative;
`;
const InfoCont = styled.div`
  background: rgb(137, 198, 255, 0.5);
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  > * {
    margin: 0 10px;
  }
`;
const HistoryCont = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  width: 150%;
  box-sizing: border-box;
  z-index: -1;
`;

const GameInfoDivs = styled.div`
  width: max-content;
  white-space: nowrap;
`;

export const Score = styled(GameInfoDivs)`
  color: green;
`;
export const TimeLeft = styled(GameInfoDivs)`
  color: red;
`;
export const Tries = styled(GameInfoDivs)`
  color: blue;
`;

const Save = styled.div`
  left: 0;
  padding: 5px;
  margin-right: 10px;
  height: 100%;
  font-size: 1.2rem;
  text-align: center;
  background: #5eb1ff;
  color: white;
  cursor: pointer;
`;
const ArrowImg = styled.img.attrs((props) => ({
  src: props.srcProp,
}))`
  transition: transform 1s ease;

  transform: ${(props) =>
    props.showHistory ? "rotate(-180deg)" : "rotate(0deg)"};
  cursor: pointer;
  margin: 0 10px;
  width: 1rem;
`;

const GameFinished = styled(InfoCont)`
  position: fixed;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  padding: 15px;
  border-radius: 3px;
  background: rgb(151, 255, 174);
  z-index: 30;
`;
const GameInfo = ({
  isMobile,
  history,
  save,
  score,
  timeLeft,
  tries,
  gameFinished,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [finishedScores, setFinishedScores] = useState({
    score: 0,
    tries: 0,
    timeNeeded: 0,
  });

  useEffect(() => {
    if (history.length > 0) {
      setFinishedScores(() => {
        const historyLastItem = history[history.length - 1];
        return historyLastItem;
      });
    }
  }, [history]);

  return (
    <>
      {gameFinished && (
        <GameFinished>
          <Score>Score: {finishedScores.score}</Score>
          <Tries>Tries: {finishedScores.tries}</Tries>

          <TimeLeft>Time Needed: {format(finishedScores.timeNeeded)}</TimeLeft>
        </GameFinished>
      )}

      <GameInfoContainer isMobile={isMobile}>
        <Save onClick={() => save()}>Save</Save>
        <InfoHistoryCont>
          <InfoCont>
            <Score>
              {!isMobile && "Score:"} {score}
            </Score>
            <Tries>
              {!isMobile && "Tries:"} {tries}
            </Tries>

            <TimeLeft>
              {!isMobile && "Time Left:"} {format(timeLeft)}
            </TimeLeft>
          </InfoCont>
          <HistoryCont>
            <History
              isMobile={isMobile}
              showHistory={showHistory}
              history={history}
            />
          </HistoryCont>
        </InfoHistoryCont>
        <ArrowImg
          showHistory={showHistory}
          onClick={() => setShowHistory(!showHistory)}
          srcProp={Arrow}
        ></ArrowImg>
      </GameInfoContainer>
    </>
  );
};

export default GameInfo;
