import React, {useState, useMemo, useEffect} from 'react';
import {render} from 'react-dom';

const App = () => {
    const [status, setStatus] = useState('off');
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(null);

    const formatTime = useMemo(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return [minutes, seconds].map(v => v < 10 ? `0${v}` : v).join(':');
    }, [time]);

    const playBell = () => {
        const bell = new Audio('./sounds/bell.wav');
        bell.play();
    };

    const startTimer = () => {

        if (timer) {
            clearInterval(timer);
        }


        setTime(1200);
        setStatus('work');

        setTimer(setInterval(() => {
            setTime(time => {
                if (time - 1 === 0) {
                    playBell();


                    setStatus(prevStatus => {
                        const nextStatus = prevStatus === 'work' ? 'rest' : 'work';
                        const nextTime = nextStatus === 'work' ? 1200 : 20;
                        setTime(nextTime);
                        return nextStatus;
                    });
                    return time;
                }
                return time - 1;
            });
        }, 1000));
    };

    const stopTimer = () => {

        clearInterval(timer);
        setTimer(null);


        setTime(0);
        setStatus('off');
    };

    const closeApp = () => {
        window.close();
    };

    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    return (
        <div>
            <h1>Protect your eyes</h1>
            {status === 'off' && (
                <div>
                    <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means
                        you should rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
                    <p>This app will help you track your time and inform you when it's time to rest.</p>
                </div>
            )}
            {status === 'work' && <img src="./images/Work.png" alt="businessman"/>}
            {status === 'rest' && <img src="./images/Rest.png" alt="man who's resting"/>}
            {status !== 'off' && (
                <div className="timer">
                    {formatTime}
                </div>
            )}
            {status === 'off' && <button className="btn" onClick={startTimer}>Start</button>}
            {status !== 'off' && <button className="btn" onClick={stopTimer}>Stop</button>}
            <button className="btn btn-close" onClick={closeApp}>X</button>
        </div>
    );
};

render(<App/>, document.querySelector('#app'));

