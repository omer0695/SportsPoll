import React, { useState, useEffect } from 'react';
import * as voteType from '../../VoteTypes';
import data from '../../data/test-assignment.json';
import './Poll.css'

const Poll = ({ currentSport }) => {

    const loadFromLocalStorage = () => {
        try {
            const serializedState = localStorage.getItem('voteStorage');
            return JSON.parse(serializedState);
        } catch (e) {
            console.log(e);
            return null
        }
    }

    // Pick a random index to display sport
    const [index] = useState(Math.floor(Math.random() * data.length));

    // Use current sport to set background wallpaper
    currentSport(data[index].sport);

    // User can cast vote only once on each pageload
    const [voteCasted, setVoteCasted] = useState(false);

    // include casted vote in state (add in previous count)
    const [voteState, setVoteState] = useState(() => {
        let storageData = loadFromLocalStorage();
        if (storageData === null || storageData.length === 0 || !storageData.some(obj => obj.id === data[index].id)) {
            return { id: data[index].id };
        } else {
            return storageData.filter(obj => obj.id === data[index].id)[0];
        }
    });

    // update local storage each time voteState is changed
    useEffect(() => {
        const saveToLocalStorage = (state) => {
            try {
                if (Object.keys(state).length === 1) {
                    return false;
                }
                let previousState = loadFromLocalStorage();
                if (previousState !== null) {
                    previousState = previousState.filter(obj => obj.id !== state.id);
                }

                let presentState = previousState === null ? [state] : [...previousState, state];
                localStorage.setItem('voteStorage', JSON.stringify(presentState));
            } catch (e) {
                console.log(e);
            }
        }
        saveToLocalStorage(voteState);
    }, [voteState]);

    // click action when a vote is casted
    const addUpvote = (voteType) => {
        setVoteCasted(true);
        let updatedVotes = typeof (voteState[voteType]) == 'undefined' ? 1 : voteState[voteType] + 1;
        setVoteState(Object.assign({}, voteState, { [voteType]: updatedVotes }));
    }

    // display total number of votes
    const displayVotes = (voteType) => {
        if (typeof (voteState) === 'undefined' || typeof (voteState[voteType]) === 'undefined') {
            return 0;
        } else {
            return voteState[voteType];
        }
    }

    // match status is shown as LED light on front-end
    const getMatchStatusLight = (status) => {
        switch (status) {
            case "STARTED":
                return "led-green";
            case "FINISHED":
                return "led-red";
            case "NOT_STARTED":
                return "led-yellow";
            default:
                return "led-red";
        }
    }

    return (
        <div className="pollBox">
            <div className="hdr">
                <div title={data[index].state.replace('_', ' ')} className={getMatchStatusLight(data[index].state)}></div>
                <div className="hdrTxt"> {data[index].name} 
                <div className={"live " + (data[index].state === 'STARTED' ? 'show' : 'hide')}></div>
                </div>
                <div className="group">{data[index].group} Group</div>
            </div>

            <div className="pollContent">
                <div className="sportsName "><img src={data[index].sport.toLowerCase() + '.png'}
                    alt={data[index].sport} title={data[index].sport} /></div>

                <div className="flag"><img src={data[index].country.toLowerCase() + '.png'}
                    alt={data[index].country} title={data[index].country} /> </div>

                <div className="clear"></div>

                <div className="matchTeams">
                    <div>{data[index].homeName}</div>
                    <div className="vsBox">VS</div>
                    <div>{data[index].awayName}</div>
                </div>

                <div className={"matchDetail animated " + (voteCasted === false ? '' : 'bounceOutDown closed')}>
                    <div>
                        <button onClick={() => { addUpvote(voteType.HOME_VOTES_COUNT) }}>
                            <span>Vote for Home Team</span>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => { addUpvote(voteType.DRAW_VOTES_COUNT) }}>
                            <span className="drawBtn">Vote for Draw</span>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => { addUpvote(voteType.AWAY_VOTES_COUNT) }}>
                            <span>Vote for Away Team</span>
                        </button>
                    </div>
                </div>
                
                <div className={"matchDetail results animated " + (voteCasted === true ? 'bounceInDown' : 'hide')}>
                    <div>{displayVotes(voteType.HOME_VOTES_COUNT)} <span>Home team</span></div>
                    <div>{displayVotes(voteType.DRAW_VOTES_COUNT)} <span>Draw</span></div>
                    <div>{displayVotes(voteType.AWAY_VOTES_COUNT)} <span>Away team</span></div>
                </div>
            </div>
        </div>
    );
}


export default Poll;