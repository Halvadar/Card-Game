import React, { useEffect, useRef, useState, useCallback } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import styled, { createGlobalStyle } from "styled-components";
import Card from "./components/Card";
import Info from "./components/Info";
import Login from "./components/Login";
import Cards from "./components/Cards";
import GameInfo from "./components/GameInfo";
import BurgerNav from "./components/BurgerNav";
import WindowInfo from "./components/WindowInfo";
import Loading from "./public/Loading.svg";
import { LoadingImg } from "./components/Cards";
import { cardImageInitializer, scoreCalculator } from "./functions";
const firebaseConfig = {
  apiKey: "AIzaSyDNSZ31RYwTbdfVar02zwZAtBzc2OYfGxo",
  authDomain: "card-game-2c6cb.firebaseapp.com",
  projectId: "card-game-2c6cb",
  storageBucket: "card-game-2c6cb.appspot.com",
  messagingSenderId: "1093466034026",
  appId: "1:1093466034026:web:f0e1c493db29e44a759f13",
  measurementId: "G-TKFCP861PS",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();
const imagesRef = storageRef.child("Images");

const GlobalStyle = createGlobalStyle`
  body{
    margin:0;
  }
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
  height: 100vh;
  width: 70%;
  margin: auto;
`;
const GeneralError = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 50vw;
  height: 50vh;
  transform: translate(-50%, -50%);
  border: 1px solid gray;
  background: #f7f7f7;
  color: #ff4848;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
`;

function App() {
  const { windowInfo } = WindowInfo();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [cardImageUrls, setCardImageUrls] = useState(null);
  const [cardStates, setCardStates] = useState(null);
  const [tries, setTries] = useState(0);
  const [guesses, setGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [didntGuessStreak, setDidntGuessStreak] = useState(0);
  const [currentFlippedCard, setCurrentFlippedCard] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [timeLeftState, setTimeLeftState] = useState(120);
  const errorRef = useRef();
  const scoreRef = useRef(0);
  const guessesRef = useRef(0);
  const triesRef = useRef(0);
  const didntGuessStreakRef = useRef(0);
  const timeLeftRef = useRef(120);

  const timeLeftInterval = useRef();
  const animationTimeOutRef = useRef();
  const allImagesRef = useRef();
  const [started, setStarted] = useState(false);
  const [shouldContinue, setShouldContinue] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const gameFinishedTimeoutRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(
    Array.from({ length: 12 }, () => false)
  );
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const googleLogin = async () => {
    setLoginError("");
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          onLoginFunction(result.user);
        })
        .catch((err) => {
          setLoginError(err.message);
        });
    });
  };

  const facebookLogin = async () => {
    setLoginError("");
    const provider = new firebase.auth.FacebookAuthProvider();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return auth
        .signInWithPopup(provider)
        .then((result) => {
          onLoginFunction(result.user);
        })
        .catch((err) => {
          setLoginError(err.message);
        });
    });
  };
  const onLoginFunction = (user) => {
    setLoginLoading(false);
    setCurrentUserId(user.uid);
    setCurrentUser(user.displayName);
    setLoggedIn(true);
    var userRef = firestore.collection("users").doc(user.uid);
    userRef
      .get()
      .then((user) => {
        let cardsShouldBeInitialized = true;
        if (user.exists) {
          const { history, shouldContinue } = user.data();
          setHistory(history);
          if (shouldContinue) {
            cardsShouldBeInitialized = false;
          }
        }
        if (cardsShouldBeInitialized) {
          cardImageInitializer(
            setCardImageUrls,
            setCardStates,
            imagesRef,
            allImagesRef,
            setDataInitialized,
            timeLeftInterval,
            timeLeftRef.current
          );
        } else {
          const {
            score,
            tries,
            guesses,
            timeLeftState,
            didntGuessStreak,
            currentFlippedCard,
            cardImageUrls,
            cardStates,
            shouldContinue,
          } = user.data();
          setGuesses(guesses);
          guessesRef.current = guesses;
          setScore(score);
          scoreRef.current = score;
          setTries(tries);
          triesRef.current = tries;
          setTimeLeftState(timeLeftState);
          timeLeftRef.current = timeLeftState;
          setDidntGuessStreak(didntGuessStreak);
          didntGuessStreakRef.current = didntGuessStreak;
          setCurrentFlippedCard(currentFlippedCard);
          setCardImageUrls(cardImageUrls);
          setCardStates(cardStates);
          setShouldContinue(shouldContinue);
          setDataInitialized(true);
        }
      })
      .catch((err) => {
        errorFunction(err.message);
      });
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        onLoginFunction(user);
      } else {
        setLoginLoading(false);
      }
    });

    return () => {
      clearTimeout(gameFinishedTimeoutRef.current);
      clearTimeout(animationTimeOutRef.current);
    };
  }, []);
  useEffect(() => {
    if (!imageLoaded.includes(false) && dataInitialized) {
      setLoading(false);
    }
  }, [dataInitialized, imageLoaded]);
  const onGameFinish = () => {
    setGameFinished(true);
    clearInterval(timeLeftInterval.current);
    setHistory(() => {
      const newHistory = [
        ...history,
        {
          tries: triesRef.current,
          score: scoreRef.current,
          timeNeeded: 120 - timeLeftRef.current,
          createdAt: new Date().getTime(),
        },
      ];
      setSaving(true);
      firestore
        .collection("users")
        .doc(currentUserId)
        .set({ history: newHistory })
        .then(() => {
          setSaving(false);
        })
        .catch((err) => {
          errorFunction(err.message);
          setSaving(false);
        });
      return newHistory;
    });
    gameFinishedTimeoutRef.current = setTimeout(() => {
      setGameFinished(false);
      clearTimeout(gameFinishedTimeoutRef.current);

      setLoading(true);
      setDataInitialized(false);
      cardImageInitializer(
        setCardImageUrls,
        setCardStates,
        imagesRef,
        allImagesRef,
        setDataInitialized,
        timeLeftInterval,
        timeLeftRef.current
      );

      guessesRef.current = 0;
      setGuesses(0);
      triesRef.current = 0;
      setTries(0);
      scoreRef.current = 0;
      setScore(0);
      timeLeftRef.current = 120;
      setTimeLeftState(120);
      setStarted(false);
      setShouldContinue(false);
      setCardStates((prevState) =>
        prevState.map((card) => ({ ...card, flipped: false }))
      );
    }, 3000);
  };
  useEffect(() => {
    if (started) {
      timeLeftInterval.current = setInterval(() => {
        if (timeLeftRef.current > 0) {
          timeLeftRef.current = timeLeftRef.current - 1;
          setTimeLeftState(timeLeftRef.current);
        } else {
          onGameFinish();
          clearInterval(timeLeftInterval.current);
        }
      }, 1000);
      return () => {
        clearInterval(timeLeftInterval.current);
      };
    }
  }, [started]);

  const onCardClickFunction = (index) => {
    if (cardStates[index].flipped || animationInProgress || !started) {
      return;
    }
    setCardStates((prevState) => {
      return prevState.map((item, arrIndex) => {
        if (arrIndex === index) {
          return { ...item, flipped: true };
        }
        return item;
      });
    });
    setAnimationInProgress(true);
    animationTimeOutRef.current = setTimeout(() => {
      setAnimationInProgress(false);

      if (currentFlippedCard === null) {
        return setCurrentFlippedCard(index);
      }
      if (
        cardStates[currentFlippedCard].urlIndex === cardStates[index].urlIndex
      ) {
        scoreRef.current =
          scoreRef.current +
          scoreCalculator(
            guessesRef.current,
            triesRef.current,
            timeLeftRef.current,
            didntGuessStreakRef.current
          );
        setScore(scoreRef.current);
        triesRef.current += 1;
        setTries(triesRef.current);

        didntGuessStreakRef.current = 0;
        setDidntGuessStreak(0);
        setCurrentFlippedCard(null);
        guessesRef.current += 1;
        setGuesses(guessesRef.current);
        if (guessesRef.current === 6) {
          onGameFinish();
        }

        return;
      }
      triesRef.current += 1;
      setTries(triesRef.current);
      didntGuessStreakRef.current += 1;
      setDidntGuessStreak(didntGuessStreakRef.current);
      setCurrentFlippedCard(null);
      setCardStates((prevState) => {
        return prevState.map((item, arrIndex) => {
          if (arrIndex === index || arrIndex === currentFlippedCard) {
            return { ...item, flipped: false };
          }
          return item;
        });
      });
    }, 500);
  };

  const start = () => {
    if (dataInitialized) {
      setStarted(true);
      setShouldContinue(true);
    }
  };

  const signOut = () => {
    saveData();
    firebase
      .auth()
      .signOut()
      .then(() => {
        setLoggedIn(false);
        setCurrentUser("");
      });
  };
  const errorFunction = (errorMessage) => {
    setGeneralError(errorMessage);
    errorRef.current = setTimeout(() => {
      setGeneralError("");
      clearTimeout(errorRef.current);
    }, 5000);
  };
  const saveData = () => {
    setStarted(false);
    setSaving(true);
    firestore
      .collection("users")
      .doc(currentUserId)
      .set({
        score,
        tries,
        guesses,
        timeLeftState,
        didntGuessStreak,
        currentFlippedCard,
        history,
        cardImageUrls,
        cardStates,
        shouldContinue,
      })
      .then(() => {
        setSaving(false);
      })
      .catch((err) => {
        setSaving(false);
        errorFunction(err.message);
      });
  };
  return (
    <MainContainer>
      {generalError.length > 0 && <GeneralError>{generalError}</GeneralError>}
      {!loginLoading ? (
        loggedIn ? (
          <>
            {windowInfo.isMobile ? (
              <BurgerNav currentUser={currentUser} signOut={signOut} />
            ) : (
              <Info currentUser={currentUser} signOut={signOut}></Info>
            )}

            <GameInfo
              history={history}
              save={saveData}
              score={score}
              timeLeft={timeLeftState}
              tries={tries}
              isMobile={windowInfo.isMobile}
              loading={loading || saving}
              gameFinished={gameFinished}
            ></GameInfo>

            <Cards
              shouldContinue={shouldContinue}
              start={start}
              started={started}
              loading={loading || saving}
            >
              {dataInitialized &&
                cardStates.map((card, index) => {
                  const { urlIndex, flipped } = card;
                  return (
                    <Card
                      loading={loading || saving}
                      setImageLoaded={setImageLoaded}
                      onCardClickFunction={onCardClickFunction}
                      key={index}
                      imageSrc={cardImageUrls[urlIndex]}
                      flipped={flipped}
                      index={index}
                    />
                  );
                })}
            </Cards>
          </>
        ) : (
          <Login
            error={loginError}
            facebookLogin={facebookLogin}
            googleLogin={googleLogin}
          />
        )
      ) : (
        <LoadingImg srcProp={Loading}></LoadingImg>
      )}
      <GlobalStyle />
    </MainContainer>
  );
}

export default App;
